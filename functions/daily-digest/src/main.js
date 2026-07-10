import { Client, Databases, ID, Messaging, Query } from "node-appwrite";

const CONFIG = {
  endpoint: process.env.APPWRITE_ENDPOINT || process.env.APPWRITE_FUNCTION_API_ENDPOINT || "https://nyc.cloud.appwrite.io/v1",
  projectId: process.env.APPWRITE_FUNCTION_PROJECT_ID || process.env.APPWRITE_PROJECT_ID || "6a41f0a600372166cc8a",
  databaseId: process.env.DAILY_OPS_DATABASE_ID || process.env.APPWRITE_DATABASE_ID || "daily_ops",
  workspaceCollectionId:
    process.env.DAILY_OPS_WORKSPACE_COLLECTION_ID || process.env.APPWRITE_WORKSPACE_COLLECTION_ID || "workspaces",
  appUrl: process.env.DAILY_OPS_APP_URL || "https://smasifhossain.github.io/Daily-Ops-Hub/",
  defaultTime: process.env.DAILY_DIGEST_TIME || "08:00",
  defaultTimeZone: process.env.DAILY_DIGEST_DEFAULT_TIMEZONE || "America/Chicago",
};

export default async ({ req, res, log, error }) => {
  const force = req.query?.force === "1";
  const dryRun = req.query?.dryRun === "1";
  const apiKey = req.headers["x-appwrite-key"] || process.env.APPWRITE_API_KEY;

  if (!apiKey) {
    error("Missing Appwrite function API key. Check function scopes and dynamic API key access.");
    return res.json({ ok: false, error: "Missing function API key" }, 500);
  }

  const client = new Client().setEndpoint(CONFIG.endpoint).setProject(CONFIG.projectId).setKey(apiKey);
  const databases = new Databases(client);
  const messaging = new Messaging(client);
  const now = new Date();
  const result = {
    checked: 0,
    eligible: 0,
    sent: 0,
    skipped: 0,
    failed: 0,
    dryRun,
    force,
  };

  try {
    for await (const document of listWorkspaceDocuments(databases)) {
      result.checked += 1;
      const workspace = parseWorkspace(document);
      if (!workspace || !document.userId) {
        result.skipped += 1;
        continue;
      }

      const decision = digestDecision(workspace, now, force);
      if (!decision.send) {
        result.skipped += 1;
        continue;
      }

      result.eligible += 1;
      const digest = buildDigest(workspace, document, decision.localDate, decision.timeZone);

      try {
        if (!dryRun) {
          await messaging.createEmail({
            messageId: ID.unique(),
            subject: digest.subject,
            content: digest.html,
            users: [document.userId],
            html: true,
          });

          workspace.settings = workspace.settings || {};
          workspace.settings.emailDigest = {
            ...normalizeDigestSettings(workspace.settings.emailDigest),
            lastSentDate: decision.localDate,
            lastSentAt: now.toISOString(),
          };

          await databases.updateDocument({
            databaseId: CONFIG.databaseId,
            collectionId: CONFIG.workspaceCollectionId,
            documentId: document.$id,
            data: {
              payload: JSON.stringify(workspace),
              updatedAt: now.toISOString(),
            },
          });
        }

        result.sent += 1;
        log(`Daily digest ${dryRun ? "prepared" : "sent"} for ${document.userId} (${decision.localDate}).`);
      } catch (sendError) {
        result.failed += 1;
        error(`Daily digest failed for ${document.userId}: ${sendError.message || sendError}`);
      }
    }

    return res.json({ ok: true, ...result });
  } catch (runError) {
    error(runError.message || String(runError));
    return res.json({ ok: false, error: runError.message || "Daily digest failed", ...result }, 500);
  }
};

async function* listWorkspaceDocuments(databases) {
  const limit = 100;
  let offset = 0;

  while (true) {
    const page = await databases.listDocuments({
      databaseId: CONFIG.databaseId,
      collectionId: CONFIG.workspaceCollectionId,
      queries: [Query.limit(limit), Query.offset(offset)],
    });

    const documents = page.documents || [];
    for (const document of documents) yield document;
    if (documents.length < limit) break;
    offset += documents.length;
  }
}

function parseWorkspace(document) {
  try {
    const workspace = JSON.parse(document.payload || "{}");
    if (!workspace || typeof workspace !== "object") return null;
    workspace.settings = workspace.settings || {};
    return workspace;
  } catch {
    return null;
  }
}

function digestDecision(workspace, now, force) {
  const settings = normalizeDigestSettings(workspace.settings?.emailDigest);
  const timeZone = safeTimeZone(settings.timeZone || CONFIG.defaultTimeZone);
  const local = localParts(now, timeZone);
  const targetHour = Number((settings.time || CONFIG.defaultTime).split(":")[0]);

  if (settings.enabled === false) return { send: false };
  if (!force && Number(local.hour) !== targetHour) return { send: false };
  if (!force && settings.lastSentDate === local.date) return { send: false };

  return {
    send: true,
    localDate: local.date,
    timeZone,
  };
}

function normalizeDigestSettings(settings = {}) {
  const source = settings && typeof settings === "object" ? settings : {};
  return {
    enabled: source.enabled === undefined ? true : Boolean(source.enabled),
    time: CONFIG.defaultTime,
    timeZone: source.timeZone || CONFIG.defaultTimeZone,
    lastSentDate: source.lastSentDate || "",
    lastSentAt: source.lastSentAt || "",
  };
}

function buildDigest(workspace, document, today, timeZone) {
  const weekEnd = addDaysKey(today, 6);
  const tasks = asArray(workspace.tasks).filter((task) => !task.archived && task.status !== "done");
  const tasksToday = tasks.filter((task) => task.dueDate === today).sort(compareTasks);
  const tasksThisWeek = tasks
    .filter((task) => task.dueDate && task.dueDate >= today && task.dueDate <= weekEnd)
    .sort(compareTasks);
  const overdueTasks = tasks.filter((task) => task.dueDate && task.dueDate < today).sort(compareTasks);

  const todaysBusiness = focusBusinessIdeas(workspace, 3);
  const weeklyBusiness = focusBusinessIdeas(workspace, 6);
  const todaysResearch = focusResearchItems(workspace, 3);
  const weeklyResearch = focusResearchItems(workspace, 6);
  const todaysPapers = focusPapers(workspace, today, today, 4);
  const weeklyPapers = focusPapers(workspace, today, weekEnd, 8);
  const displayName = document.email || "your workspace";

  const sections = [
    metricRow("Tasks left today", tasksToday.length),
    metricRow("Tasks due this week", tasksThisWeek.length),
    metricRow("Overdue tasks", overdueTasks.length),
    block("Today - tasks", tasksToday, taskLine),
    block("This week - tasks", tasksThisWeek, taskLine),
    block("Today - business ideas", todaysBusiness, ideaLine),
    block("This week - business ideas", weeklyBusiness, ideaLine),
    block("Today - research ideas", todaysResearch, researchLine),
    block("This week - research ideas", weeklyResearch, researchLine),
    block("Today - submitted papers", todaysPapers, paperLine),
    block("This week - submitted papers", weeklyPapers, paperLine),
  ].join("");

  return {
    subject: `Daily Ops Hub digest - ${formatFriendlyDate(today)}`,
    html: `
      <div style="font-family:Inter,Segoe UI,Arial,sans-serif;color:#0f172a;line-height:1.5;max-width:720px;margin:0 auto;padding:24px;background:#f7fafc">
        <div style="background:#ffffff;border:1px solid #d8e2ee;border-radius:14px;padding:24px">
          <p style="margin:0 0 8px;color:#2563eb;font-weight:700">Daily Ops Hub</p>
          <h1 style="margin:0 0 8px;font-size:28px;line-height:1.15">Your 8 AM operations digest</h1>
          <p style="margin:0 0 20px;color:#52637a">For ${escapeHtml(displayName)} on ${formatFriendlyDate(today)} (${escapeHtml(timeZone)}).</p>
          ${sections}
          <p style="margin:24px 0 0">
            <a href="${escapeHtml(CONFIG.appUrl)}" style="display:inline-block;background:#2563eb;color:#ffffff;text-decoration:none;border-radius:10px;padding:10px 14px;font-weight:700">Open Daily Ops Hub</a>
          </p>
          <p style="margin:18px 0 0;color:#52637a;font-size:12px">Private Vault secrets are excluded from this digest.</p>
        </div>
      </div>
    `,
  };
}

function metricRow(label, value) {
  return `
    <div style="display:inline-block;margin:0 8px 12px 0;padding:10px 12px;border-radius:10px;background:#eef4ff;border:1px solid #cfe0ff">
      <strong style="display:block;font-size:22px">${value}</strong>
      <span style="font-size:13px;color:#52637a">${escapeHtml(label)}</span>
    </div>
  `;
}

function block(title, items, formatter) {
  const body = items.length
    ? `<ul style="margin:8px 0 0;padding-left:20px">${items.map((item) => `<li>${formatter(item)}</li>`).join("")}</ul>`
    : `<p style="margin:8px 0 0;color:#52637a">Nothing scheduled here.</p>`;
  return `
    <section style="margin-top:18px;padding-top:16px;border-top:1px solid #e2e8f0">
      <h2 style="margin:0;font-size:17px">${escapeHtml(title)}</h2>
      ${body}
    </section>
  `;
}

function taskLine(task) {
  const due = task.dueDate ? `due ${formatFriendlyDate(task.dueDate)}` : "no due date";
  return escapeHtml(`${task.title || "Untitled task"} - ${task.priority || "Medium"} priority, ${taskStatus(task.status)}, ${due}`);
}

function ideaLine(item) {
  return escapeHtml(`${item.title || "Untitled idea"} - ${item.status || "Active"}${item.summary ? ` - ${item.summary}` : ""}`);
}

function researchLine(item) {
  const next = item.nextAction || item.question || item.summary || "";
  return escapeHtml(`${item.title || "Untitled research"} - ${item.status || "Active"}${next ? ` - ${next}` : ""}`);
}

function paperLine(paper) {
  const dates = [];
  if (paper.deadline) dates.push(`deadline ${formatFriendlyDate(paper.deadline)}`);
  if (paper.decisionAt) dates.push(`decision ${formatFriendlyDate(paper.decisionAt)}`);
  return escapeHtml(
    `${paper.title || "Untitled paper"} - ${paper.status || "Drafting"}${paper.venue ? ` - ${paper.venue}` : ""}${
      dates.length ? ` - ${dates.join(", ")}` : ""
    }`
  );
}

function focusBusinessIdeas(workspace, limit) {
  return asArray(workspace.ideas)
    .filter((item) => !item.archived && ["Building", "Validating", "Raw"].includes(item.status || "Raw"))
    .sort(compareFocusItems)
    .slice(0, limit);
}

function focusResearchItems(workspace, limit) {
  return asArray(workspace.researchItems)
    .filter((item) => !item.archived && ["Question", "Investigating"].includes(item.status || "Question"))
    .sort(compareFocusItems)
    .slice(0, limit);
}

function focusPapers(workspace, start, end, limit) {
  const activeStatuses = ["Idea", "Drafting", "Internal Review", "Ready to Submit", "Submitted", "Under Review", "Revision"];
  return asArray(workspace.papers)
    .filter((paper) => !paper.archived)
    .filter((paper) => {
      const hasDateInWindow =
        (paper.deadline && paper.deadline >= start && paper.deadline <= end) ||
        (paper.decisionAt && paper.decisionAt >= start && paper.decisionAt <= end);
      return hasDateInWindow || activeStatuses.includes(paper.status || "Drafting");
    })
    .sort(comparePaperDates)
    .slice(0, limit);
}

function compareTasks(a, b) {
  const priority = { High: 0, Medium: 1, Low: 2 };
  const priorityDiff = (priority[a.priority] ?? 1) - (priority[b.priority] ?? 1);
  if (priorityDiff) return priorityDiff;
  return compareDateValues(a.dueDate, b.dueDate) || compareDateValues(b.updatedAt, a.updatedAt);
}

function compareFocusItems(a, b) {
  if (Boolean(b.favorite) !== Boolean(a.favorite)) return b.favorite ? 1 : -1;
  return compareDateValues(b.updatedAt || b.createdAt, a.updatedAt || a.createdAt);
}

function comparePaperDates(a, b) {
  return compareDateValues(a.deadline || a.decisionAt || a.updatedAt, b.deadline || b.decisionAt || b.updatedAt);
}

function compareDateValues(a, b) {
  if (!a && !b) return 0;
  if (!a) return 1;
  if (!b) return -1;
  return new Date(a) - new Date(b);
}

function taskStatus(status) {
  return (
    {
      backlog: "Backlog",
      inProgress: "In Progress",
      done: "Done",
    }[status] || status || "Backlog"
  );
}

function localParts(date, timeZone) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return {
    date: `${values.year}-${values.month}-${values.day}`,
    hour: values.hour,
    minute: values.minute,
  };
}

function safeTimeZone(timeZone) {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone }).format(new Date());
    return timeZone;
  } catch {
    return CONFIG.defaultTimeZone;
  }
}

function addDaysKey(dateKey, days) {
  const [year, month, day] = dateKey.split("-").map(Number);
  const next = new Date(Date.UTC(year, month - 1, day + days));
  return next.toISOString().slice(0, 10);
}

function formatFriendlyDate(dateKey) {
  if (!dateKey) return "";
  const [year, month, day] = String(dateKey).slice(0, 10).split("-").map(Number);
  if (!year || !month || !day) return String(dateKey);
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
