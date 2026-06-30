(() => {
  const STORAGE_KEY = "dailyOpsHub.v1";
  const SESSION_KEY = "dailyOpsHub.session";
  const OTP_TTL_MINUTES = 10;
  const RESET_TTL_MINUTES = 20;
  const VAULT_KDF_ITERATIONS = 250000;
  const VAULT_AUTO_LOCK_MS = 5 * 60 * 1000;
  const LEGACY_DEMO_EMAIL = "demo@dailyops.local";
  const DEMO_EMAIL = "demo@gmail.com";
  const DEMO_PASSWORD = "demo@gmail.com";
  const DEMO_WORKSPACE_SEED_VERSION = "2026-06-28-demo-gmail";
  const DEMO_VAULT_RESET_VERSION = "2026-06-27-demo-vault-reset";
  const APPWRITE_CONFIG = {
    endpoint: "https://nyc.cloud.appwrite.io/v1",
    projectId: "6a41f0a600372166cc8a",
    databaseId: "daily_ops",
    workspaceCollectionId: "workspaces",
    bucketId: "attachments",
    sdkUrl: "https://cdn.jsdelivr.net/npm/appwrite@18.2.0/+esm",
  };
  const CLOUD_SCHEMA_VERSION = "workspace-json-v1";

  const routes = [
    ["dashboard", "Dashboard", "dashboard"],
    ["tasks", "Kanban Tasks", "columns"],
    ["daily", "Daily Planner", "calendar-check"],
    ["ideas", "Business Ideas", "lightbulb"],
    ["research", "Research Ideas", "flask"],
    ["prompts", "Saved Prompts", "message-code"],
    ["papers", "Submitted Papers", "file-text"],
    ["vault", "Private Vault", "shield"],
    ["notes", "Knowledge Notes", "book"],
    ["bookmarks", "Reading Queue", "external-link"],
    ["calendar", "Calendar", "calendar"],
    ["projects", "Projects", "folder"],
    ["timeline", "Activity", "activity"],
    ["analytics", "Analytics", "bar-chart"],
    ["settings", "Settings", "settings"],
  ];

  const iconSvgs = {
    activity: `<path d="M3 12h4l3-7 4 14 3-7h4"></path>`,
    archive: `<rect x="3" y="4" width="18" height="4" rx="1"></rect><path d="M5 8v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8"></path><path d="M10 12h4"></path>`,
    "arrow-left": `<path d="M19 12H5"></path><path d="m12 19-7-7 7-7"></path>`,
    "arrow-right": `<path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path>`,
    "bar-chart": `<path d="M4 19V5"></path><path d="M4 19h16"></path><rect x="7" y="11" width="3" height="5" rx="1"></rect><rect x="12" y="7" width="3" height="9" rx="1"></rect><rect x="17" y="9" width="3" height="7" rx="1"></rect>`,
    book: `<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5z"></path>`,
    calendar: `<rect x="3" y="4" width="18" height="17" rx="2"></rect><path d="M16 2v4"></path><path d="M8 2v4"></path><path d="M3 10h18"></path>`,
    "calendar-check": `<rect x="3" y="4" width="18" height="17" rx="2"></rect><path d="M16 2v4"></path><path d="M8 2v4"></path><path d="M3 10h18"></path><path d="m9 16 2 2 4-5"></path>`,
    check: `<path d="m20 6-11 11-5-5"></path>`,
    "chevron-left": `<path d="m15 18-6-6 6-6"></path>`,
    "chevron-right": `<path d="m9 18 6-6-6-6"></path>`,
    clock: `<circle cx="12" cy="12" r="9"></circle><path d="M12 7v5l3 2"></path>`,
    columns: `<rect x="3" y="4" width="5" height="16" rx="2"></rect><rect x="10" y="4" width="5" height="16" rx="2"></rect><rect x="17" y="4" width="4" height="16" rx="2"></rect>`,
    command: `<path d="M9 6V5a3 3 0 1 0-3 3h1"></path><path d="M15 6V5a3 3 0 1 1 3 3h-1"></path><path d="M9 18v1a3 3 0 1 1-3-3h1"></path><path d="M15 18v1a3 3 0 1 0 3-3h-1"></path><rect x="9" y="8" width="6" height="8" rx="1"></rect>`,
    copy: `<rect x="9" y="9" width="11" height="11" rx="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>`,
    dashboard: `<rect x="3" y="3" width="7" height="8" rx="1.5"></rect><rect x="14" y="3" width="7" height="5" rx="1.5"></rect><rect x="14" y="12" width="7" height="9" rx="1.5"></rect><rect x="3" y="15" width="7" height="6" rx="1.5"></rect>`,
    download: `<path d="M12 3v12"></path><path d="m7 10 5 5 5-5"></path><path d="M5 21h14"></path>`,
    edit: `<path d="M12 20h9"></path><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"></path>`,
    "external-link": `<path d="M15 3h6v6"></path><path d="M10 14 21 3"></path><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>`,
    eye: `<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"></path><circle cx="12" cy="12" r="3"></circle>`,
    "eye-off": `<path d="m3 3 18 18"></path><path d="M10.6 10.6a3 3 0 0 0 3.8 3.8"></path><path d="M9.9 4.4A10.5 10.5 0 0 1 12 4c6.5 0 10 8 10 8a18.6 18.6 0 0 1-3.1 4.3"></path><path d="M6.6 6.6A18.4 18.4 0 0 0 2 12s3.5 8 10 8a10.8 10.8 0 0 0 4.1-.8"></path>`,
    file: `<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"></path><path d="M14 2v6h6"></path>`,
    "file-text": `<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"></path><path d="M14 2v6h6"></path><path d="M8 13h8"></path><path d="M8 17h6"></path>`,
    flask: `<path d="M9 3h6"></path><path d="M10 3v5l-6 10a2 2 0 0 0 1.7 3h12.6a2 2 0 0 0 1.7-3L14 8V3"></path><path d="M7 16h10"></path>`,
    folder: `<path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v8a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3Z"></path>`,
    github: `<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5a5.4 5.4 0 0 0-1-3.5c.3-1.15.3-2.35 0-3.5 0 0-1 0-3 1.5a14.9 14.9 0 0 0-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5a4.8 4.8 0 0 0-1 3.5v4"></path><path d="M9 18c-4.5 2-5-2-7-2"></path>`,
    heart: `<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z"></path>`,
    lightbulb: `<path d="M9 18h6"></path><path d="M10 22h4"></path><path d="M8 14a6 6 0 1 1 8 0c-.8.8-1 1.6-1 3H9c0-1.4-.2-2.2-1-3Z"></path>`,
    linkedin: `<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6Z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle>`,
    lock: `<rect x="4" y="10" width="16" height="11" rx="2"></rect><path d="M8 10V7a4 4 0 0 1 8 0v3"></path>`,
    "log-out": `<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><path d="M16 17l5-5-5-5"></path><path d="M21 12H9"></path>`,
    menu: `<path d="M4 6h16"></path><path d="M4 12h16"></path><path d="M4 18h16"></path>`,
    "message-code": `<path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z"></path><path d="m10 9-2 2 2 2"></path><path d="m14 9 2 2-2 2"></path>`,
    moon: `<path d="M21 12.8A8.5 8.5 0 1 1 11.2 3 6.7 6.7 0 0 0 21 12.8Z"></path>`,
    panel: `<rect x="3" y="4" width="18" height="16" rx="2"></rect><path d="M9 4v16"></path>`,
    plus: `<path d="M12 5v14"></path><path d="M5 12h14"></path>`,
    search: `<circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path>`,
    settings: `<path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"></path><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V22a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1A2 2 0 1 1 7.1 5l.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.6V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1A2 2 0 1 1 19.9 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z"></path>`,
    shield: `<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"></path><path d="m9 12 2 2 4-5"></path>`,
    sun: `<circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.9 4.9 1.4 1.4"></path><path d="m17.7 17.7 1.4 1.4"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.3 17.7-1.4 1.4"></path><path d="m19.1 4.9-1.4 1.4"></path>`,
    trash: `<path d="M3 6h18"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path><path d="M10 11v6"></path><path d="M14 11v6"></path>`,
    upload: `<path d="M12 21V9"></path><path d="m17 14-5-5-5 5"></path><path d="M5 3h14"></path>`,
    x: `<path d="M18 6 6 18"></path><path d="m6 6 12 12"></path>`,
  };

  const collectionByType = {
    task: "tasks",
    idea: "ideas",
    research: "researchItems",
    prompt: "prompts",
    paper: "papers",
    note: "notes",
    bookmark: "bookmarks",
    project: "projects",
  };

  const schemas = {
    idea: {
      title: "Business Idea",
      plural: "Business Ideas",
      route: "ideas",
      statuses: ["Raw", "Validating", "Building", "Paused", "Archived"],
      defaultStatus: "Raw",
      accent: "violet",
      summaryLabel: "Short description",
      bodyLabel: "Detailed plan",
      fields: [
        ["title", "Title", "text", true],
        ["summary", "Short description", "textarea", true],
        ["body", "Detailed plan", "textarea", false],
        ["status", "Status", "select", false],
        ["tagsText", "Tags", "text", false],
        ["projectId", "Project", "project", false],
      ],
    },
    research: {
      title: "Research Idea",
      plural: "Research Ideas",
      route: "research",
      statuses: ["Question", "Investigating", "Validated", "Rejected", "Archived"],
      defaultStatus: "Question",
      accent: "teal",
      summaryLabel: "Research question",
      bodyLabel: "Notes",
      fields: [
        ["title", "Title", "text", true],
        ["question", "Question", "textarea", true],
        ["hypothesis", "Hypothesis", "textarea", false],
        ["summary", "Short summary", "textarea", false],
        ["body", "Detailed notes", "textarea", false],
        ["sources", "Sources and links", "textarea", false],
        ["confidence", "Confidence", "select:Low|Medium|High", false],
        ["nextAction", "Next action", "text", false],
        ["status", "Status", "select", false],
        ["tagsText", "Tags", "text", false],
        ["projectId", "Project", "project", false],
      ],
    },
    prompt: {
      title: "Saved Prompt",
      plural: "Saved Prompts",
      route: "prompts",
      statuses: ["Draft", "Tested", "Favorite", "Deprecated", "Archived"],
      defaultStatus: "Draft",
      accent: "blue",
      summaryLabel: "Description",
      bodyLabel: "Prompt",
      fields: [
        ["title", "Title", "text", true],
        ["summary", "Description", "textarea", false],
        ["body", "Prompt text", "textarea", true],
        ["variables", "Variables/placeholders", "text", false],
        ["category", "Category", "text", false],
        ["model", "Model or use case", "text", false],
        ["versionNotes", "Version notes", "textarea", false],
        ["status", "Status", "select", false],
        ["tagsText", "Tags", "text", false],
        ["projectId", "Project", "project", false],
      ],
    },
    paper: {
      title: "Submitted Paper",
      plural: "Submitted Papers",
      route: "papers",
      statuses: [
        "Idea",
        "Drafting",
        "Internal Review",
        "Ready to Submit",
        "Submitted",
        "Under Review",
        "Revision",
        "Accepted",
        "Rejected",
        "Withdrawn",
        "Published",
        "Archived",
      ],
      defaultStatus: "Drafting",
      accent: "violet",
      summaryLabel: "Abstract",
      bodyLabel: "Notes",
      fields: [
        ["title", "Title", "text", true],
        ["abstract", "Abstract", "textarea", true],
        ["venue", "Target or submitted venue", "text", false],
        ["paperType", "Paper type", "select:Conference|Journal|Workshop|Preprint|Demo|Poster|Other", false],
        ["status", "Status", "select", false],
        ["deadline", "Submission deadline", "date", false],
        ["submittedAt", "Submitted date", "date", false],
        ["decisionAt", "Decision or notification date", "date", false],
        ["overleafLink", "Overleaf link", "url", false],
        ["submissionUrl", "Submission portal or record link", "url", false],
        ["artifactLink", "Artifact, code, or appendix link", "url", false],
        ["doi", "DOI", "text", false],
        ["arxivLink", "arXiv or preprint link", "url", false],
        ["collaboratorsText", "Collaborators", "text", false],
        ["correspondingAuthor", "Corresponding author", "text", false],
        ["blindReview", "Blind review notes", "text", false],
        ["conflictsText", "Conflicts of interest", "text", false],
        ["revisionNotes", "Reviewer or revision notes", "textarea", false],
        ["body", "Private notes and next steps", "textarea", false],
        ["keywordsText", "Keywords", "text", false],
        ["tagsText", "Tags", "text", false],
        ["projectId", "Project", "project", false],
      ],
    },
    note: {
      title: "Knowledge Note",
      plural: "Knowledge Notes",
      route: "notes",
      statuses: ["Active", "Reference", "Needs Review", "Archived"],
      defaultStatus: "Active",
      accent: "teal",
      summaryLabel: "Summary",
      bodyLabel: "Content",
      fields: [
        ["title", "Title", "text", true],
        ["summary", "Summary", "textarea", false],
        ["body", "Markdown, snippet, or note", "textarea", true],
        ["language", "Code language", "text", false],
        ["status", "Status", "select", false],
        ["tagsText", "Tags", "text", false],
        ["projectId", "Project", "project", false],
      ],
    },
    bookmark: {
      title: "Bookmark",
      plural: "Reading Queue",
      route: "bookmarks",
      statuses: ["Unread", "Reading", "Saved", "Done", "Archived"],
      defaultStatus: "Unread",
      accent: "blue",
      summaryLabel: "Why it matters",
      bodyLabel: "Notes",
      fields: [
        ["title", "Title", "text", true],
        ["url", "URL", "url", true],
        ["summary", "Why it matters", "textarea", false],
        ["body", "Notes", "textarea", false],
        ["status", "Status", "select", false],
        ["tagsText", "Tags", "text", false],
        ["projectId", "Project", "project", false],
      ],
    },
    project: {
      title: "Project",
      plural: "Projects",
      route: "projects",
      statuses: ["Active", "Planning", "Paused", "Archived"],
      defaultStatus: "Active",
      accent: "violet",
      summaryLabel: "Summary",
      bodyLabel: "Notes",
      fields: [
        ["title", "Project name", "text", true],
        ["summary", "Summary", "textarea", false],
        ["body", "Notes", "textarea", false],
        ["status", "Status", "select", false],
        ["tagsText", "Tags", "text", false],
      ],
    },
  };

  const taskStatuses = [
    ["backlog", "Backlog"],
    ["inProgress", "In Progress"],
    ["done", "Done"],
  ];
  const taskPriorityRank = {
    High: 0,
    Medium: 1,
    Low: 2,
  };

  const app = document.getElementById("app");
  let db = loadDb();
  let session = loadSession();
  let ui = {
    authScreen: "login",
    route: "dashboard",
    query: "",
    filter: "all",
    sidebarOpen: false,
    sidebarCollapsed: localStorage.getItem("dailyOpsHub.sidebarCollapsed") === "true",
    commandOpen: false,
    editor: null,
    vaultEditor: null,
    message: null,
    calendarMonth: monthKey(new Date()),
    plannerDate: dateKey(new Date()),
    verifyEmail: "",
    resetEmail: "",
    resetUserId: "",
    resetSecret: "",
  };
  let messageTimer = null;
  let appwritePromise = null;
  let cloudSaveTimer = null;
  let cloudSaveInFlight = false;
  let cloudSaveQueued = false;
  let cloudSyncMuted = false;
  let vaultState = {
    workspaceId: null,
    unlocked: false,
    key: null,
    items: [],
  };
  let vaultLockTimer = null;

  initTheme();
  applyCloudUrlState();
  bindEvents();
  render();
  completeCloudUrlAction();
  hydrateCloudSession();

  function bindEvents() {
    document.addEventListener("submit", onSubmit);
    document.addEventListener("click", onClick);
    document.addEventListener("input", onInput);
    document.addEventListener("change", onChange);
    document.addEventListener("keydown", onKeydown);
    document.addEventListener("dragstart", onDragStart);
    document.addEventListener("dragover", onDragOver);
    document.addEventListener("dragleave", onDragLeave);
    document.addEventListener("drop", onDrop);
    document.addEventListener("click", scheduleVaultAutoLock);
    document.addEventListener("input", scheduleVaultAutoLock);
    document.addEventListener("keydown", scheduleVaultAutoLock);
    window.addEventListener("storage", () => {
      lockVault(false);
      db = loadDb();
      session = loadSession();
      render();
    });
  }

  function loadDb() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (parsed && parsed.users && parsed.workspaces) return parsed;
    } catch (error) {
      console.warn(error);
    }
    return {
      users: [],
      pendingVerifications: [],
      passwordResets: [],
      workspaces: {},
    };
  }

  function saveDb(options = {}) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    if (!options.skipCloud && !cloudSyncMuted) scheduleCloudSave();
  }

  function loadSession() {
    try {
      return JSON.parse(localStorage.getItem(SESSION_KEY));
    } catch (error) {
      return null;
    }
  }

  function saveSession(nextSession) {
    session = nextSession;
    if (nextSession) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(nextSession));
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  }

  async function getAppwrite() {
    if (!appwritePromise) {
      appwritePromise = import(APPWRITE_CONFIG.sdkUrl).then((sdk) => {
        const client = new sdk.Client().setEndpoint(APPWRITE_CONFIG.endpoint).setProject(APPWRITE_CONFIG.projectId);
        return {
          sdk,
          client,
          account: new sdk.Account(client),
          databases: new sdk.Databases(client),
          storage: new sdk.Storage(client),
          ID: sdk.ID,
          Permission: sdk.Permission,
          Role: sdk.Role,
        };
      });
    }
    return appwritePromise;
  }

  function shouldUseCloudAuth(email) {
    return normalizeEmail(email) !== DEMO_EMAIL;
  }

  function isCloudUser(user = currentUser()) {
    return user?.source === "appwrite";
  }

  function cloudCallbackUrl(action) {
    const url = new URL(window.location.href);
    url.search = "";
    url.hash = "";
    url.searchParams.set("dailyOpsAction", action);
    return url.toString();
  }

  function applyCloudUrlState() {
    const params = new URLSearchParams(window.location.search);
    if (params.get("dailyOpsAction") !== "recovery") return;
    const userId = params.get("userId") || "";
    const secret = params.get("secret") || "";
    if (!userId || !secret) return;
    ui.authScreen = "reset";
    ui.resetUserId = userId;
    ui.resetSecret = secret;
  }

  async function completeCloudUrlAction() {
    const params = new URLSearchParams(window.location.search);
    const action = params.get("dailyOpsAction");
    const userId = params.get("userId") || "";
    const secret = params.get("secret") || "";
    if (!action || !userId || !secret) return;

    if (action === "verify") {
      try {
        const { account } = await getAppwrite();
        await account.updateVerification(userId, secret);
        ui.authScreen = "login";
        flash("Email verified. You can log in now.", "good");
      } catch (error) {
        console.warn(error);
        flash(appwriteMessage(error, "Verification link is invalid or expired."), "error");
      } finally {
        cleanCloudActionUrl();
      }
      return;
    }

    if (action === "recovery") {
      ui.authScreen = "reset";
      ui.resetUserId = userId;
      ui.resetSecret = secret;
      cleanCloudActionUrl();
      render();
    }
  }

  function cleanCloudActionUrl() {
    const url = new URL(window.location.href);
    ["dailyOpsAction", "userId", "secret", "expire"].forEach((key) => url.searchParams.delete(key));
    window.history.replaceState({}, document.title, `${url.pathname}${url.search}${url.hash}`);
  }

  async function hydrateCloudSession() {
    const activeUser = currentUser();
    if (activeUser && !isCloudUser(activeUser)) return;

    try {
      const { account } = await getAppwrite();
      const profile = await account.get();
      if (!profile?.$id || !profile.emailVerification) return;
      const user = await upsertCloudUser(profile);
      await loadCloudWorkspace(user, { createIfMissing: true });
      saveSession({ userId: user.id, source: "appwrite", createdAt: new Date().toISOString() });
      render();
    } catch (error) {
      if (!isExpectedGuestError(error)) console.warn(error);
    }
  }

  async function upsertCloudUser(profile, password = "") {
    let user = db.users.find((item) => item.id === profile.$id);
    const existingByEmail = db.users.find((item) => item.email === normalizeEmail(profile.email));
    if (!user && existingByEmail && !existingByEmail.source) {
      existingByEmail.id = profile.$id;
      user = existingByEmail;
    }
    if (!user) {
      user = {
        id: profile.$id,
        name: profile.name || profile.email,
        email: normalizeEmail(profile.email),
        passwordHash: "",
        verified: Boolean(profile.emailVerification),
        source: "appwrite",
        createdAt: profile.$createdAt || new Date().toISOString(),
      };
      db.users.push(user);
    }
    user.name = profile.name || user.name || profile.email;
    user.email = normalizeEmail(profile.email);
    user.verified = Boolean(profile.emailVerification);
    user.source = "appwrite";
    user.updatedAt = new Date().toISOString();
    if (password) user.passwordHash = await hash(password);
    saveDb({ skipCloud: true });
    return user;
  }

  async function loadCloudWorkspace(user, options = {}) {
    try {
      const { databases } = await getAppwrite();
      const document = await databases.getDocument(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.workspaceCollectionId,
        user.id
      );
      const workspace = JSON.parse(document.payload || "{}");
      ensureWorkspaceShape(workspace);
      workspace.settings = { dataSource: "appwrite", autosave: true, ...(workspace.settings || {}) };
      cloudSyncMuted = true;
      db.workspaces[user.id] = workspace;
      saveDb({ skipCloud: true });
      cloudSyncMuted = false;
      return workspace;
    } catch (error) {
      cloudSyncMuted = false;
      if (!isAppwriteNotFound(error) || !options.createIfMissing) throw error;
      const workspace = makeWorkspace(false);
      workspace.settings = { dataSource: "appwrite", autosave: true, ...(workspace.settings || {}) };
      db.workspaces[user.id] = workspace;
      saveDb({ skipCloud: true });
      await saveCloudWorkspace(user, workspace);
      return workspace;
    }
  }

  function scheduleCloudSave() {
    const user = currentUser();
    if (!isCloudUser(user)) return;
    if (!db.workspaces[user.id]) return;
    if (cloudSaveTimer) clearTimeout(cloudSaveTimer);
    cloudSaveTimer = setTimeout(() => flushCloudSave(), 900);
  }

  async function flushCloudSave() {
    const user = currentUser();
    if (!isCloudUser(user)) return;
    if (cloudSaveInFlight) {
      cloudSaveQueued = true;
      return;
    }

    cloudSaveInFlight = true;
    try {
      await saveCloudWorkspace(user, db.workspaces[user.id]);
    } catch (error) {
      console.warn(error);
      showToast(appwriteMessage(error, "Cloud save failed. Your browser copy is still safe."), "error");
    } finally {
      cloudSaveInFlight = false;
      if (cloudSaveQueued) {
        cloudSaveQueued = false;
        scheduleCloudSave();
      }
    }
  }

  async function saveCloudWorkspace(user, workspace) {
    if (!user || !workspace) return;
    const { databases, Permission, Role } = await getAppwrite();
    const now = new Date().toISOString();
    const data = {
      userId: user.id,
      email: user.email,
      schemaVersion: CLOUD_SCHEMA_VERSION,
      payload: JSON.stringify(workspace),
      createdAt: workspace.createdAt || now,
      updatedAt: now,
    };
    const permissions = [
      Permission.read(Role.user(user.id)),
      Permission.update(Role.user(user.id)),
      Permission.delete(Role.user(user.id)),
    ];

    try {
      await databases.updateDocument(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.workspaceCollectionId,
        user.id,
        data,
        permissions
      );
    } catch (error) {
      if (!isAppwriteNotFound(error)) throw error;
      await databases.createDocument(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.workspaceCollectionId,
        user.id,
        data,
        permissions
      );
    }
  }

  async function cloudLogout() {
    try {
      const { account } = await getAppwrite();
      await account.deleteSession("current");
    } catch (error) {
      if (!isExpectedGuestError(error)) console.warn(error);
    }
  }

  function isAppwriteNotFound(error) {
    return error?.code === 404 || error?.type === "document_not_found" || /not found/i.test(error?.message || "");
  }

  function isExpectedGuestError(error) {
    return error?.code === 401 || /missing scope|guest|unauthorized/i.test(error?.message || "");
  }

  function appwriteMessage(error, fallback) {
    const message = error?.message || "";
    if (!message) return fallback;
    return message.replace(/^AppwriteException:\s*/i, "");
  }

  function initTheme() {
    const stored = localStorage.getItem("dailyOpsHub.theme") || "light";
    document.documentElement.dataset.theme = stored;
  }

  function setTheme(theme) {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("dailyOpsHub.theme", theme);
  }

  function currentUser() {
    if (!session) return null;
    return db.users.find((user) => user.id === session.userId) || null;
  }

  function getWorkspace(userId = session?.userId) {
    if (!userId) return null;
    if (!db.workspaces[userId]) {
      db.workspaces[userId] = makeWorkspace();
      saveDb();
    }
    if (ensureWorkspaceShape(db.workspaces[userId])) {
      saveDb();
    }
    return db.workspaces[userId];
  }

  function ensureWorkspaceShape(workspace) {
    const base = makeWorkspace(false);
    let changed = false;
    Object.entries(base).forEach(([key, fallback]) => {
      if (Array.isArray(fallback) && !Array.isArray(workspace[key])) {
        workspace[key] = [];
        changed = true;
      }
    });
    if (!workspace.settings || typeof workspace.settings !== "object") {
      workspace.settings = { ...base.settings };
      changed = true;
    } else {
      Object.entries(base.settings).forEach(([key, value]) => {
        if (workspace.settings[key] === undefined) {
          workspace.settings[key] = value;
          changed = true;
        }
      });
    }
    if (!workspace.privateVault || typeof workspace.privateVault !== "object") {
      workspace.privateVault = { ...base.privateVault, items: [] };
      changed = true;
    } else {
      if (!Array.isArray(workspace.privateVault.items)) {
        workspace.privateVault.items = [];
        changed = true;
      }
      ["salt", "createdAt", "updatedAt"].forEach((key) => {
        if (workspace.privateVault[key] === undefined) {
          workspace.privateVault[key] = "";
          changed = true;
        }
      });
      if (workspace.privateVault.verifier === undefined) {
        workspace.privateVault.verifier = null;
        changed = true;
      }
    }
    return changed;
  }

  function freshPrivateVault() {
    return {
      salt: "",
      verifier: null,
      items: [],
      createdAt: "",
      updatedAt: "",
    };
  }

  function makeWorkspace(seed = false) {
    const now = new Date().toISOString();
    const workspace = {
      tasks: [],
      dailyPlans: [],
      ideas: [],
      researchItems: [],
      prompts: [],
      papers: [],
      notes: [],
      bookmarks: [],
      privateVault: freshPrivateVault(),
      projects: [],
      tags: [],
      attachments: [],
      activityLogs: [],
      analyticsEvents: [],
      recurringRules: [],
      settings: {
        dataSource: "local",
        autosave: true,
      },
    };

    if (!seed) return workspace;

    const projectId = id("project");
    workspace.projects.push({
      id: projectId,
      title: "Daily Ops Hub Launch",
      summary: "Personal workflow system setup.",
      body: "Use this project to group launch tasks, early research, saved prompts, and notes.",
      status: "Active",
      tags: ["productivity", "app"],
      favorite: true,
      archived: false,
      createdAt: now,
      updatedAt: now,
    });

    workspace.tasks.push(
      makeTask({
        title: "Set up free Appwrite project",
        description: "Create Auth, Database, Storage, and Sites resources.",
        status: "backlog",
        priority: "High",
        dueDate: addDays(2),
        projectId,
        tags: ["backend", "deployment"],
      }),
      makeTask({
        title: "Define first week workflow",
        description: "Choose tags, review cadence, and dashboard habits.",
        status: "inProgress",
        priority: "Medium",
        dueDate: addDays(1),
        projectId,
        tags: ["planning"],
      }),
      makeTask({
        title: "Create app MVP plan",
        description: "Core feature map and edge cases are captured.",
        status: "done",
        priority: "Low",
        dueDate: dateKey(new Date()),
        projectId,
        tags: ["done"],
      })
    );

    workspace.ideas.push({
      id: id("idea"),
      title: "Micro-SaaS Ops Board",
      summary: "A personal Jira-style workspace for builders and AI-heavy workflows.",
      body: "Start with solo users, then add lightweight collaboration and GitHub-aware routines.",
      status: "Validating",
      tags: ["saas", "product"],
      projectId,
      favorite: true,
      archived: false,
      createdAt: now,
      updatedAt: now,
    });

    workspace.researchItems.push({
      id: id("research"),
      title: "Free backend sustainability",
      question: "Which free BaaS plan is most realistic for a daily-use operations app?",
      hypothesis: "Appwrite has the most cohesive no-cost path because it covers auth, data, storage, sites, and functions.",
      summary: "Validate quotas and inactivity behavior before public launch.",
      body: "Track reads, writes, storage, and email behavior under realistic personal usage.",
      sources: "https://appwrite.io/pricing",
      confidence: "Medium",
      nextAction: "Create a quota dashboard after Appwrite integration.",
      status: "Investigating",
      tags: ["architecture", "free-tier"],
      projectId,
      favorite: false,
      archived: false,
      createdAt: now,
      updatedAt: now,
    });

    workspace.prompts.push({
      id: id("prompt"),
      title: "Daily Engineering Review",
      summary: "Summarize yesterday, choose today, surface blockers.",
      body: "Act as my engineering ops partner. Review these notes: {{notes}}. Return priorities, blockers, and one concrete next step.",
      variables: "notes",
      category: "planning",
      model: "general reasoning",
      versionNotes: "Initial version.",
      status: "Tested",
      tags: ["daily", "engineering"],
      projectId,
      favorite: true,
      archived: false,
      createdAt: now,
      updatedAt: now,
    });

    workspace.papers.push({
      id: id("paper"),
      title: "Daily Ops Systems for AI-Augmented Builders",
      abstract:
        "We describe a lightweight operations workspace that unifies personal task management, research capture, prompt reuse, and project memory for individual technical workers.",
      venue: "CHI Workshop on Personal Productivity Tools",
      paperType: "Workshop",
      status: "Drafting",
      deadline: addDays(30),
      submittedAt: "",
      decisionAt: addDays(75),
      overleafLink: "https://www.overleaf.com/project/example",
      submissionUrl: "",
      artifactLink: "",
      doi: "",
      arxivLink: "",
      collaborators: ["Demo Builder", "Research Partner"],
      correspondingAuthor: "Demo Builder",
      blindReview: "Check author names and acknowledgements before anonymous submission.",
      conflicts: ["Example Lab"],
      revisionNotes: "Add evaluation plan and related-work notes before internal review.",
      body: "Next edge cases: deadline changes, venue switch, collaborator order, and rejected-to-resubmit flow.",
      keywords: ["productivity", "ai-tools", "personal-knowledge-management"],
      tags: ["paper", "research"],
      projectId,
      favorite: false,
      archived: false,
      createdAt: now,
      updatedAt: now,
    });

    workspace.notes.push({
      id: id("note"),
      title: "Appwrite migration notes",
      summary: "Collections mirror local data shapes.",
      body: "Keep client code behind a repository adapter so localStorage and Appwrite share the same app layer.",
      language: "markdown",
      status: "Reference",
      tags: ["appwrite", "architecture"],
      projectId,
      favorite: false,
      archived: false,
      createdAt: now,
      updatedAt: now,
    });

    workspace.bookmarks.push({
      id: id("bookmark"),
      title: "Appwrite pricing",
      url: "https://appwrite.io/pricing",
      summary: "Free-tier quotas for deployment planning.",
      body: "Watch inactive project pause behavior.",
      status: "Saved",
      tags: ["deployment"],
      projectId,
      favorite: false,
      archived: false,
      createdAt: now,
      updatedAt: now,
    });

    workspace.dailyPlans.push({
      id: id("daily"),
      date: dateKey(new Date()),
      focus: "Ship the first app slice.",
      notes: "Use the dashboard, task board, and idea vault as the first daily loop.",
      review: "",
      createdAt: now,
      updatedAt: now,
    });

    const researchProjectId = id("project");
    const automationProjectId = id("project");
    workspace.projects.push(
      {
        id: researchProjectId,
        title: "AI Research Pipeline",
        summary: "Paper tracking, literature review, and experiment planning.",
        body: "Keep submitted papers, research ideas, prompts, notes, and sources tied to one research track.",
        status: "Active",
        tags: ["research", "ai"],
        favorite: true,
        archived: false,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: automationProjectId,
        title: "Client Automation Studio",
        summary: "Reusable automations, prompts, credentials, and delivery checklists.",
        body: "A practical project space for building client-facing internal tools and repeatable workflows.",
        status: "Planning",
        tags: ["automation", "client"],
        favorite: false,
        archived: false,
        createdAt: now,
        updatedAt: now,
      }
    );

    workspace.tasks.push(
      makeTask({
        title: "Polish login experience before deploy",
        description: "Review auth screen, demo data, mobile layout, and browser tab branding.",
        status: "inProgress",
        priority: "High",
        dueDate: dateKey(new Date()),
        projectId,
        tags: ["ui", "release"],
        subtasks: ["Homepage animation", "Demo account refresh", "README deployment note"],
        favorite: true,
      }),
      makeTask({
        title: "Create Appwrite schema migration checklist",
        description: "Map local collections to Appwrite databases and permissions.",
        status: "backlog",
        priority: "High",
        dueDate: addDays(4),
        projectId,
        tags: ["appwrite", "migration"],
      }),
      makeTask({
        title: "Read three papers on personal knowledge workflows",
        description: "Capture findings as research notes and prompts.",
        status: "backlog",
        priority: "Medium",
        dueDate: addDays(5),
        projectId: researchProjectId,
        tags: ["reading", "paper"],
      }),
      makeTask({
        title: "Draft weekly client automation template",
        description: "Standardize discovery questions, system map, risks, and final handoff.",
        status: "inProgress",
        priority: "Medium",
        dueDate: addDays(3),
        projectId: automationProjectId,
        tags: ["client", "template"],
        recurring: "Every Friday",
      }),
      makeTask({
        title: "Archive completed prompt experiments",
        description: "Move proven prompt versions into Saved Prompts and bookmark the best references.",
        status: "done",
        priority: "Low",
        dueDate: addDays(-1),
        projectId: researchProjectId,
        tags: ["prompts"],
      })
    );

    workspace.ideas.push(
      {
        id: id("idea"),
        title: "Research Submission Concierge",
        summary: "A private workflow that tracks calls for papers, drafts, submission portals, and author tasks.",
        body: "Start with solo researchers and PhD students. Build a paper pipeline, deadline reminders, Overleaf links, collaborator checklist, and venue comparison. Later add optional calendar sync and template packs.",
        status: "Validating",
        tags: ["research", "workflow"],
        projectId: researchProjectId,
        favorite: true,
        archived: false,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: id("idea"),
        title: "Micro Automation Client Kit",
        summary: "A small agency dashboard for collecting client operations and producing automation plans.",
        body: "Capture client pain points, systems, credentials, prompts, deployment notes, and recurring maintenance tasks. Revenue path: fixed-price setup plus monthly support.",
        status: "Raw",
        tags: ["agency", "automation"],
        projectId: automationProjectId,
        favorite: false,
        archived: false,
        createdAt: now,
        updatedAt: now,
      }
    );

    workspace.researchItems.push(
      {
        id: id("research"),
        title: "Encrypted browser vault usability",
        question: "Can a local-first encrypted vault stay understandable for non-security experts?",
        hypothesis: "Category-specific forms and reveal/copy controls reduce risky behavior compared with one large notes field.",
        summary: "Test login, bank, card, API key, and identity examples with first-time users.",
        body: "Measure time to create an item, ability to unlock with login password, and understanding of reset tradeoffs.",
        sources: "NIST password guidance; OWASP client-side storage notes",
        confidence: "Medium",
        nextAction: "Add onboarding copy to documentation, not the working app surface.",
        status: "Investigating",
        tags: ["security", "ux"],
        projectId,
        favorite: true,
        archived: false,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: id("research"),
        title: "Drag-and-drop alternatives on mobile",
        question: "What fallback controls make Kanban movement reliable on touch devices?",
        hypothesis: "Explicit move buttons are faster and less frustrating than long-press drag on small screens.",
        summary: "Compare native drag, dropdown moves, and one-tap move controls.",
        body: "Track completion rate and accidental movement for Backlog to In Progress to Done.",
        sources: "Mobile interaction notes, Jira mobile behavior, Trello touch controls",
        confidence: "High",
        nextAction: "Keep icon buttons and verify tap targets.",
        status: "Validated",
        tags: ["mobile", "kanban"],
        projectId,
        favorite: false,
        archived: false,
        createdAt: now,
        updatedAt: now,
      }
    );

    workspace.prompts.push(
      {
        id: id("prompt"),
        title: "Paper Abstract Tightener",
        summary: "Turn a rough abstract into a sharper research submission version.",
        body: "Rewrite this abstract for a {{venue_type}} submission. Preserve claims, improve clarity, flag unsupported claims, and return: refined abstract, reviewer concerns, and 3 keyword suggestions.\n\nAbstract:\n{{abstract}}",
        variables: "venue_type, abstract",
        category: "research",
        model: "general reasoning",
        versionNotes: "Works best after the paper contribution is already clear.",
        status: "Tested",
        tags: ["paper", "writing"],
        projectId: researchProjectId,
        favorite: true,
        archived: false,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: id("prompt"),
        title: "Client Workflow Mapper",
        summary: "Convert discovery notes into systems, bottlenecks, and automation candidates.",
        body: "Analyze these client discovery notes: {{notes}}. Return current workflow, repeated manual work, risk points, quick wins, and the smallest useful automation plan.",
        variables: "notes",
        category: "automation",
        model: "general reasoning",
        versionNotes: "Use during early scoping calls.",
        status: "Draft",
        tags: ["client", "automation"],
        projectId: automationProjectId,
        favorite: false,
        archived: false,
        createdAt: now,
        updatedAt: now,
      }
    );

    workspace.papers.push(
      {
        id: id("paper"),
        title: "Prompt Libraries as Operational Memory",
        abstract:
          "This study examines how reusable prompt collections can function as lightweight operational memory for individual software builders and small technical teams.",
        venue: "CSCW Companion",
        paperType: "Conference",
        status: "Submitted",
        deadline: addDays(-12),
        submittedAt: addDays(-10),
        decisionAt: addDays(52),
        overleafLink: "https://www.overleaf.com/project/demo-prompt-library",
        submissionUrl: "https://precisionconference.com/~demo",
        artifactLink: "https://github.com/demo/prompt-memory-artifact",
        doi: "",
        arxivLink: "",
        collaborators: ["Demo Builder", "A. Researcher", "M. Engineer"],
        correspondingAuthor: "Demo Builder",
        blindReview: "Anonymous version uploaded. Remove GitHub owner names before camera-ready.",
        conflicts: ["Example University", "Sample AI Lab"],
        revisionNotes: "Waiting for reviewer response. Prepare ablation appendix if reviews ask for evaluation detail.",
        body: "Track reviewer comments, decision date, and artifact release checklist here.",
        keywords: ["prompts", "operations", "knowledge-work"],
        tags: ["submitted", "prompt"],
        projectId: researchProjectId,
        favorite: true,
        archived: false,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: id("paper"),
        title: "Local-First Dashboards for Solo Technical Work",
        abstract:
          "We present design considerations for local-first daily operations dashboards that combine tasks, notes, research, bookmarks, and encrypted private records.",
        venue: "arXiv / Preprint",
        paperType: "Preprint",
        status: "Revision",
        deadline: addDays(14),
        submittedAt: "",
        decisionAt: "",
        overleafLink: "https://www.overleaf.com/project/demo-local-first",
        submissionUrl: "",
        artifactLink: "https://dailyopshub.example/demo",
        doi: "",
        arxivLink: "https://arxiv.org/abs/0000.00000",
        collaborators: ["Demo Builder"],
        correspondingAuthor: "Demo Builder",
        blindReview: "Not blind. Add limitations and security discussion before public posting.",
        conflicts: [],
        revisionNotes: "Clarify what GitHub Pages can and cannot persist without a backend.",
        body: "Use this record for the deploy-readiness paper narrative.",
        keywords: ["local-first", "dashboard", "security"],
        tags: ["preprint", "revision"],
        projectId,
        favorite: false,
        archived: false,
        createdAt: now,
        updatedAt: now,
      }
    );

    workspace.notes.push(
      {
        id: id("note"),
        title: "Deployment talking points",
        summary: "GitHub Pages can host the app; Appwrite is the free backend path for real email and cloud data.",
        body: "Local-only deployment is instant and free. Production-grade cross-device storage, verification email, password reset email, and permissions should be migrated to Appwrite Cloud Free.",
        language: "markdown",
        status: "Reference",
        tags: ["deploy", "github", "appwrite"],
        projectId,
        favorite: true,
        archived: false,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: id("note"),
        title: "Weekly review checklist",
        summary: "A compact routine for keeping the workspace clean.",
        body: "- Move stale In Progress tasks\n- Archive weak prompts\n- Review paper deadlines\n- Export JSON backup\n- Check vault lock state",
        language: "markdown",
        status: "Active",
        tags: ["routine", "review"],
        projectId,
        favorite: false,
        archived: false,
        createdAt: now,
        updatedAt: now,
      }
    );

    workspace.bookmarks.push(
      {
        id: id("bookmark"),
        title: "GitHub Pages documentation",
        url: "https://docs.github.com/pages",
        summary: "Static hosting for the browser-only version.",
        body: "Use for the free frontend deployment. Pair with Appwrite for backend persistence.",
        status: "Saved",
        tags: ["github", "hosting"],
        projectId,
        favorite: true,
        archived: false,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: id("bookmark"),
        title: "OWASP Cheat Sheet Series",
        url: "https://cheatsheetseries.owasp.org/",
        summary: "Security reference for auth, storage, and application hardening.",
        body: "Use when planning the Appwrite integration and future private vault improvements.",
        status: "Reading",
        tags: ["security", "reference"],
        projectId,
        favorite: false,
        archived: false,
        createdAt: now,
        updatedAt: now,
      }
    );

    workspace.dailyPlans.push(
      {
        id: id("daily"),
        date: addDays(1),
        focus: "Review demo workspace as a new user.",
        notes: "Walk through auth, dashboard, papers, vault, settings, export, and mobile widths.",
        review: "",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: id("daily"),
        date: addDays(-1),
        focus: "Close design polish issues.",
        notes: "Fixed icon-only controls, logo background, recent activity scrolling, and button clipping.",
        review: "Ready for final deployment pass.",
        createdAt: now,
        updatedAt: now,
      }
    );

    workspace.recurringRules.push(
      {
        id: id("rule"),
        title: "Weekly JSON backup",
        cadence: "Every Friday",
        nextRun: addDays(5),
        projectId,
        tags: ["backup"],
        createdAt: now,
        updatedAt: now,
      },
      {
        id: id("rule"),
        title: "Paper deadline review",
        cadence: "Every Monday",
        nextRun: addDays(1),
        projectId: researchProjectId,
        tags: ["paper", "review"],
        createdAt: now,
        updatedAt: now,
      }
    );

    workspace.analyticsEvents.push(
      { id: id("event"), type: "task_moved", label: "Backlog to In Progress", createdAt: new Date(Date.now() - 2 * 86400000).toISOString() },
      { id: id("event"), type: "prompt_copied", label: "Daily Engineering Review", createdAt: new Date(Date.now() - 86400000).toISOString() },
      { id: id("event"), type: "paper_updated", label: "Prompt Libraries as Operational Memory", createdAt: now },
      { id: id("event"), type: "vault_unlocked", label: "Private Vault", createdAt: now }
    );

    workspace.activityLogs.push({
      id: id("activity"),
      action: "Seeded demo workspace",
      entityType: "workspace",
      entityTitle: "Daily Ops Hub",
      createdAt: now,
    });
    [
      ["Created release polish task", "task", "Polish login experience before deploy"],
      ["Saved paper submission", "paper", "Prompt Libraries as Operational Memory"],
      ["Copied tested prompt", "prompt", "Paper Abstract Tightener"],
      ["Added deployment note", "note", "Deployment talking points"],
      ["Bookmarked security reference", "bookmark", "OWASP Cheat Sheet Series"],
      ["Created demo vault examples", "vault", "Encrypted sample records"],
    ].forEach(([action, entityType, entityTitle], index) => {
      workspace.activityLogs.push({
        id: id("activity"),
        action,
        entityType,
        entityTitle,
        createdAt: new Date(Date.now() - index * 18 * 60 * 1000).toISOString(),
      });
    });

    return workspace;
  }

  async function ensureDemoWorkspace(user) {
    if (!user || user.email !== DEMO_EMAIL) return;

    const demoHash = await hash(DEMO_PASSWORD);
    let userChanged = false;
    if (user.passwordHash !== demoHash) {
      user.passwordHash = demoHash;
      userChanged = true;
    }
    if (!user.verified) {
      user.verified = true;
      userChanged = true;
    }
    if (!user.name) {
      user.name = "Demo Builder";
      userChanged = true;
    }

    const currentWorkspace = db.workspaces[user.id];
    if (currentWorkspace?.settings?.demoWorkspaceSeedVersion === DEMO_WORKSPACE_SEED_VERSION) {
      if (userChanged) saveDb();
      return;
    }

    const nextWorkspace = makeWorkspace(true);
    nextWorkspace.settings.demoWorkspaceSeedVersion = DEMO_WORKSPACE_SEED_VERSION;
    nextWorkspace.settings.demoVaultResetVersion = DEMO_VAULT_RESET_VERSION;
    await seedDemoVault(nextWorkspace);
    db.workspaces[user.id] = nextWorkspace;
    lockVault(false);
    saveDb();
  }

  async function seedDemoVault(workspace) {
    if (!cryptoAvailable()) {
      workspace.privateVault = freshPrivateVault();
      workspace.settings.demoVaultUnavailable = true;
      return;
    }

    const now = new Date().toISOString();
    const salt = randomBase64(16);
    const key = await deriveVaultKey(DEMO_PASSWORD, salt);
    const entries = demoVaultPayloads().map((payload) => ({
      id: id("vault"),
      payload,
      archived: false,
      createdAt: now,
      updatedAt: now,
    }));
    const encryptedItems = await Promise.all(
      entries.map(async ({ payload, ...entry }) => ({
        ...entry,
        encrypted: await encryptJson(key, payload),
      }))
    );

    workspace.privateVault = {
      salt,
      verifier: await encryptJson(key, { kind: "daily-ops-vault", version: 1 }),
      items: encryptedItems,
      createdAt: now,
      updatedAt: now,
    };
  }

  function demoVaultPayloads() {
    return [
      {
        category: "Login",
        title: "GitHub Demo Account",
        url: "https://github.com/login",
        username: "demo.builder@example.com",
        password: "fake-gh-demo-7Hk!29",
        recoveryEmail: "recovery.demo@example.com",
        notes: "Fake example for demonstrating login records. Replace with your own encrypted data.",
        tags: ["login", "developer"],
      },
      {
        category: "Bank Account",
        title: "Example Operating Account",
        bankName: "Example National Bank",
        accountHolder: "Demo Builder",
        accountType: "Checking",
        accountNumber: "000123456789",
        routingNumber: "021000021",
        swiftCode: "EXAMPUS33",
        branch: "Online",
        url: "https://bank.example.com",
        username: "demo.ops",
        password: "fake-bank-demo-42!",
        notes: "Fake bank data for layout testing only.",
        tags: ["bank", "operations"],
      },
      {
        category: "Payment Card",
        title: "Example SaaS Card",
        cardholder: "Demo Builder",
        cardNumber: "4111111111111111",
        cardExpiry: "08/29",
        cardCvv: "123",
        cardPin: "0000",
        bankName: "Example Card Issuer",
        url: "https://cards.example.com",
        notes: "Fake payment card example. Do not store real CVV or PIN values unless you fully accept the risk.",
        tags: ["card", "billing"],
      },
      {
        category: "API Key",
        title: "Appwrite Demo Project Key",
        serviceName: "Appwrite Cloud",
        url: "https://cloud.appwrite.io",
        username: "demo.builder@example.com",
        apiKey: "fake_appwrite_key_9vN7b2",
        secretKey: "fake_appwrite_secret_3XpQ",
        notes: "Fake token showing how API credentials are stored and copied.",
        tags: ["api", "appwrite"],
      },
      {
        category: "Identity",
        title: "Example Research Portal ID",
        documentType: "Conference Portal ID",
        documentNumber: "CONF-DEMO-2026-001",
        issuedBy: "Demo Conference System",
        accountHolder: "Demo Builder",
        issueDate: addDays(-30),
        expiryDate: addDays(335),
        notes: "Fake identity-style record for submission systems and membership IDs.",
        tags: ["identity", "research"],
      },
      {
        category: "Server",
        title: "Demo Staging Server",
        host: "staging.dailyops.example",
        port: "22",
        username: "deploy",
        password: "fake-server-demo-5Pz!",
        sshKey: "-----BEGIN OPENSSH PRIVATE KEY-----\nfake-demo-key\n-----END OPENSSH PRIVATE KEY-----",
        notes: "Fake server credential example for engineering operations.",
        tags: ["server", "deploy"],
      },
    ];
  }

  function makeTask(overrides = {}) {
    const now = new Date().toISOString();
    return {
      id: id("task"),
      title: "",
      description: "",
      status: "backlog",
      priority: "Medium",
      dueDate: "",
      projectId: "",
      tags: [],
      subtasks: [],
      recurring: "",
      attachmentNote: "",
      favorite: false,
      archived: false,
      createdAt: now,
      updatedAt: now,
      ...overrides,
    };
  }

  function render() {
    const user = currentUser();
    if (!user) {
      renderAuth();
      return;
    }
    renderApp(user);
  }

  function renderAuth() {
    app.innerHTML = `
      <main class="auth-page">
        <div class="auth-ambient" aria-hidden="true"></div>
        <button class="btn icon auth-theme-toggle" type="button" data-action="toggle-theme" title="Toggle theme" aria-label="Toggle theme">${themeIconOnly()}</button>
        <section class="auth-intro">
          <div class="brand-row">
            <img class="brand-logo" src="./assets/logo.png" alt="" onerror="this.hidden=true; this.nextElementSibling.hidden=false" />
            <span class="brand-mark" hidden>DO</span><span>Daily Ops Hub</span>
          </div>
          <div class="auth-signal-strip" aria-label="Core workspace areas">
            <span>${icon("columns")} Kanban</span>
            <span>${icon("file-text")} Papers</span>
            <span>${icon("message-code")} Prompts</span>
            <span>${icon("shield")} Vault</span>
          </div>
          <div>
            <h1>Manage your daily tech work in one secure workspace.</h1>
            <p>
              Plan tasks, capture ideas, track research papers, reuse prompts, store notes,
              and protect private records without switching between disconnected tools.
            </p>
          </div>
          <div class="auth-preview" aria-hidden="true">
            <div class="preview-head">
              <span>${icon("dashboard")} Today</span>
              <span>Demo workspace</span>
            </div>
            <div class="preview-board">
              <div><strong>Backlog</strong><span></span><span></span></div>
              <div><strong>In Progress</strong><span></span><span></span></div>
              <div><strong>Done</strong><span></span><span></span></div>
            </div>
          </div>
          <div class="auth-highlights">
            <div class="highlight accent-blue">${icon("shield")}<strong>Secure account flow</strong><span>Signup, email verification, login, password reset, and profile settings built into the flow.</span></div>
            <div class="highlight accent-teal">${icon("dashboard")}<strong>Operations command center</strong><span>Kanban, planner, calendar, activity timeline, analytics, projects, and quick capture.</span></div>
            <div class="highlight accent-violet">${icon("file-text")}<strong>Research and paper pipeline</strong><span>Business ideas, research notes, saved prompts, submissions, collaborators, and sources.</span></div>
            <div class="highlight accent-amber">${icon("lightbulb")}<strong>Business idea workspace</strong><span>Capture business ideas, research directions, saved prompts, bookmarks, and project plans with dated history.</span></div>
          </div>
          <div class="developer-credit">
            <span>Developed by <strong>S M Asif Hossain</strong></span>
            <a class="btn icon social-button linkedin-button" href="https://www.linkedin.com/in/smasifhossain/" target="_blank" rel="noreferrer" title="LinkedIn profile" aria-label="LinkedIn profile">${iconOnly("linkedin", "LinkedIn profile")}</a>
            <a class="btn icon social-button github-button" href="https://github.com/smAsifHossain/Daily-Ops-Hub" target="_blank" rel="noreferrer" title="GitHub repository" aria-label="GitHub repository">${iconOnly("github", "GitHub repository")}</a>
          </div>
        </section>
        <section class="auth-panel">
          <div class="auth-card">
            ${renderAuthCard()}
          </div>
        </section>
      </main>
    `;
  }

  function renderAuthCard() {
    if (ui.authScreen === "signup") return renderSignup();
    if (ui.authScreen === "verify") return renderVerify();
    if (ui.authScreen === "forgot") return renderForgot();
    if (ui.authScreen === "reset") return renderReset();
    return renderLogin();
  }

  function renderLogin() {
    return `
      <h2>Log in</h2>
      <p>Use your verified email and password. For a quick preview, start with the demo workspace.</p>
      <form class="form-grid" data-form="login">
        ${field("email", "Email", "email", "", true)}
        ${field("password", "Password", "password", "", true)}
        <div class="auth-actions">
          <button class="btn primary" type="submit">${iconLabel("lock", "Log in")}</button>
          <button class="btn" type="button" data-action="demo-login">${iconLabel("dashboard", "Use demo account")}</button>
        </div>
      </form>
      ${notice()}
      <div class="auth-actions">
        <button class="text-button" type="button" data-auth-screen="signup">Create account</button>
        <button class="text-button" type="button" data-auth-screen="forgot">Forgot password?</button>
      </div>
    `;
  }

  function renderSignup() {
    return `
      <h2>Create account</h2>
      <p>A verification email is required before normal login is enabled.</p>
      <form class="form-grid" data-form="signup">
        ${field("name", "Name", "text", "", true)}
        ${field("email", "Email", "email", "", true)}
        ${field("password", "Password", "password", "", true, passwordRequirementMessage())}
        <div class="auth-actions">
          <button class="btn primary" type="submit">${iconLabel("message-code", "Send verification code")}</button>
          <button class="btn ghost" type="button" data-auth-screen="login">${iconLabel("arrow-left", "Back to login")}</button>
        </div>
      </form>
      ${notice()}
    `;
  }

  function renderVerify() {
    const pending = latestPendingCode(ui.verifyEmail);
    return `
      <h2>Verify email</h2>
      <p>Enter the 6-digit code sent to ${esc(ui.verifyEmail || "your email")}.</p>
      <form class="form-grid" data-form="verify">
        <input type="hidden" name="email" value="${esc(ui.verifyEmail)}" />
        ${field("code", "Verification code", "text", "", true)}
        <div class="auth-actions">
          <button class="btn primary" type="submit">${iconLabel("check", "Activate account")}</button>
          <button class="btn" type="button" data-action="resend-code">${iconLabel("message-code", "Resend code")}</button>
        </div>
      </form>
      ${pending ? devMail("Development email preview", pending.code, pending.expiresAt) : ""}
      ${notice()}
      <div class="auth-actions">
        <button class="text-button" type="button" data-auth-screen="login">Back to login</button>
      </div>
    `;
  }

  function renderForgot() {
    return `
      <h2>Reset password</h2>
      <p>Enter your account email to receive a secure reset link and choose a new password.</p>
      <form class="form-grid" data-form="forgot">
        ${field("email", "Email", "email", "", true)}
        <div class="auth-actions">
          <button class="btn primary" type="submit">${iconLabel("message-code", "Send reset email")}</button>
          <button class="btn ghost" type="button" data-auth-screen="login">${iconLabel("arrow-left", "Back to login")}</button>
        </div>
      </form>
      ${notice()}
    `;
  }

  function renderReset() {
    const pending = latestResetCode(ui.resetEmail);
    const cloudRecovery = Boolean(ui.resetUserId && ui.resetSecret);
    return `
      <h2>Choose new password</h2>
      <p>${cloudRecovery ? "Enter a new password to complete the secure reset link." : `If the account exists, a reset code was sent to ${esc(ui.resetEmail || "that email")}.`}</p>
      <form class="form-grid" data-form="reset">
        <input type="hidden" name="email" value="${esc(ui.resetEmail)}" />
        <input type="hidden" name="resetUserId" value="${esc(ui.resetUserId)}" />
        <input type="hidden" name="resetSecret" value="${esc(ui.resetSecret)}" />
        ${cloudRecovery ? "" : field("code", "Reset code", "text", "", true)}
        ${field("password", "New password", "password", "", true)}
        <div class="auth-actions">
          <button class="btn primary" type="submit">${iconLabel("lock", "Update password")}</button>
          <button class="btn ghost" type="button" data-auth-screen="login">${iconLabel("arrow-left", "Back to login")}</button>
        </div>
      </form>
      ${pending ? devMail("Development reset email preview", pending.code, pending.expiresAt) : ""}
      ${notice()}
    `;
  }

  function renderApp(user) {
    const workspace = getWorkspace(user.id);
    const queryActive = ui.query.trim().length > 0;
    const content = queryActive ? renderSearchPage(workspace) : renderRoute(workspace);
    app.innerHTML = `
      <div class="app-shell ${ui.sidebarCollapsed ? "sidebar-collapsed" : ""}">
        <aside class="sidebar ${ui.sidebarOpen ? "open" : ""} ${ui.sidebarCollapsed ? "collapsed" : ""}">
          <button class="brand-row brand-button" type="button" data-action="go-dashboard" title="Go to dashboard">
            <img class="brand-logo" src="./assets/logo.png" alt="" onerror="this.hidden=true; this.nextElementSibling.hidden=false" />
            <span class="brand-mark" hidden>DO</span><span class="brand-name">Daily Ops Hub</span>
          </button>
          <nav class="nav-list" aria-label="Primary navigation">
            ${routes.map(([route, label, icon]) => navButton(route, label, icon, workspace)).join("")}
          </nav>
          <div class="sidebar-footer">
            <div class="user-chip">
              <strong>${esc(user.name)}</strong>
              <span>${esc(user.email)}</span>
            </div>
            <button class="btn logout-button" type="button" data-action="logout">${iconLabel("log-out", "Log out")}</button>
          </div>
        </aside>
        <div class="sidebar-backdrop ${ui.sidebarOpen ? "open" : ""}" data-action="close-sidebar"></div>
        <main class="main">
          <header class="topbar">
            <button class="btn icon sidebar-toggle" type="button" data-action="toggle-sidebar" title="${ui.sidebarCollapsed ? "Show navigation" : "Hide navigation"}" aria-label="${ui.sidebarCollapsed ? "Show navigation" : "Hide navigation"}">${iconOnly("panel", ui.sidebarCollapsed ? "Show navigation" : "Hide navigation")}</button>
            <div class="search-wrap">
              <span>${icon("search")}</span>
              <input id="globalSearch" type="search" placeholder="Search tasks, ideas, notes, prompts..." value="${esc(ui.query)}" autocomplete="off" />
            </div>
            <div class="toolbar-actions">
              <button class="btn icon" type="button" data-action="open-command" title="Command palette (Ctrl+K)" aria-label="Command palette">${iconOnly("command", "Command palette")}</button>
              <button class="btn primary" type="button" data-editor-type="task">${iconLabel("plus", "New task")}</button>
              <button class="btn icon" type="button" data-action="toggle-theme" title="Toggle theme" aria-label="Toggle theme">${themeIconOnly()}</button>
            </div>
          </header>
          <div class="content">
            ${notice()}
            ${content}
          </div>
        </main>
      </div>
      ${ui.editor ? renderEditorModal(workspace) : ""}
      ${ui.vaultEditor ? renderVaultEditorModal(workspace) : ""}
      ${ui.commandOpen ? renderCommandPalette() : ""}
    `;
  }

  function navButton(route, label, iconName, workspace) {
    const count = routeCount(route, workspace);
    return `
      <button class="nav-button ${ui.route === route ? "active" : ""}" type="button" data-route="${route}" title="${esc(label)}">
        <span class="nav-icon">${icon(iconName)}</span>
        <span>${label}</span>
        ${count ? `<span class="nav-badge">${count}</span>` : `<span class="nav-spacer" aria-hidden="true"></span>`}
      </button>
    `;
  }

  function routeCount(route, workspace) {
    const map = {
      tasks: workspace.tasks.filter((item) => !item.archived).length,
      ideas: workspace.ideas.filter((item) => !item.archived).length,
      research: workspace.researchItems.filter((item) => !item.archived).length,
      prompts: workspace.prompts.filter((item) => !item.archived).length,
      papers: workspace.papers.filter((item) => !item.archived).length,
      vault: workspace.privateVault.items.filter((item) => !item.archived).length,
      notes: workspace.notes.filter((item) => !item.archived).length,
      bookmarks: workspace.bookmarks.filter((item) => !item.archived).length,
      projects: workspace.projects.filter((item) => !item.archived).length,
    };
    return map[route] || "";
  }

  function renderRoute(workspace) {
    switch (ui.route) {
      case "tasks":
        return renderTasksPage(workspace);
      case "daily":
        return renderDailyPlanner(workspace);
      case "ideas":
        return renderCollectionPage(workspace, "idea");
      case "research":
        return renderCollectionPage(workspace, "research");
      case "prompts":
        return renderCollectionPage(workspace, "prompt");
      case "papers":
        return renderCollectionPage(workspace, "paper");
      case "vault":
        return renderVaultPage(workspace);
      case "notes":
        return renderCollectionPage(workspace, "note");
      case "bookmarks":
        return renderCollectionPage(workspace, "bookmark");
      case "calendar":
        return renderCalendar(workspace);
      case "projects":
        return renderCollectionPage(workspace, "project");
      case "timeline":
        return renderTimeline(workspace);
      case "analytics":
        return renderAnalytics(workspace);
      case "settings":
        return renderSettings(workspace);
      default:
        return renderDashboard(workspace);
    }
  }

  function renderDashboard(workspace) {
    const stats = computeStats(workspace);
    return `
      ${pageHead(
        "Dashboard",
        "Create work, move it forward, and jump into your idea systems without losing the thread.",
        `<button class="btn primary" type="button" data-editor-type="task">${iconLabel("plus", "New task")}</button>
         <button class="btn" type="button" data-editor-type="idea">${iconLabel("lightbulb", "New idea")}</button>`
      )}
      ${renderStats(stats)}
      <section class="dashboard-grid">
        <div class="dashboard-main">
          <section class="section dashboard-capture">
            <div class="section-head">
              <h2>Quick capture</h2>
              <span class="hint">Everything is saved immediately in this local build.</span>
            </div>
            <form class="quick-capture" data-form="quick-capture">
              <input name="title" placeholder="Capture a task, idea, note, prompt, or link..." required />
              <select name="type">
                <option value="task">Task</option>
                <option value="idea">Business idea</option>
                <option value="research">Research idea</option>
                <option value="prompt">Saved prompt</option>
                <option value="paper">Submitted paper</option>
                <option value="note">Knowledge note</option>
                <option value="bookmark">Bookmark</option>
              </select>
              <button class="btn primary" type="submit">${iconLabel("plus", "Capture")}</button>
            </form>
          </section>
          <section class="section dashboard-board">
            <div class="section-head">
              <h2>Task board</h2>
              <button class="btn icon section-action" type="button" data-route="tasks" title="Open tasks" aria-label="Open tasks">${iconOnly("external-link", "Open tasks")}</button>
            </div>
            ${renderKanban(workspace)}
          </section>
        </div>
        <aside class="dashboard-rail">
          <section class="dashboard-side-block">
            <div class="section-head">
              <h2>Today</h2>
              <button class="btn icon section-action" type="button" data-route="daily" title="Open planner" aria-label="Open planner">${iconOnly("calendar-check", "Open planner")}</button>
            </div>
            ${renderTodayCard(workspace)}
          </section>
          <section class="dashboard-side-block">
            <div class="section-head">
              <h2>Recent activity</h2>
              <button class="btn icon section-action" type="button" data-route="timeline" title="View all activity" aria-label="View all activity">${iconOnly("activity", "View all activity")}</button>
            </div>
            <div class="timeline recent-activity-list">
              ${recentActivity(workspace, 40)}
            </div>
          </section>
        </aside>
      </section>
    `;
  }

  function renderStats(stats) {
    return `
      <section class="section stats-grid">
        <div class="stat open"><div class="stat-top"><span>Open tasks</span>${icon("columns")}</div><strong>${stats.openTasks}</strong><small>${stats.doneToday} done today</small></div>
        <div class="stat overdue"><div class="stat-top"><span>Overdue</span>${icon("clock")}</div><strong>${stats.overdue}</strong><small>Needs attention</small></div>
        <div class="stat ideas"><div class="stat-top"><span>Ideas</span>${icon("lightbulb")}</div><strong>${stats.ideas}</strong><small>Business + research</small></div>
        <div class="stat papers"><div class="stat-top"><span>Papers</span>${icon("file-text")}</div><strong>${stats.papers}</strong><small>${stats.activePapers} active pipeline</small></div>
        <div class="stat assets"><div class="stat-top"><span>Knowledge assets</span>${icon("book")}</div><strong>${stats.assets}</strong><small>Prompts, notes, links</small></div>
      </section>
    `;
  }

  function renderTodayCard(workspace) {
    const today = dateKey(new Date());
    const plan = workspace.dailyPlans.find((item) => item.date === today);
    const dueToday = workspace.tasks.filter((task) => !task.archived && task.dueDate === today);
    return `
      <div class="item-card">
        <h3>${esc(plan?.focus || "No focus set yet")}</h3>
        <p>${esc(plan?.notes || "Open the daily planner to set your focus and closing review.")}</p>
        <div class="tag-row">
          <span class="pill blue">${dueToday.length} due today</span>
          <span class="pill teal">${workspace.tasks.filter((task) => task.status === "inProgress").length} in progress</span>
        </div>
      </div>
    `;
  }

  function renderTasksPage(workspace) {
    return `
      ${pageHead(
        "Kanban Tasks",
        "Drag cards across columns, or use the move buttons when drag-and-drop is awkward on mobile.",
        `<button class="btn primary" type="button" data-editor-type="task">${iconLabel("plus", "New task")}</button>`
      )}
      ${renderKanban(workspace)}
    `;
  }

  function renderKanban(workspace) {
    return `
      <div class="kanban">
        ${taskStatuses
          .map(([status, label]) => {
            const tasks = workspace.tasks
              .filter((task) => !task.archived && task.status === status)
              .sort(compareTasksByPriorityAndDueDate);
            return `
              <section class="kanban-column" data-drop-status="${status}">
                <div class="column-head"><strong>${label}</strong><span>${tasks.length}</span></div>
                <div class="card-list">
                  ${tasks.length ? tasks.map((task) => renderTaskCard(task, workspace)).join("") : `<div class="empty-state">Drop a task here.</div>`}
                </div>
              </section>
            `;
          })
          .join("")}
      </div>
    `;
  }

  function renderTaskCard(task, workspace) {
    const project = workspace.projects.find((item) => item.id === task.projectId);
    const priority = task.priority || "Medium";
    const dueClass = task.dueDate && task.dueDate < dateKey(new Date()) && task.status !== "done" ? "high" : "blue";
    const moveButtons = [
      ["backlog", "Move to Backlog", "arrow-left"],
      ["inProgress", "Move to In Progress", "clock"],
      ["done", "Move to Done", "check"],
    ]
      .filter(([status]) => task.status !== status)
      .map(
        ([status, label, iconName]) =>
          `<button class="mini-btn icon-mini" type="button" data-move-task="${esc(task.id)}" data-status="${status}" title="${label}" aria-label="${label}">${iconOnly(iconName, label)}</button>`
      )
      .join("");
    return `
      <article class="task-card" draggable="true" data-task-id="${esc(task.id)}">
        <div>
          <h3>${esc(task.title)}</h3>
          ${task.description ? `<p>${esc(task.description)}</p>` : ""}
        </div>
        <div class="meta-row">
          <span class="pill ${priority.toLowerCase()}">${esc(priority)}</span>
          ${task.dueDate ? `<span class="pill ${dueClass}">Due ${formatDate(task.dueDate)}</span>` : ""}
          ${project ? `<span class="pill violet">${esc(project.title)}</span>` : ""}
          ${task.recurring ? `<span class="pill teal">${esc(task.recurring)}</span>` : ""}
        </div>
        ${renderTags(task.tags)}
        <div class="card-actions">
          <button class="mini-btn icon-mini" type="button" data-edit-type="task" data-id="${esc(task.id)}" title="Edit task" aria-label="Edit task">${iconOnly("edit", "Edit task")}</button>
          ${moveButtons}
          <button class="mini-btn icon-mini" type="button" data-archive-type="task" data-id="${esc(task.id)}" title="Archive task" aria-label="Archive task">${iconOnly("archive", "Archive task")}</button>
        </div>
      </article>
    `;
  }

  function compareTasksByPriorityAndDueDate(a, b) {
    const priorityDifference = priorityRank(a.priority) - priorityRank(b.priority);
    if (priorityDifference) return priorityDifference;

    const dueDifference = dueDateRank(a.dueDate) - dueDateRank(b.dueDate);
    if (dueDifference) return dueDifference;

    return new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0);
  }

  function priorityRank(priority) {
    return taskPriorityRank[priority] ?? taskPriorityRank.Medium;
  }

  function dueDateRank(dueDate) {
    return dueDate ? new Date(`${dueDate}T00:00:00`).getTime() : Number.POSITIVE_INFINITY;
  }

  function renderCollectionPage(workspace, type) {
    const schema = schemas[type];
    const collection = workspace[collectionByType[type]];
    const items = collection
      .filter((item) => !item.archived)
      .filter((item) => ui.filter === "all" || item.status === ui.filter)
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    return `
      ${pageHead(
        schema.plural,
        collectionDescription(type),
        `<button class="btn primary" type="button" data-editor-type="${type}">${iconLabel("plus", `New ${schema.title.toLowerCase()}`)}</button>`
      )}
      ${renderFilters(schema.statuses)}
      <section class="item-grid">
        ${
          items.length
            ? items.map((item) => renderItemCard(workspace, type, item)).join("")
            : `<div class="empty-state">No ${schema.plural.toLowerCase()} yet.</div>`
        }
      </section>
    `;
  }

  function renderFilters(statuses) {
    const buttons = [`<button type="button" data-filter="all" class="${ui.filter === "all" ? "active" : ""}">All</button>`]
      .concat(
        statuses.map(
          (status) => `<button type="button" data-filter="${esc(status)}" class="${ui.filter === status ? "active" : ""}">${esc(status)}</button>`
        )
      )
      .join("");
    return `<div class="filters">${buttons}</div>`;
  }

  function renderItemCard(workspace, type, item) {
    const schema = schemas[type];
    const project = workspace.projects.find((projectItem) => projectItem.id === item.projectId);
    const preview = item.abstract || item.question || item.summary || item.url || item.body || "";
    return `
      <article class="item-card">
        <div>
          <h3>${esc(item.title)}</h3>
          ${preview ? `<p>${esc(trim(preview, 210))}</p>` : ""}
        </div>
        <div class="meta-row">
          <span class="pill ${schema.accent}">${esc(item.status || schema.defaultStatus)}</span>
          <span class="pill">Updated ${formatDate(item.updatedAt)}</span>
          ${project ? `<span class="pill violet">${esc(project.title)}</span>` : ""}
          ${item.favorite ? `<span class="pill high">Favorite</span>` : ""}
        </div>
        ${type === "paper" ? renderPaperDetails(item) : ""}
        ${renderTags(item.tags)}
        ${type === "prompt" ? `<pre>${esc(trim(item.body, 380))}</pre>` : ""}
        ${type === "bookmark" && item.url ? `<a class="btn" href="${esc(item.url)}" target="_blank" rel="noreferrer">${iconLabel("external-link", "Open link")}</a>` : ""}
        ${type === "paper" ? renderPaperLinks(item) : ""}
        <div class="card-actions">
          <button class="mini-btn icon-mini" type="button" data-edit-type="${type}" data-id="${esc(item.id)}" title="Edit" aria-label="Edit">${iconOnly("edit", "Edit")}</button>
          ${type === "prompt" ? `<button class="mini-btn icon-mini" type="button" data-copy-prompt="${esc(item.id)}" title="Copy prompt" aria-label="Copy prompt">${iconOnly("copy", "Copy prompt")}</button>` : ""}
          <button class="mini-btn icon-mini heart-action ${item.favorite ? "active" : ""}" type="button" data-toggle-favorite-type="${type}" data-id="${esc(item.id)}" title="${item.favorite ? "Remove favorite" : "Favorite"}" aria-label="${item.favorite ? "Remove favorite" : "Favorite"}">${iconOnly("heart", item.favorite ? "Remove favorite" : "Favorite")}</button>
          <button class="mini-btn icon-mini" type="button" data-archive-type="${type}" data-id="${esc(item.id)}" title="Archive" aria-label="Archive">${iconOnly("archive", "Archive")}</button>
        </div>
      </article>
    `;
  }

  function renderPaperDetails(item) {
    const details = [];
    if (item.venue) details.push(`<span class="pill blue">${esc(item.venue)}</span>`);
    if (item.paperType) details.push(`<span class="pill">${esc(item.paperType)}</span>`);
    if (item.deadline) details.push(`<span class="pill high">Deadline ${formatDate(item.deadline)}</span>`);
    if (item.submittedAt) details.push(`<span class="pill teal">Submitted ${formatDate(item.submittedAt)}</span>`);
    if (item.decisionAt) details.push(`<span class="pill violet">Decision ${formatDate(item.decisionAt)}</span>`);
    if (item.collaborators?.length) {
      item.collaborators.slice(0, 3).forEach((name) => details.push(`<span class="pill">With ${esc(name)}</span>`));
      if (item.collaborators.length > 3) details.push(`<span class="pill">+${item.collaborators.length - 3} more</span>`);
    }
    if (!details.length) return "";
    return `<div class="meta-row">${details.join("")}</div>`;
  }

  function renderPaperLinks(item) {
    const links = [];
    if (item.overleafLink) links.push(`<a class="btn" href="${esc(item.overleafLink)}" target="_blank" rel="noreferrer">${iconLabel("external-link", "Overleaf")}</a>`);
    if (item.submissionUrl) links.push(`<a class="btn" href="${esc(item.submissionUrl)}" target="_blank" rel="noreferrer">${iconLabel("external-link", "Submission")}</a>`);
    if (item.artifactLink) links.push(`<a class="btn" href="${esc(item.artifactLink)}" target="_blank" rel="noreferrer">${iconLabel("external-link", "Artifact")}</a>`);
    if (item.arxivLink) links.push(`<a class="btn" href="${esc(item.arxivLink)}" target="_blank" rel="noreferrer">${iconLabel("external-link", "Preprint")}</a>`);
    if (!links.length) return "";
    return `<div class="row-actions paper-links">${links.join("")}</div>`;
  }

  function renderVaultPage(workspace) {
    const configured = vaultConfigured(workspace);
    const unlocked = vaultUnlockedFor(workspace);
    const count = workspace.privateVault.items.filter((item) => !item.archived).length;

    if (!configured) {
      return `
        ${pageHead("Private Vault", "Set up an encrypted space for logins, bank details, payment cards, identities, and secure notes.", "")}
        <section class="split">
          <form class="panel form-grid vault-gate" data-form="vault-setup" autocomplete="off">
            <div class="section-head">
              <h2>Create vault</h2>
              <span class="pill high">Sensitive</span>
            </div>
            ${vaultField("vaultPassword", "Login password", "password", "", true, "Use the same password you use to log in. It is checked locally and never stored as plaintext.", "current-password")}
            <button class="btn primary" type="submit">${iconLabel("shield", "Create encrypted vault")}</button>
          </form>
          ${renderVaultSecurityNotes()}
        </section>
      `;
    }

    if (!unlocked) {
      return `
        ${pageHead("Private Vault", "Unlock your encrypted vault to view or manage sensitive records.", "")}
        <section class="split">
          <form class="panel form-grid vault-gate" data-form="vault-unlock" autocomplete="off">
            <div class="section-head">
              <h2>Unlock vault</h2>
              <span class="pill blue">${count} encrypted ${count === 1 ? "item" : "items"}</span>
            </div>
            ${vaultField("vaultPassword", "Login password", "password", "", true, "The vault key is derived from your login password in this browser and kept only in memory.", "current-password")}
            <div class="auth-actions">
              <button class="btn primary" type="submit">${iconLabel("lock", "Unlock vault")}</button>
            </div>
          </form>
          ${renderVaultSecurityNotes()}
        </section>
      `;
    }

    const items = vaultState.items
      .filter((item) => !item.archived)
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    return `
      ${pageHead(
        "Private Vault",
        "Encrypted records for sensitive operations. Unlocked data stays in memory while you work.",
        `<button class="btn primary" type="button" data-action="new-vault-item">${iconLabel("plus", "New vault item")}</button>
         <button class="btn" type="button" data-action="lock-vault">${iconLabel("lock", "Lock vault")}</button>`
      )}
      <section class="item-grid vault-grid">
        ${items.length ? items.map(renderVaultItemCard).join("") : `<div class="empty-state">No private records yet.</div>`}
      </section>
    `;
  }

  function renderVaultSecurityNotes() {
    return `
      <aside class="panel slim security-notes">
        <div class="section-head"><h2>Security model</h2></div>
        <div class="timeline">
          <div class="timeline-item"><strong>Client-side encryption</strong><span>Vault entries are encrypted with AES-GCM before saving to browser storage.</span></div>
          <div class="timeline-item"><strong>Login-password key</strong><span>The key is derived from your login password with PBKDF2 and is not stored.</span></div>
          <div class="timeline-item"><strong>Reduced leakage</strong><span>Vault item titles and fields are excluded from search and activity logs.</span></div>
          <div class="timeline-item"><strong>CVV and PIN caution</strong><span>CVV fields are available for personal records, but storing CVV/PIN data is risky and may violate payment-processing rules.</span></div>
        </div>
      </aside>
    `;
  }

  function renderVaultItemCard(entry) {
    const item = entry.payload || {};
    const copyButtons = [
      ["username", "User"],
      ["password", "Password"],
      ["accountNumber", "Account"],
      ["routingNumber", "Routing"],
      ["cardNumber", "Card"],
      ["cardCvv", "CVV"],
      ["cardPin", "PIN"],
      ["documentNumber", "Document"],
      ["apiKey", "API Key"],
      ["secretKey", "Secret"],
      ["sshKey", "SSH Key"],
    ]
      .filter(([fieldName]) => item[fieldName])
      .map(([fieldName, label]) => `<button class="mini-btn compact-action" type="button" data-copy-vault="${esc(entry.id)}" data-field="${fieldName}" title="Copy ${label}">${iconLabel("copy", label)}</button>`)
      .join("");

    return `
      <article class="item-card vault-card">
        <div>
          <h3>${esc(item.title || "Untitled private item")}</h3>
          <p>${esc(vaultSummary(item))}</p>
        </div>
        <div class="meta-row">
          <span class="pill high">${esc(item.category || "Secure Note")}</span>
          <span class="pill">Updated ${formatDate(entry.updatedAt)}</span>
          ${item.url ? `<a class="pill blue" href="${esc(item.url)}" target="_blank" rel="noreferrer">${icon("external-link")}Open site</a>` : ""}
        </div>
        ${renderTags(item.tags)}
        <details class="vault-details">
          <summary>${icon("eye")}<span>Reveal details</span></summary>
          <div class="vault-secret-list">
            ${vaultSecretRow(entry.id, "Site or URL", "url", item.url)}
            ${vaultSecretRow(entry.id, "Username", "username", item.username)}
            ${vaultSecretRow(entry.id, "Password", "password", item.password, true)}
            ${vaultSecretRow(entry.id, "Recovery email", "recoveryEmail", item.recoveryEmail)}
            ${vaultSecretRow(entry.id, "Bank", "bankName", item.bankName)}
            ${vaultSecretRow(entry.id, "Account holder", "accountHolder", item.accountHolder)}
            ${vaultSecretRow(entry.id, "Account type", "accountType", item.accountType)}
            ${vaultSecretRow(entry.id, "Account number", "accountNumber", item.accountNumber, true)}
            ${vaultSecretRow(entry.id, "Routing / IBAN", "routingNumber", item.routingNumber, true)}
            ${vaultSecretRow(entry.id, "SWIFT / BIC", "swiftCode", item.swiftCode, true)}
            ${vaultSecretRow(entry.id, "Branch", "branch", item.branch)}
            ${vaultSecretRow(entry.id, "Cardholder", "cardholder", item.cardholder)}
            ${vaultSecretRow(entry.id, "Card number", "cardNumber", item.cardNumber, true)}
            ${vaultSecretRow(entry.id, "Expiry", "cardExpiry", item.cardExpiry)}
            ${vaultSecretRow(entry.id, "CVV", "cardCvv", item.cardCvv, true)}
            ${vaultSecretRow(entry.id, "Card PIN", "cardPin", item.cardPin, true)}
            ${vaultSecretRow(entry.id, "Document type", "documentType", item.documentType)}
            ${vaultSecretRow(entry.id, "Document number", "documentNumber", item.documentNumber, true)}
            ${vaultSecretRow(entry.id, "Issued by", "issuedBy", item.issuedBy)}
            ${vaultSecretRow(entry.id, "Issue date", "issueDate", item.issueDate)}
            ${vaultSecretRow(entry.id, "Expiry date", "expiryDate", item.expiryDate)}
            ${vaultSecretRow(entry.id, "Service", "serviceName", item.serviceName)}
            ${vaultSecretRow(entry.id, "API key", "apiKey", item.apiKey, true)}
            ${vaultSecretRow(entry.id, "Secret key", "secretKey", item.secretKey, true)}
            ${vaultSecretRow(entry.id, "Host", "host", item.host)}
            ${vaultSecretRow(entry.id, "Port", "port", item.port)}
            ${vaultSecretRow(entry.id, "SSH key", "sshKey", item.sshKey, true)}
            ${item.notes ? `<div class="vault-secret-row wide"><span>Notes</span><pre>${esc(item.notes)}</pre></div>` : ""}
          </div>
        </details>
        <div class="card-actions">
          <button class="mini-btn icon-mini" type="button" data-edit-vault="${esc(entry.id)}" title="Edit private item" aria-label="Edit private item">${iconOnly("edit", "Edit private item")}</button>
          ${copyButtons}
          <button class="mini-btn icon-mini" type="button" data-archive-vault="${esc(entry.id)}" title="Archive private item" aria-label="Archive private item">${iconOnly("archive", "Archive private item")}</button>
          <button class="mini-btn icon-mini danger-action" type="button" data-delete-vault="${esc(entry.id)}" title="Delete private item" aria-label="Delete private item">${iconOnly("trash", "Delete private item")}</button>
        </div>
      </article>
    `;
  }

  function vaultSummary(item) {
    if (item.category === "Login") {
      return [item.username ? `User ${item.username}` : "", item.password ? "Password saved" : ""].filter(Boolean).join(" · ") || "Login record";
    }
    if (item.category === "Bank Account") {
      return [item.bankName, item.accountNumber ? `Account ${maskSecret(item.accountNumber)}` : ""].filter(Boolean).join(" · ") || "Bank record";
    }
    if (item.category === "Payment Card") {
      return [item.cardholder, item.cardNumber ? `Card ${maskSecret(item.cardNumber)}` : "", item.cardExpiry].filter(Boolean).join(" · ") || "Card record";
    }
    if (item.category === "Identity") {
      return [item.documentType, item.documentNumber ? `ID ${maskSecret(item.documentNumber)}` : ""].filter(Boolean).join(" · ") || "Identity record";
    }
    if (item.category === "API Key") {
      return [item.serviceName, item.apiKey ? "API key saved" : ""].filter(Boolean).join(" · ") || "API key record";
    }
    if (item.category === "Server") {
      return [item.host, item.username ? `User ${item.username}` : ""].filter(Boolean).join(" · ") || "Server record";
    }
    return item.notes ? trim(item.notes, 120) : "Secure note";
  }

  function vaultSecretRow(entryId, label, fieldName, value, mask = false) {
    if (!value) return "";
    return `
      <div class="vault-secret-row">
        <span>${esc(label)}</span>
        <div class="vault-secret-value">
          <code>${esc(mask ? maskSecret(value) : value)}</code>
          ${mask ? `<button class="mini-btn secret-toggle" type="button" data-reveal-vault="${esc(entryId)}" data-field="${esc(fieldName)}">${secretToggleContent(false, "Show")}</button>` : ""}
        </div>
      </div>
    `;
  }

  function renderDailyPlanner(workspace) {
    const selected = ui.plannerDate || dateKey(new Date());
    const plan = workspace.dailyPlans.find((item) => item.date === selected) || {};
    const dueTasks = workspace.tasks
      .filter((task) => !task.archived && task.dueDate === selected)
      .sort(compareTasksByPriorityAndDueDate);
    return `
      ${pageHead(
        "Daily Planner",
        "Pick a date, set focus, capture notes, and close the loop with a review.",
        `<button class="btn" type="button" data-route="dashboard">${iconLabel("arrow-left", "Back to dashboard")}</button>`
      )}
      <section class="split">
        <form class="panel form-grid" data-form="daily-plan">
          ${field("date", "Date", "date", selected, true)}
          ${field("focus", "Focus", "text", plan.focus || "", false)}
          ${textarea("notes", "Notes", plan.notes || "", false)}
          ${textarea("review", "End-of-day review", plan.review || "", false)}
          <button class="btn primary" type="submit">${iconLabel("check", "Save planner")}</button>
        </form>
        <aside class="panel slim">
          <div class="section-head">
            <h2>Due on ${formatDate(selected)}</h2>
            <button class="btn" type="button" data-editor-type="task">${iconLabel("plus", "Add task")}</button>
          </div>
          <div class="timeline">
            ${
              dueTasks.length
                ? dueTasks.map((task) => renderTaskCard(task, workspace)).join("")
                : `<div class="empty-state">No tasks due on this date.</div>`
            }
          </div>
        </aside>
      </section>
    `;
  }

  function renderCalendar(workspace) {
    const [year, month] = ui.calendarMonth.split("-").map(Number);
    const first = new Date(year, month - 1, 1);
    const start = new Date(first);
    start.setDate(first.getDate() - first.getDay());
    const cells = [];
    for (let i = 0; i < 42; i += 1) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      cells.push(date);
    }

    return `
      ${pageHead(
        "Calendar",
        "Tasks, daily plans, recurring work, and deadlines in one monthly view.",
        `<button class="btn primary" type="button" data-editor-type="task">${iconLabel("plus", "New task")}</button>`
      )}
      <section class="panel slim">
        <div class="calendar-toolbar">
          <button class="btn icon" type="button" data-calendar-move="-1" title="Previous month" aria-label="Previous month">${iconOnly("chevron-left", "Previous month")}</button>
          <h2>${first.toLocaleDateString(undefined, { month: "long", year: "numeric" })}</h2>
          <button class="btn icon" type="button" data-calendar-move="1" title="Next month" aria-label="Next month">${iconOnly("chevron-right", "Next month")}</button>
        </div>
        <div class="calendar-grid">
          ${["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => `<div class="calendar-day-name">${day}</div>`).join("")}
          ${cells.map((date) => renderCalendarCell(workspace, date, month - 1)).join("")}
        </div>
      </section>
    `;
  }

  function renderCalendarCell(workspace, date, activeMonth) {
    const key = dateKey(date);
    const tasks = workspace.tasks
      .filter((task) => !task.archived && task.dueDate === key)
      .sort(compareTasksByPriorityAndDueDate);
    const paperEvents = workspace.papers
      .filter((paper) => !paper.archived)
      .flatMap((paper) => {
        const events = [];
        if (paper.deadline === key) events.push(`Paper deadline: ${paper.title}`);
        if (paper.submittedAt === key) events.push(`Paper submitted: ${paper.title}`);
        if (paper.decisionAt === key) events.push(`Paper decision: ${paper.title}`);
        return events;
      });
    const plan = workspace.dailyPlans.find((item) => item.date === key);
    return `
      <div class="calendar-cell ${date.getMonth() === activeMonth ? "" : "muted"}">
        <strong>${date.toLocaleDateString(undefined, { month: "short", day: "numeric" })}</strong>
        ${plan?.focus ? `<div class="calendar-event">Focus: ${esc(plan.focus)}</div>` : ""}
        ${tasks.map((task) => `<div class="calendar-event">${esc(task.title)}</div>`).join("")}
        ${paperEvents.map((eventText) => `<div class="calendar-event paper-event">${esc(eventText)}</div>`).join("")}
      </div>
    `;
  }

  function renderTimeline(workspace) {
    const items = workspace.activityLogs
      .slice()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return `
      ${pageHead("Activity", "A running timeline of creates, edits, status moves, and archives.", "")}
      <section class="timeline">
        ${items.length ? items.map(renderActivity).join("") : `<div class="empty-state">No activity yet.</div>`}
      </section>
    `;
  }

  function renderAnalytics(workspace) {
    const stats = computeStats(workspace);
    const statusCounts = taskStatuses.map(([status, label]) => [
      label,
      workspace.tasks.filter((task) => !task.archived && task.status === status).length,
    ]);
    const paperStatusCounts = schemas.paper.statuses
      .filter((status) => status !== "Archived")
      .map((status) => [status, workspace.papers.filter((paper) => !paper.archived && paper.status === status).length])
      .filter(([, count]) => count > 0);
    const topTags = collectTags(workspace).slice(0, 10);
    const staleIdeas = workspace.ideas.filter((idea) => !idea.archived && daysSince(idea.updatedAt) > 14).length;

    return `
      ${pageHead("Analytics", "A lightweight signal board for daily operations and stale work.", "")}
      ${renderStats(stats)}
      <section class="item-grid">
        <div class="panel slim">
          <div class="section-head"><h2>Task distribution</h2></div>
          <div class="timeline">
            ${statusCounts.map(([label, count]) => `<div class="timeline-item"><strong>${label}</strong><span>${count} tasks</span></div>`).join("")}
          </div>
        </div>
        <div class="panel slim">
          <div class="section-head"><h2>Top tags</h2></div>
          <div class="tag-row">
            ${topTags.length ? topTags.map(([tag, count]) => `<span class="pill">${esc(tag)} ${count}</span>`).join("") : `<span class="hint">No tags yet.</span>`}
          </div>
        </div>
        <div class="panel slim">
          <div class="section-head"><h2>Paper pipeline</h2></div>
          <div class="timeline">
            ${
              paperStatusCounts.length
                ? paperStatusCounts.map(([label, count]) => `<div class="timeline-item"><strong>${esc(label)}</strong><span>${count} papers</span></div>`).join("")
                : `<div class="empty-state">No papers in the pipeline yet.</div>`
            }
          </div>
        </div>
        <div class="panel slim">
          <div class="section-head"><h2>Stale work</h2></div>
          <div class="stat"><span>Business ideas not touched in 14 days</span><strong>${staleIdeas}</strong><small>Review or archive them.</small></div>
        </div>
      </section>
    `;
  }

  function renderSettings(workspace) {
    const user = currentUser();
    return `
      ${pageHead("Settings", "Manage your account, data export, import, and the Appwrite migration path.", "")}
      <section class="settings-grid">
        <form class="panel form-grid" data-form="account-profile">
          <div class="section-head"><h2>Account Profile</h2></div>
          ${field("accountName", "Name", "text", user?.name || "", true)}
          ${field("accountEmail", "Email", "email", user?.email || "", true, "Changing email requires your current password in this local build.")}
          ${field("accountCurrentPassword", "Current password", "password", "", false)}
          <button class="btn primary" type="submit">${iconLabel("check", "Save profile")}</button>
        </form>
        <form class="panel form-grid" data-form="account-password">
          <div class="section-head"><h2>Password</h2></div>
          ${field("passwordCurrent", "Current password", "password", "", true)}
          ${field("passwordNew", "New password", "password", "", true)}
          ${passwordRequirementChecklist()}
          ${field("passwordConfirm", "Confirm new password", "password", "", true)}
          ${passwordMatchIndicator()}
          <button class="btn primary" type="submit">${iconLabel("lock", "Update password")}</button>
        </form>
        <div class="panel">
          <div class="section-head"><h2>Data source</h2></div>
          <p class="hint">
            ${isCloudUser(user)
              ? "This account is connected to Appwrite Cloud. Changes are saved locally first, then synced to your private cloud workspace."
              : "The demo account uses browser storage for a safe public preview. Personal accounts use Appwrite Cloud for login, email, and cross-device data saving."}
          </p>
          <div class="meta-row" style="margin-top:12px">
            <span class="pill blue">Mode: ${esc(isCloudUser(user) ? "appwrite" : workspace.settings.dataSource)}</span>
            <span class="pill teal">Autosave: ${workspace.settings.autosave ? "on" : "off"}</span>
          </div>
        </div>
        <div class="panel import-export">
          <div class="section-head"><h2>Export / Import</h2></div>
          <button class="btn primary" type="button" data-action="export-json">${iconLabel("download", "Download JSON backup")}</button>
          <form class="form-grid" data-form="import-json">
            ${textarea("json", "Paste JSON backup", "", false)}
            <button class="btn" type="submit">${iconLabel("upload", "Import backup")}</button>
          </form>
        </div>
      </section>
    `;
  }

  function passwordRequirementChecklist() {
    return `
      <div class="password-checklist" data-password-checklist aria-live="polite">
        ${passwordRequirementStatus("")
          .map(
            (item) => `
              <div class="password-rule" data-password-rule="${esc(item.id)}" data-met="${item.met ? "true" : "false"}">
                <span class="password-rule-icon" aria-hidden="true"></span>
                <span>${esc(item.label)}</span>
              </div>
            `
          )
          .join("")}
      </div>
    `;
  }

  function passwordMatchIndicator() {
    return `
      <div class="password-rule password-match" data-password-match data-active="false" data-met="false" aria-live="polite">
        <span class="password-rule-icon" aria-hidden="true"></span>
        <span data-password-match-text>Confirm password matches</span>
      </div>
    `;
  }

  function passwordRequirementStatus(password) {
    return [
      { id: "length", label: "At least 8 characters", met: password.length >= 8 },
      { id: "letter", label: "At least one letter", met: /[A-Za-z]/.test(password) },
      { id: "stronger", label: "At least one number or symbol", met: /[\d\W_]/.test(password) },
    ];
  }

  function passwordRequirementsMet(password) {
    return passwordRequirementStatus(password).every((item) => item.met);
  }

  function passwordRequirementMessage() {
    return "Password must be at least 8 characters and include a letter plus a number or symbol.";
  }

  function syncPasswordRequirements(form) {
    const password = form.querySelector('[name="passwordNew"]')?.value || "";
    const confirmation = form.querySelector('[name="passwordConfirm"]')?.value || "";
    passwordRequirementStatus(password).forEach((item) => {
      const row = form.querySelector(`[data-password-rule="${item.id}"]`);
      if (row) row.dataset.met = item.met ? "true" : "false";
    });

    const matchRow = form.querySelector("[data-password-match]");
    if (!matchRow) return;
    const active = confirmation.length > 0;
    const matched = active && password === confirmation;
    matchRow.dataset.active = active ? "true" : "false";
    matchRow.dataset.met = matched ? "true" : "false";
    const text = matchRow.querySelector("[data-password-match-text]");
    if (text) text.textContent = !active ? "Confirm password matches" : matched ? "Confirm password matches" : "Passwords do not match";
  }

  function renderSearchPage(workspace) {
    const results = searchAll(workspace, ui.query);
    return `
      ${pageHead("Search", `${results.length} results for "${esc(ui.query)}".`, "")}
      <section class="search-results">
        ${results.length ? results.map(renderSearchResult).join("") : `<div class="empty-state">No matching tasks, ideas, research, papers, prompts, notes, projects, or bookmarks.</div>`}
      </section>
    `;
  }

  function renderSearchResult(result) {
    return `
      <button class="search-result" type="button" data-search-route="${esc(result.route)}" data-edit-type="${esc(result.type)}" data-id="${esc(result.id)}">
        <strong>${esc(result.title)}</strong>
        <span>${esc(result.label)} · ${esc(trim(result.preview, 180))}</span>
      </button>
    `;
  }

  function renderCommandPalette() {
    const commands = [
      ["task", "New Task", "Capture work and place it on the Kanban board.", "columns"],
      ["idea", "New Business Idea", "Save market, product, and business model thinking.", "lightbulb"],
      ["research", "New Research Idea", "Track questions, hypotheses, evidence, and next actions.", "flask"],
      ["prompt", "New Prompt", "Store reusable AI prompts with variables and versions.", "message-code"],
      ["paper", "New Submitted Paper", "Track drafts, submissions, venues, collaborators, and decisions.", "file-text"],
      ["note", "New Knowledge Note", "Save code snippets, debug notes, and architecture notes.", "book"],
      ["bookmark", "New Bookmark", "Add a link to the reading queue.", "external-link"],
      ["project", "New Project", "Group tasks and knowledge assets.", "folder"],
    ];
    return `
      <div class="command-backdrop">
        <section class="command-panel" role="dialog" aria-modal="true" aria-label="Command palette">
          <div class="command-head">
            <h2>Command palette</h2>
            <button class="btn icon" type="button" data-action="close-command" title="Close command palette" aria-label="Close command palette">${iconOnly("x", "Close command palette")}</button>
          </div>
          <div class="command-body">
            <div class="command-grid">
              ${commands
                .map(
                  ([type, title, description, iconName]) => `
                    <button class="command-card" type="button" data-command-editor="${type}">
                      <span class="command-icon">${icon(iconName)}</span>
                      <strong>${title}</strong>
                      <span>${description}</span>
                    </button>
                  `
                )
                .join("")}
            </div>
          </div>
        </section>
      </div>
    `;
  }

  function renderVaultEditorModal(workspace) {
    const idValue = ui.vaultEditor.id;
    const entry = idValue ? vaultState.items.find((item) => item.id === idValue) : null;
    const title = `${entry ? "Edit" : "New"} Private Vault Item`;
    return `
      <div class="modal-backdrop">
        <section class="modal vault-modal" role="dialog" aria-modal="true" aria-label="${esc(title)}">
          <div class="modal-head">
            <h2>${esc(title)}</h2>
            <button class="btn icon" type="button" data-action="close-vault-editor" title="Close vault editor" aria-label="Close vault editor">${iconOnly("x", "Close vault editor")}</button>
          </div>
          <form data-form="vault-item-editor" data-id="${esc(idValue || "")}" autocomplete="off">
            <div class="modal-body">
              ${renderVaultEditor(entry?.payload || {})}
            </div>
            <div class="modal-actions">
              <button class="btn ghost" type="button" data-action="close-vault-editor">${iconLabel("x", "Cancel")}</button>
              <button class="btn primary" type="submit">${iconLabel("shield", "Encrypt and save")}</button>
            </div>
          </form>
        </section>
      </div>
    `;
  }

  function renderVaultEditor(item = {}) {
    const category = item.category || "Login";
    return `
      <div class="security-banner compact">
        <strong>Encrypted before save</strong>
        <span>CVV/PIN storage is risky. Use these fields only for personal records and never for payment-processing workflows.</span>
      </div>
      <div class="form-grid">
        <div class="form-grid two">
          ${vaultField("title", "Title", "text", item.title || "", true)}
          ${vaultCategoryField(category)}
        </div>

        ${vaultSection(
          category,
          "Login",
          `
            <div class="form-grid two">
              ${vaultField("url", "Account link or website", "url", item.url || "", false)}
              ${vaultField("username", "Email / username", "text", item.username || "", false)}
            </div>
            ${vaultField("password", "Password", "password", item.password || "", false, "Stored encrypted. Use copy instead of revealing when possible.", "new-password")}
            ${vaultField("recoveryEmail", "Recovery email", "email", item.recoveryEmail || "", false)}
          `
        )}

        ${vaultSection(
          category,
          "Bank Account",
          `
            <div class="form-grid two">
              ${vaultField("bankName", "Bank or institution", "text", item.bankName || "", false)}
              ${vaultField("accountHolder", "Account holder", "text", item.accountHolder || "", false)}
            </div>
            <div class="form-grid two">
              ${vaultField("accountType", "Account type", "text", item.accountType || "", false)}
              ${vaultField("accountNumber", "Account number", "password", item.accountNumber || "", false, "", "off")}
            </div>
            <div class="form-grid two">
              ${vaultField("routingNumber", "Routing / sort / IBAN", "password", item.routingNumber || "", false, "", "off")}
              ${vaultField("swiftCode", "SWIFT / BIC", "password", item.swiftCode || "", false, "", "off")}
            </div>
            <div class="form-grid two">
              ${vaultField("branch", "Branch", "text", item.branch || "", false)}
              ${vaultField("url", "Online banking link", "url", item.url || "", false)}
            </div>
            <div class="form-grid two">
              ${vaultField("username", "Online banking username", "text", item.username || "", false)}
              ${vaultField("password", "Online banking password", "password", item.password || "", false, "", "new-password")}
            </div>
          `
        )}

        ${vaultSection(
          category,
          "Payment Card",
          `
            <div class="form-grid two">
              ${vaultField("cardholder", "Cardholder name", "text", item.cardholder || "", false)}
              ${vaultField("cardNumber", "Card number", "password", item.cardNumber || "", false, "", "off")}
            </div>
            <div class="form-grid two">
              ${vaultField("cardExpiry", "Card expiry", "text", item.cardExpiry || "", false, "Example: 08/29")}
              ${vaultField("cardCvv", "CVV", "password", item.cardCvv || "", false, "Sensitive. Store only if you accept the risk.", "off")}
            </div>
            <div class="form-grid two">
              ${vaultField("cardPin", "Card PIN", "password", item.cardPin || "", false, "Sensitive. Avoid storing PINs when possible.", "off")}
              ${vaultField("bankName", "Issuer", "text", item.bankName || "", false)}
            </div>
            ${vaultField("url", "Card portal link", "url", item.url || "", false)}
          `
        )}

        ${vaultSection(
          category,
          "Identity",
          `
            <div class="form-grid two">
              ${vaultField("documentType", "Document type", "text", item.documentType || "", false)}
              ${vaultField("documentNumber", "Document number", "password", item.documentNumber || "", false, "", "off")}
            </div>
            <div class="form-grid two">
              ${vaultField("issuedBy", "Issued by", "text", item.issuedBy || "", false)}
              ${vaultField("accountHolder", "Full name", "text", item.accountHolder || "", false)}
            </div>
            <div class="form-grid two">
              ${vaultField("issueDate", "Issue date", "date", item.issueDate || "", false)}
              ${vaultField("expiryDate", "Expiry date", "date", item.expiryDate || "", false)}
            </div>
          `
        )}

        ${vaultSection(
          category,
          "API Key",
          `
            <div class="form-grid two">
              ${vaultField("serviceName", "Service", "text", item.serviceName || "", false)}
              ${vaultField("url", "Console or account link", "url", item.url || "", false)}
            </div>
            <div class="form-grid two">
              ${vaultField("username", "Account email / owner", "text", item.username || "", false)}
              ${vaultField("apiKey", "API key", "password", item.apiKey || "", false, "", "off")}
            </div>
            ${vaultField("secretKey", "Secret key / token", "password", item.secretKey || "", false, "", "off")}
          `
        )}

        ${vaultSection(
          category,
          "Server",
          `
            <div class="form-grid two">
              ${vaultField("host", "Host / IP", "text", item.host || "", false)}
              ${vaultField("port", "Port", "text", item.port || "", false)}
            </div>
            <div class="form-grid two">
              ${vaultField("username", "Username", "text", item.username || "", false)}
              ${vaultField("password", "Password", "password", item.password || "", false, "", "new-password")}
            </div>
            ${vaultTextarea("sshKey", "SSH key or connection secret", item.sshKey || "", false)}
          `
        )}

        ${vaultSection(category, "Secure Note", `<div class="empty-state">Use the notes field below for secure free-form information.</div>`)}

        ${vaultSection(
          category,
          "Other",
          `
            <div class="form-grid two">
              ${vaultField("url", "Related link", "url", item.url || "", false)}
              ${vaultField("username", "Identifier / username", "text", item.username || "", false)}
            </div>
            <div class="form-grid two">
              ${vaultField("password", "Secret", "password", item.password || "", false, "", "new-password")}
              ${vaultField("accountNumber", "Sensitive number", "password", item.accountNumber || "", false, "", "off")}
            </div>
          `
        )}

        ${vaultTextarea("notes", "Notes", item.notes || "", false)}
        ${vaultField("tagsText", "Tags", "text", (item.tags || []).join(", "), false, "Comma separated.")}
      </div>
    `;
  }

  function renderEditorModal(workspace) {
    const type = ui.editor.type;
    const idValue = ui.editor.id;
    const isTask = type === "task";
    const item = idValue ? findItem(workspace, type, idValue) : null;
    const title = `${item ? "Edit" : "New"} ${isTask ? "Task" : schemas[type].title}`;
    return `
      <div class="modal-backdrop">
        <section class="modal" role="dialog" aria-modal="true" aria-label="${esc(title)}">
          <div class="modal-head">
            <h2>${esc(title)}</h2>
            <button class="btn icon" type="button" data-action="close-editor" title="Close editor" aria-label="Close editor">${iconOnly("x", "Close editor")}</button>
          </div>
          <form data-form="${isTask ? "task-editor" : "generic-editor"}" data-editor-type="${esc(type)}" data-id="${esc(idValue || "")}">
            <div class="modal-body">
              ${isTask ? renderTaskEditor(workspace, item) : renderGenericEditor(workspace, type, item)}
            </div>
            <div class="modal-actions">
              <button class="btn ghost" type="button" data-action="close-editor">${iconLabel("x", "Cancel")}</button>
              <button class="btn primary" type="submit">${iconLabel("check", "Save")}</button>
            </div>
          </form>
        </section>
      </div>
    `;
  }

  function renderTaskEditor(workspace, task = {}) {
    task = task || {};
    return `
      <div class="form-grid">
        ${field("title", "Title", "text", task.title || "", true)}
        ${textarea("description", "Description", task.description || "", false)}
        <div class="form-grid two">
          ${selectField("status", "Status", taskStatuses.map(([, label], index) => [taskStatuses[index][0], label]), task.status || "backlog")}
          ${selectField("priority", "Priority", [["Low", "Low"], ["Medium", "Medium"], ["High", "High"]], task.priority || "Medium")}
        </div>
        <div class="form-grid two">
          ${field("dueDate", "Due date", "date", task.dueDate || "", false)}
          ${projectField(workspace, task.projectId || "")}
        </div>
        ${field("tagsText", "Tags", "text", (task.tags || []).join(", "), false, "Comma separated. Example: backend, urgent")}
        ${field("recurring", "Recurring rule", "text", task.recurring || "", false, "Example: weekly Monday, every 2 weeks, monthly review")}
        ${textarea("subtasksText", "Subtasks", (task.subtasks || []).join("\n"), false)}
        ${field("attachmentNote", "Attachment note or link", "text", task.attachmentNote || "", false)}
      </div>
    `;
  }

  function renderGenericEditor(workspace, type, item = {}) {
    item = item || {};
    const schema = schemas[type];
    return `
      <div class="form-grid">
        ${schema.fields
          .map(([name, label, kind, required]) => {
            const value = editorValue(item, name);
            if (kind === "textarea") return textarea(name, label, value, required);
            if (kind === "project") return projectField(workspace, value);
            if (kind === "select") {
              return selectField(
                name,
                label,
                schema.statuses.map((status) => [status, status]),
                value || schema.defaultStatus
              );
            }
            if (kind.startsWith("select:")) {
              const options = kind
                .replace("select:", "")
                .split("|")
                .map((option) => [option, option]);
              return selectField(name, label, options, value || options[0][0]);
            }
            return field(name, label, kind, value, required, name === "tagsText" ? "Comma separated." : "");
          })
          .join("")}
      </div>
    `;
  }

  function editorValue(item, name) {
    const listFields = {
      tagsText: "tags",
      collaboratorsText: "collaborators",
      conflictsText: "conflicts",
      keywordsText: "keywords",
    };
    if (listFields[name]) return (item[listFields[name]] || []).join(", ");
    return item[name] || "";
  }

  async function onSubmit(event) {
    const form = event.target.closest("form[data-form]");
    if (!form) return;
    event.preventDefault();
    event.stopPropagation();
    const data = readFormData(form);
    const formType = form.dataset.form;

    if (formType === "login") return login(data);
    if (formType === "signup") return signup(data);
    if (formType === "verify") return verifyAccount(data);
    if (formType === "forgot") return forgotPassword(data);
    if (formType === "reset") return resetPassword(data);
    if (formType === "quick-capture") return quickCapture(data);
    if (formType === "daily-plan") return saveDailyPlan(data);
    if (formType === "task-editor") return saveTaskEditor(form, data);
    if (formType === "generic-editor") return saveGenericEditor(form, data);
    if (formType === "vault-setup") return setupVault(data);
    if (formType === "vault-unlock") return unlockVault(data);
    if (formType === "vault-item-editor") return saveVaultItem(form, data);
    if (formType === "account-profile") return saveAccountProfile(data);
    if (formType === "account-password") return saveAccountPassword(data);
    if (formType === "import-json") return importJson(data);
  }

  function readFormData(form) {
    const data = {};
    form.querySelectorAll("input, select, textarea").forEach((fieldEl) => {
      if (!fieldEl.name || fieldEl.disabled) return;
      if (fieldEl.closest("[data-vault-section][hidden]")) return;
      data[fieldEl.name] = fieldEl.value;
    });
    return data;
  }

  async function login(data) {
    const email = normalizeEmail(data.email);
    if (shouldUseCloudAuth(email)) {
      try {
        const { account } = await getAppwrite();
        await cloudLogout();
        await account.createEmailPasswordSession(email, data.password || "");
        const profile = await account.get();
        if (!profile.emailVerification) {
          await account.createVerification(cloudCallbackUrl("verify")).catch((error) => console.warn(error));
          await cloudLogout();
          return flash("Verify your email first. We sent a fresh verification email.", "error");
        }
        const user = await upsertCloudUser(profile, data.password || "");
        await loadCloudWorkspace(user, { createIfMissing: true });
        saveSession({ userId: user.id, source: "appwrite", createdAt: new Date().toISOString() });
        ui.message = null;
        render();
        return;
      } catch (error) {
        console.warn(error);
        return flash(appwriteMessage(error, "Cloud login failed. Check your email and password."), "error");
      }
    }

    const user = db.users.find((item) => item.email === email);
    const passwordHash = await hash(data.password || "");
    if (user?.email === DEMO_EMAIL && data.password === DEMO_PASSWORD && user.passwordHash !== passwordHash) {
      user.passwordHash = passwordHash;
      user.verified = true;
    }

    if (!user || user.passwordHash !== passwordHash) {
      return flash("Email or password is incorrect.", "error");
    }
    if (!user.verified) {
      ui.authScreen = "verify";
      ui.verifyEmail = email;
      return flash("Verify your email before logging in.", "error");
    }
    if (user.email === DEMO_EMAIL) await ensureDemoWorkspace(user);
    saveSession({ userId: user.id, createdAt: new Date().toISOString() });
    ui.message = null;
    render();
  }

  async function signup(data) {
    const email = normalizeEmail(data.email);
    const name = (data.name || "").trim();
    const password = data.password || "";
    if (!name) return flash("Name is required.", "error");
    if (!isEmail(email)) return flash("Enter a valid email.", "error");
    if (!passwordRequirementsMet(password)) return flash(passwordRequirementMessage(), "error");
    if (shouldUseCloudAuth(email)) {
      try {
        const { account, ID } = await getAppwrite();
        await cloudLogout();
        await account.create(ID.unique(), email, password, name);
        await account.createEmailPasswordSession(email, password);
        const profile = await account.get();
        const user = await upsertCloudUser(profile, password);
        db.workspaces[user.id] = makeWorkspace(false);
        db.workspaces[user.id].settings = { dataSource: "appwrite", autosave: true, ...(db.workspaces[user.id].settings || {}) };
        await saveCloudWorkspace(user, db.workspaces[user.id]);
        await account.createVerification(cloudCallbackUrl("verify"));
        await cloudLogout();
        saveSession(null);
        ui.authScreen = "login";
        ui.verifyEmail = "";
        render();
        return flash("Account created. Check your email to verify it before logging in.", "good", false);
      } catch (error) {
        console.warn(error);
        return flash(appwriteMessage(error, "Cloud signup failed. Try again."), "error");
      }
    }
    if (db.users.some((user) => user.email === email)) return flash("An account already exists for that email.", "error");

    const userId = id("user");
    db.users.push({
      id: userId,
      name,
      email,
      passwordHash: await hash(password),
      verified: false,
      createdAt: new Date().toISOString(),
    });
    db.workspaces[userId] = makeWorkspace(false);
    createVerification(email);
    saveDb();
    ui.authScreen = "verify";
    ui.verifyEmail = email;
    flash("Verification code created. In production Appwrite will email it.", "good");
  }

  async function verifyAccount(data) {
    const email = normalizeEmail(data.email || ui.verifyEmail);
    const code = String(data.code || "").trim();
    const pending = latestPendingCode(email);
    if (!pending) return flash("No active verification code. Request a new one.", "error");
    if (new Date(pending.expiresAt) < new Date()) return flash("Verification code expired. Request a new one.", "error");
    if (pending.attempts >= 5) return flash("Too many attempts. Request a new verification code.", "error");
    pending.attempts += 1;

    if (pending.code !== code) {
      saveDb();
      return flash("Verification code is incorrect.", "error");
    }

    const user = db.users.find((item) => item.email === email);
    if (!user) return flash("Account could not be found.", "error");
    user.verified = true;
    user.updatedAt = new Date().toISOString();
    db.pendingVerifications = db.pendingVerifications.filter((item) => item.email !== email);
    saveDb();
    ui.authScreen = "login";
    ui.verifyEmail = "";
    flash("Account activated. You can log in now.", "good");
  }

  async function forgotPassword(data) {
    const email = normalizeEmail(data.email);
    if (shouldUseCloudAuth(email)) {
      try {
        const { account } = await getAppwrite();
        await account.createRecovery(email, cloudCallbackUrl("recovery"));
        ui.authScreen = "login";
        render();
        return flash("Password reset email sent. Open the secure link to choose a new password.", "good", false);
      } catch (error) {
        console.warn(error);
        return flash(appwriteMessage(error, "Could not send reset email."), "error");
      }
    }

    const user = db.users.find((item) => item.email === email);
    if (user) createPasswordReset(email);
    saveDb();
    ui.authScreen = "reset";
    ui.resetEmail = email;
    flash("If that account exists, a reset email was created.", "good");
  }

  async function resetPassword(data) {
    if (data.resetUserId && data.resetSecret) {
      const password = data.password || "";
      if (!passwordRequirementsMet(password)) return flash(passwordRequirementMessage(), "error");
      try {
        const { account } = await getAppwrite();
        await account.updateRecovery(data.resetUserId, data.resetSecret, password);
        ui.authScreen = "login";
        ui.resetUserId = "";
        ui.resetSecret = "";
        ui.resetEmail = "";
        saveSession(null);
        render();
        return flash("Password reset complete. Log in with the new password.", "good", false);
      } catch (error) {
        console.warn(error);
        return flash(appwriteMessage(error, "Password reset link is invalid or expired."), "error");
      }
    }

    const email = normalizeEmail(data.email || ui.resetEmail);
    const code = String(data.code || "").trim();
    const password = data.password || "";
    if (!passwordRequirementsMet(password)) return flash(passwordRequirementMessage(), "error");

    const pending = latestResetCode(email);
    if (!pending || new Date(pending.expiresAt) < new Date()) return flash("Reset code is invalid or expired.", "error");
    if (pending.attempts >= 5) return flash("Too many attempts. Request a new reset code.", "error");
    pending.attempts += 1;
    if (pending.code !== code) {
      saveDb();
      return flash("Reset code is incorrect.", "error");
    }

    const user = db.users.find((item) => item.email === email);
    if (!user) return flash("Reset code is invalid or expired.", "error");
    user.passwordHash = await hash(password);
    user.updatedAt = new Date().toISOString();
    const workspace = db.workspaces[user.id];
    const hadEncryptedVault = Boolean(workspace && vaultConfigured(workspace));
    if (workspace) {
      workspace.privateVault = freshPrivateVault();
      workspace.settings = { dataSource: "local", autosave: true, ...(workspace.settings || {}) };
      if (hadEncryptedVault) {
        workspace.settings.vaultResetAt = new Date().toISOString();
        logActivity(workspace, "Cleared private vault after password recovery", "vault", "Encrypted vault");
      }
    }
    db.passwordResets = db.passwordResets.filter((item) => item.email !== email);
    saveDb();
    ui.authScreen = "login";
    ui.resetEmail = "";
    saveSession(null);
    flash(hadEncryptedVault ? "Password updated. Private Vault was cleared because the old password was not available." : "Password updated. Log in with the new password.", "good");
  }

  async function saveAccountProfile(data) {
    const user = currentUser();
    if (!user) return flash("You need to be logged in to update your profile.", "error");

    const name = (data.accountName || "").trim();
    const email = normalizeEmail(data.accountEmail);
    if (!name) return flash("Name is required.", "error");
    if (!isEmail(email)) return flash("Enter a valid email address.", "error");

    const emailChanged = email !== user.email;
    if (isCloudUser(user)) {
      try {
        const { account } = await getAppwrite();
        if (name !== user.name) await account.updateName(name);
        if (emailChanged) {
          if (!data.accountCurrentPassword) return flash("Current password is required to change email.", "error");
          await account.updateEmail(email, data.accountCurrentPassword || "");
          await account.createVerification(cloudCallbackUrl("verify")).catch((error) => console.warn(error));
        }
        const profile = await account.get();
        await upsertCloudUser(profile);
        scheduleCloudSave();
        return flash(emailChanged ? "Profile saved. Check the new email for verification." : "Profile saved.", "good");
      } catch (error) {
        console.warn(error);
        return flash(appwriteMessage(error, "Could not save profile."), "error");
      }
    }

    if (emailChanged) {
      const duplicate = db.users.some((item) => item.id !== user.id && item.email === email);
      if (duplicate) return flash("Another account already uses that email.", "error");
      const currentHash = await hash(data.accountCurrentPassword || "");
      if (currentHash !== user.passwordHash) {
        return flash("Current password is required to change email.", "error");
      }
    }

    user.name = name;
    user.email = email;
    user.updatedAt = new Date().toISOString();
    saveDb();
    flash(emailChanged ? "Profile saved. In production, email changes should be re-verified." : "Profile saved.", "good");
  }

  async function saveAccountPassword(data) {
    const user = currentUser();
    if (!user) return flash("You need to be logged in to update your password.", "error");

    const nextPassword = data.passwordNew || "";
    if (!passwordRequirementsMet(nextPassword)) return flash(passwordRequirementMessage(), "error");
    if (nextPassword !== (data.passwordConfirm || "")) return flash("New password confirmation does not match.", "error");

    const currentHash = await hash(data.passwordCurrent || "");
    if (!isCloudUser(user) && currentHash !== user.passwordHash) return flash("Current password is incorrect.", "error");

    const workspace = getWorkspace(user.id);
    if (vaultConfigured(workspace)) {
      const reencrypted = await reencryptVaultForPasswordChange(workspace, data.passwordCurrent || "", nextPassword);
      if (!reencrypted) {
        return flash("Private Vault could not be re-encrypted with the current login password.", "error");
      }
    }

    if (isCloudUser(user)) {
      try {
        const { account } = await getAppwrite();
        await account.updatePassword(nextPassword, data.passwordCurrent || "");
      } catch (error) {
        console.warn(error);
        return flash(appwriteMessage(error, "Could not update password."), "error");
      }
    }

    user.passwordHash = await hash(nextPassword);
    user.updatedAt = new Date().toISOString();
    saveDb();
    flash(vaultConfigured(workspace) ? "Password reset complete. Private Vault was re-encrypted." : "Password reset complete.", "good");
  }

  function createVerification(email) {
    db.pendingVerifications = db.pendingVerifications.filter((item) => item.email !== email);
    db.pendingVerifications.push({
      email,
      code: otp(),
      attempts: 0,
      createdAt: new Date().toISOString(),
      expiresAt: minutesFromNow(OTP_TTL_MINUTES),
    });
  }

  function createPasswordReset(email) {
    db.passwordResets = db.passwordResets.filter((item) => item.email !== email);
    db.passwordResets.push({
      email,
      code: otp(),
      attempts: 0,
      createdAt: new Date().toISOString(),
      expiresAt: minutesFromNow(RESET_TTL_MINUTES),
    });
  }

  function quickCapture(data) {
    const title = (data.title || "").trim();
    if (!title) return flash("Add a title before capturing.", "error");
    const workspace = getWorkspace();
    const type = data.type || "task";
    const now = new Date().toISOString();

    if (type === "task") {
      const task = makeTask({ title, tags: ["quick-capture"] });
      workspace.tasks.push(task);
      logActivity(workspace, "Captured task", "task", task.title);
    } else {
      const schema = schemas[type];
      const item = {
        id: id(type),
        title,
        summary: "",
        body: "",
        status: schema.defaultStatus,
        tags: ["quick-capture"],
        projectId: "",
        favorite: false,
        archived: false,
        createdAt: now,
        updatedAt: now,
      };
      if (type === "research") item.question = title;
      if (type === "bookmark") item.url = "";
      if (type === "paper") item.abstract = "";
      workspace[collectionByType[type]].push(item);
      logActivity(workspace, `Captured ${schema.title.toLowerCase()}`, type, item.title);
    }

    saveDb();
    flash("Captured.", "good");
  }

  function saveDailyPlan(data) {
    const workspace = getWorkspace();
    const date = data.date || dateKey(new Date());
    let plan = workspace.dailyPlans.find((item) => item.date === date);
    const now = new Date().toISOString();
    if (!plan) {
      plan = { id: id("daily"), date, createdAt: now };
      workspace.dailyPlans.push(plan);
    }
    plan.focus = (data.focus || "").trim();
    plan.notes = (data.notes || "").trim();
    plan.review = (data.review || "").trim();
    plan.updatedAt = now;
    ui.plannerDate = date;
    logActivity(workspace, "Saved daily planner", "daily", date);
    saveDb();
    flash("Daily planner saved.", "good");
  }

  function saveTaskEditor(form, data) {
    const workspace = getWorkspace();
    const idValue = form.dataset.id;
    const now = new Date().toISOString();
    let task = idValue ? workspace.tasks.find((item) => item.id === idValue) : null;
    const creating = !task;
    if (!task) {
      task = makeTask();
      workspace.tasks.push(task);
    }

    const title = (data.title || "").trim();
    if (!title) return flash("Task title is required.", "error");

    Object.assign(task, {
      title,
      description: (data.description || "").trim(),
      status: data.status || "backlog",
      priority: data.priority || "Medium",
      dueDate: data.dueDate || "",
      projectId: data.projectId || "",
      tags: parseTags(data.tagsText),
      recurring: (data.recurring || "").trim(),
      subtasks: lines(data.subtasksText),
      attachmentNote: (data.attachmentNote || "").trim(),
      updatedAt: now,
    });

    logActivity(workspace, creating ? "Created task" : "Updated task", "task", task.title);
    closeEditor();
    saveDb();
    flash("Task saved.", "good");
  }

  function saveGenericEditor(form, data) {
    const workspace = getWorkspace();
    const type = form.dataset.editorType;
    const collection = workspace[collectionByType[type]];
    const schema = schemas[type];
    const idValue = form.dataset.id;
    const now = new Date().toISOString();
    let item = idValue ? collection.find((entry) => entry.id === idValue) : null;
    const creating = !item;
    if (!item) {
      item = {
        id: id(type),
        favorite: false,
        archived: false,
        createdAt: now,
      };
      collection.push(item);
    }

    const title = (data.title || "").trim();
    if (!title) return flash(`${schema.title} title is required.`, "error");

    Object.assign(item, data);
    item.title = title;
    item.tags = parseTags(data.tagsText);
    item.collaborators = parseTags(data.collaboratorsText);
    item.conflicts = parseTags(data.conflictsText);
    item.keywords = parseTags(data.keywordsText);
    delete item.tagsText;
    delete item.collaboratorsText;
    delete item.conflictsText;
    delete item.keywordsText;
    item.status = data.status || schema.defaultStatus;
    item.projectId = data.projectId || "";
    item.updatedAt = now;

    logActivity(workspace, `${creating ? "Created" : "Updated"} ${schema.title.toLowerCase()}`, type, item.title);
    closeEditor();
    saveDb();
    flash(`${schema.title} saved.`, "good");
  }

  async function setupVault(data) {
    const workspace = getWorkspace();
    if (vaultConfigured(workspace)) return flash("Private Vault is already configured.", "error");
    if (!cryptoAvailable()) return flash("This browser does not support Web Crypto encryption.", "error");

    const password = data.vaultPassword || "";
    if (!(await passwordMatchesCurrentUser(password))) return flash("Login password is incorrect.", "error");

    try {
      const now = new Date().toISOString();
      const salt = randomBase64(16);
      const key = await deriveVaultKey(password, salt);
      workspace.privateVault = {
        salt,
        verifier: await encryptJson(key, { kind: "daily-ops-vault", version: 1 }),
        items: [],
        createdAt: now,
        updatedAt: now,
      };
      vaultState = {
        workspaceId: session.userId,
        unlocked: true,
        key,
        items: [],
      };
      scheduleVaultAutoLock();
      logActivity(workspace, "Created private vault", "vault", "Encrypted vault");
      saveDb();
      flash("Vault auto-locks after 5 minutes.", "good");
    } catch (error) {
      flash("Could not create encrypted vault.", "error");
    }
  }

  async function unlockVault(data) {
    const workspace = getWorkspace();
    if (!vaultConfigured(workspace)) return flash("Create a Private Vault first.", "error");
    if (!cryptoAvailable()) return flash("This browser does not support Web Crypto encryption.", "error");
    if (!(await passwordMatchesCurrentUser(data.vaultPassword || ""))) return flash("Login password is incorrect.", "error");

    try {
      const key = await deriveVaultKey(data.vaultPassword || "", workspace.privateVault.salt);
      const verifier = await decryptJson(key, workspace.privateVault.verifier);
      if (verifier.kind !== "daily-ops-vault") throw new Error("Invalid vault verifier");

      const items = await Promise.all(
        workspace.privateVault.items.map(async (entry) => ({
          ...entry,
          payload: await decryptJson(key, entry.encrypted),
        }))
      );
      vaultState = {
        workspaceId: session.userId,
        unlocked: true,
        key,
        items,
      };
      scheduleVaultAutoLock();
      flash("Vault auto-locks after 5 minutes.", "good");
    } catch (error) {
      lockVault(false);
      flash("Login password is incorrect or vault data is damaged.", "error");
    }
  }

  async function reencryptVaultForPasswordChange(workspace, oldPassword, newPassword) {
    if (!vaultConfigured(workspace)) return true;
    if (!cryptoAvailable()) return false;

    try {
      const oldKey = await deriveVaultKey(oldPassword, workspace.privateVault.salt);
      const verifier = await decryptJson(oldKey, workspace.privateVault.verifier);
      if (verifier.kind !== "daily-ops-vault") throw new Error("Invalid vault verifier");

      const decryptedEntries = await Promise.all(
        workspace.privateVault.items.map(async (entry) => ({
          ...entry,
          payload: await decryptJson(oldKey, entry.encrypted),
        }))
      );

      const now = new Date().toISOString();
      const salt = randomBase64(16);
      const newKey = await deriveVaultKey(newPassword, salt);
      const encryptedItems = await Promise.all(
        decryptedEntries.map(async ({ payload, ...entry }) => ({
          ...entry,
          encrypted: await encryptJson(newKey, payload),
        }))
      );

      workspace.privateVault = {
        ...workspace.privateVault,
        salt,
        verifier: await encryptJson(newKey, { kind: "daily-ops-vault", version: 1 }),
        items: encryptedItems,
        updatedAt: now,
      };

      if (vaultUnlockedFor(workspace)) {
        vaultState = {
          workspaceId: session.userId,
          unlocked: true,
          key: newKey,
          items: decryptedEntries,
        };
        scheduleVaultAutoLock();
      }
      logActivity(workspace, "Re-encrypted private vault", "vault", "Encrypted vault");
      return true;
    } catch (error) {
      return false;
    }
  }

  async function saveVaultItem(form, data) {
    const workspace = getWorkspace();
    if (!vaultUnlockedFor(workspace)) return flash("Unlock the Private Vault first.", "error");

    const idValue = form.dataset.id;
    const now = new Date().toISOString();
    const payload = vaultPayload(data);
    if (!payload.title) return flash("Vault item title is required.", "error");

    try {
      const encrypted = await encryptJson(vaultState.key, payload);
      let entry = idValue ? workspace.privateVault.items.find((item) => item.id === idValue) : null;
      const creating = !entry;
      if (!entry) {
        entry = {
          id: id("vault"),
          encrypted,
          archived: false,
          createdAt: now,
          updatedAt: now,
        };
        workspace.privateVault.items.push(entry);
      } else {
        entry.encrypted = encrypted;
        entry.updatedAt = now;
      }

      const stateEntry = {
        ...entry,
        payload,
      };
      const existingIndex = vaultState.items.findIndex((item) => item.id === entry.id);
      if (existingIndex >= 0) {
        vaultState.items[existingIndex] = stateEntry;
      } else {
        vaultState.items.push(stateEntry);
      }

      workspace.privateVault.updatedAt = now;
      logActivity(workspace, `${creating ? "Created" : "Updated"} private vault item`, "vault", "Encrypted item");
      closeVaultEditor();
      saveDb();
      flash("Private vault item encrypted and saved.", "good");
    } catch (error) {
      flash("Could not encrypt and save the vault item.", "error");
    }
  }

  function vaultPayload(data) {
    const allFields = {
      title: (data.title || "").trim(),
      category: data.category || "Login",
      url: (data.url || "").trim(),
      username: (data.username || "").trim(),
      password: data.password || "",
      recoveryEmail: (data.recoveryEmail || "").trim(),
      bankName: (data.bankName || "").trim(),
      accountHolder: (data.accountHolder || "").trim(),
      accountType: (data.accountType || "").trim(),
      accountNumber: (data.accountNumber || "").trim(),
      routingNumber: (data.routingNumber || "").trim(),
      swiftCode: (data.swiftCode || "").trim(),
      branch: (data.branch || "").trim(),
      cardholder: (data.cardholder || "").trim(),
      cardNumber: (data.cardNumber || "").trim(),
      cardExpiry: (data.cardExpiry || "").trim(),
      cardCvv: (data.cardCvv || "").trim(),
      cardPin: (data.cardPin || "").trim(),
      documentType: (data.documentType || "").trim(),
      documentNumber: (data.documentNumber || "").trim(),
      issuedBy: (data.issuedBy || "").trim(),
      issueDate: data.issueDate || "",
      expiryDate: data.expiryDate || "",
      serviceName: (data.serviceName || "").trim(),
      apiKey: (data.apiKey || "").trim(),
      secretKey: (data.secretKey || "").trim(),
      host: (data.host || "").trim(),
      port: (data.port || "").trim(),
      sshKey: (data.sshKey || "").trim(),
      notes: (data.notes || "").trim(),
      tags: parseTags(data.tagsText),
    };
    const allowed = {
      Login: ["title", "category", "url", "username", "password", "recoveryEmail", "notes", "tags"],
      "Bank Account": ["title", "category", "bankName", "accountHolder", "accountType", "accountNumber", "routingNumber", "swiftCode", "branch", "url", "username", "password", "notes", "tags"],
      "Payment Card": ["title", "category", "cardholder", "cardNumber", "cardExpiry", "cardCvv", "cardPin", "bankName", "url", "notes", "tags"],
      Identity: ["title", "category", "documentType", "documentNumber", "issuedBy", "accountHolder", "issueDate", "expiryDate", "notes", "tags"],
      "API Key": ["title", "category", "serviceName", "url", "username", "apiKey", "secretKey", "notes", "tags"],
      Server: ["title", "category", "host", "port", "username", "password", "sshKey", "notes", "tags"],
      "Secure Note": ["title", "category", "notes", "tags"],
      Other: ["title", "category", "url", "username", "password", "accountNumber", "notes", "tags"],
    };
    const payload = {};
    (allowed[allFields.category] || allowed.Other).forEach((key) => {
      payload[key] = allFields[key];
    });
    Object.keys(payload).forEach((key) => {
      if (payload[key] === "" || (Array.isArray(payload[key]) && !payload[key].length)) delete payload[key];
    });
    return payload;
  }

  function importJson(data) {
    const workspace = getWorkspace();
    try {
      const parsed = JSON.parse(data.json || "{}");
      const required = ["tasks", "ideas", "researchItems", "prompts", "notes", "bookmarks", "projects"];
      if (!required.every((key) => Array.isArray(parsed[key]))) {
        return flash("Import failed. JSON does not look like a Daily Ops Hub workspace.", "error");
      }
      if (!confirm("Importing will replace your current workspace data in this browser. Continue?")) return;
      const user = currentUser();
      db.workspaces[user.id] = {
        ...makeWorkspace(false),
        ...parsed,
        settings: { dataSource: "local", autosave: true, ...(parsed.settings || {}) },
      };
      ensureWorkspaceShape(db.workspaces[user.id]);
      logActivity(db.workspaces[user.id], "Imported workspace backup", "workspace", "JSON backup");
      saveDb();
      flash("Workspace imported.", "good");
    } catch (error) {
      flash("Import failed. Paste valid JSON.", "error");
    }
  }

  function onClick(event) {
    const target = event.target;
    if (target.classList?.contains("modal-backdrop")) {
      closeEditor();
      closeVaultEditor();
      render();
      return;
    }
    if (target.classList?.contains("command-backdrop")) {
      ui.commandOpen = false;
      render();
      return;
    }

    const authScreen = target.closest("[data-auth-screen]");
    if (authScreen) {
      ui.authScreen = authScreen.dataset.authScreen;
      ui.message = null;
      render();
      return;
    }

    const secretToggle = target.closest("[data-toggle-secret]");
    if (secretToggle) {
      const input = secretToggle.closest(".secret-input-wrap")?.querySelector("input");
      if (!input) return;
      const revealing = input.type === "password";
      input.type = revealing ? "text" : "password";
      secretToggle.innerHTML = secretToggleContent(revealing);
      secretToggle.setAttribute("aria-pressed", String(revealing));
      return;
    }

    const routeButton = target.closest("[data-route]");
    if (routeButton) {
      ui.route = routeButton.dataset.route;
      ui.query = "";
      ui.filter = "all";
      ui.sidebarOpen = false;
      render();
      return;
    }

    const action = target.closest("[data-action]");
    if (action) {
      handleAction(action.dataset.action);
      return;
    }

    const editor = target.closest("button[data-editor-type]");
    if (editor) {
      openEditor(editor.dataset.editorType);
      return;
    }

    const commandEditor = target.closest("[data-command-editor]");
    if (commandEditor) {
      ui.commandOpen = false;
      openEditor(commandEditor.dataset.commandEditor);
      return;
    }

    const edit = target.closest("[data-edit-type]");
    if (edit) {
      ui.query = "";
      ui.route = target.closest("[data-search-route]")?.dataset.searchRoute || ui.route;
      openEditor(edit.dataset.editType, edit.dataset.id);
      return;
    }

    const archive = target.closest("[data-archive-type]");
    if (archive) {
      archiveItem(archive.dataset.archiveType, archive.dataset.id);
      return;
    }

    const favorite = target.closest("[data-toggle-favorite-type]");
    if (favorite) {
      toggleFavorite(favorite.dataset.toggleFavoriteType, favorite.dataset.id);
      return;
    }

    const editVault = target.closest("[data-edit-vault]");
    if (editVault) {
      openVaultEditor(editVault.dataset.editVault);
      return;
    }

    const archiveVault = target.closest("[data-archive-vault]");
    if (archiveVault) {
      archiveVaultItem(archiveVault.dataset.archiveVault);
      return;
    }

    const deleteVault = target.closest("[data-delete-vault]");
    if (deleteVault) {
      deleteVaultItem(deleteVault.dataset.deleteVault);
      return;
    }

    const revealVault = target.closest("[data-reveal-vault]");
    if (revealVault) {
      toggleVaultSecretVisibility(revealVault);
      return;
    }

    const copyVault = target.closest("[data-copy-vault]");
    if (copyVault) {
      copyVaultField(copyVault.dataset.copyVault, copyVault.dataset.field);
      return;
    }

    const moveTask = target.closest("[data-move-task]");
    if (moveTask) {
      moveTaskTo(moveTask.dataset.moveTask, moveTask.dataset.status);
      return;
    }

    const filter = target.closest("[data-filter]");
    if (filter) {
      ui.filter = filter.dataset.filter;
      render();
      return;
    }

    const calendarMove = target.closest("[data-calendar-move]");
    if (calendarMove) {
      moveCalendar(Number(calendarMove.dataset.calendarMove));
      return;
    }

    const copyPrompt = target.closest("[data-copy-prompt]");
    if (copyPrompt) {
      copyPromptText(copyPrompt.dataset.copyPrompt);
    }
  }

  function handleAction(action) {
    if (action === "logout") {
      if (isCloudUser()) cloudLogout();
      lockVault(false);
      saveSession(null);
      ui = { ...ui, route: "dashboard", query: "", message: null };
      render();
      return;
    }
    if (action === "demo-login") {
      demoLogin();
      return;
    }
    if (action === "toggle-theme") {
      setTheme(currentTheme() === "dark" ? "light" : "dark");
      render();
      return;
    }
    if (action === "go-dashboard") {
      ui.route = "dashboard";
      ui.query = "";
      ui.filter = "all";
      ui.sidebarOpen = false;
      render();
      return;
    }
    if (action === "toggle-sidebar") {
      if (window.matchMedia("(max-width: 1080px)").matches) {
        ui.sidebarOpen = !ui.sidebarOpen;
      } else {
        ui.sidebarCollapsed = !ui.sidebarCollapsed;
        localStorage.setItem("dailyOpsHub.sidebarCollapsed", String(ui.sidebarCollapsed));
      }
      render();
      return;
    }
    if (action === "open-sidebar") {
      ui.sidebarOpen = true;
      render();
      return;
    }
    if (action === "close-sidebar") {
      ui.sidebarOpen = false;
      render();
      return;
    }
    if (action === "open-command") {
      ui.commandOpen = true;
      render();
      return;
    }
    if (action === "close-command") {
      ui.commandOpen = false;
      render();
      return;
    }
    if (action === "close-editor") {
      closeEditor();
      render();
      return;
    }
    if (action === "new-vault-item") {
      openVaultEditor();
      return;
    }
    if (action === "close-vault-editor") {
      closeVaultEditor();
      render();
      return;
    }
    if (action === "lock-vault") {
      lockVault();
      flash("Private Vault locked.", "good");
      return;
    }
    if (action === "resend-code") {
      if (!ui.verifyEmail) return;
      createVerification(ui.verifyEmail);
      saveDb();
      flash("A new verification code was created.", "good");
      return;
    }
    if (action === "export-json") {
      exportJson();
    }
  }

  async function demoLogin() {
    const email = DEMO_EMAIL;
    let user = db.users.find((item) => item.email === email);
    if (!user) {
      user = db.users.find((item) => item.email === LEGACY_DEMO_EMAIL);
      if (user) user.email = email;
    }
    if (!user) {
      user = {
        id: id("user"),
        name: "Demo Builder",
        email,
        passwordHash: await hash(DEMO_PASSWORD),
        verified: true,
        createdAt: new Date().toISOString(),
      };
      db.users.push(user);
    }
    await ensureDemoWorkspace(user);
    saveSession({ userId: user.id, createdAt: new Date().toISOString() });
    ui.message = null;
    render();
  }

  function onInput(event) {
    if (event.target.id === "globalSearch") {
      ui.query = event.target.value;
      render();
      requestAnimationFrame(() => {
        const input = document.getElementById("globalSearch");
        if (input) {
          input.focus();
          input.setSelectionRange(ui.query.length, ui.query.length);
        }
      });
    }
    const passwordForm = event.target.closest?.('form[data-form="account-password"]');
    if (passwordForm) {
      syncPasswordRequirements(passwordForm);
    }
  }

  function onChange(event) {
    if (event.target.matches("[data-vault-category]")) {
      syncVaultCategoryForm(event.target.closest("form"));
    }
  }

  function syncVaultCategoryForm(form) {
    if (!form) return;
    const selected = form.querySelector("[data-vault-category]")?.value;
    form.querySelectorAll("[data-vault-section]").forEach((section) => {
      section.hidden = section.dataset.vaultSection !== selected;
    });
  }

  function onKeydown(event) {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      if (currentUser()) {
        ui.commandOpen = !ui.commandOpen;
        render();
      }
      return;
    }
    if (event.key === "Escape") {
      ui.commandOpen = false;
      ui.editor = null;
      ui.vaultEditor = null;
      ui.sidebarOpen = false;
      render();
    }
  }

  function onDragStart(event) {
    const card = event.target.closest("[data-task-id]");
    if (!card) return;
    event.dataTransfer.setData("text/plain", card.dataset.taskId);
    event.dataTransfer.effectAllowed = "move";
  }

  function onDragOver(event) {
    const column = event.target.closest("[data-drop-status]");
    if (!column) return;
    event.preventDefault();
    column.classList.add("drag-over");
  }

  function onDragLeave(event) {
    const column = event.target.closest("[data-drop-status]");
    if (column) column.classList.remove("drag-over");
  }

  function onDrop(event) {
    const column = event.target.closest("[data-drop-status]");
    if (!column) return;
    event.preventDefault();
    column.classList.remove("drag-over");
    const taskId = event.dataTransfer.getData("text/plain");
    if (taskId) moveTaskTo(taskId, column.dataset.dropStatus);
  }

  function openEditor(type, idValue = "") {
    ui.editor = { type, id: idValue };
    ui.commandOpen = false;
    render();
  }

  function closeEditor() {
    ui.editor = null;
  }

  function openVaultEditor(idValue = "") {
    if (!vaultUnlockedFor(getWorkspace())) {
      flash("Unlock the Private Vault first.", "error");
      return;
    }
    ui.vaultEditor = { id: idValue };
    ui.commandOpen = false;
    render();
  }

  function closeVaultEditor() {
    ui.vaultEditor = null;
  }

  function findItem(workspace, type, idValue) {
    return workspace[collectionByType[type]]?.find((item) => item.id === idValue) || null;
  }

  function archiveItem(type, idValue) {
    const workspace = getWorkspace();
    const item = findItem(workspace, type, idValue);
    if (!item) return;
    item.archived = true;
    item.updatedAt = new Date().toISOString();
    logActivity(workspace, `Archived ${type}`, type, item.title);
    saveDb();
    flash("Archived.", "good");
  }

  function toggleFavorite(type, idValue) {
    const workspace = getWorkspace();
    const item = findItem(workspace, type, idValue);
    if (!item) return;
    item.favorite = !item.favorite;
    item.updatedAt = new Date().toISOString();
    logActivity(workspace, item.favorite ? "Marked favorite" : "Removed favorite", type, item.title);
    saveDb();
    render();
  }

  function moveTaskTo(taskId, status) {
    const workspace = getWorkspace();
    const task = workspace.tasks.find((item) => item.id === taskId);
    if (!task) return;
    if (task.status === status) return;
    task.status = status;
    task.updatedAt = new Date().toISOString();
    logActivity(workspace, "Moved task", "task", `${task.title} to ${statusLabel(status)}`);
    saveDb();
    render();
  }

  function copyPromptText(idValue) {
    const workspace = getWorkspace();
    const prompt = workspace.prompts.find((item) => item.id === idValue);
    if (!prompt) return;
    copyText(prompt.body || "");
    flash("Prompt copied.", "good", false);
  }

  function archiveVaultItem(idValue) {
    const workspace = getWorkspace();
    if (!vaultUnlockedFor(workspace)) return flash("Unlock the Private Vault first.", "error");
    const entry = workspace.privateVault.items.find((item) => item.id === idValue);
    const stateEntry = vaultState.items.find((item) => item.id === idValue);
    if (!entry || !stateEntry) return;
    const now = new Date().toISOString();
    entry.archived = true;
    entry.updatedAt = now;
    stateEntry.archived = true;
    stateEntry.updatedAt = now;
    workspace.privateVault.updatedAt = now;
    logActivity(workspace, "Archived private vault item", "vault", "Encrypted item");
    saveDb();
    flash("Private vault item archived.", "good");
  }

  function deleteVaultItem(idValue) {
    const workspace = getWorkspace();
    if (!vaultUnlockedFor(workspace)) return flash("Unlock the Private Vault first.", "error");
    const entryExists = workspace.privateVault.items.some((item) => item.id === idValue);
    if (!entryExists) return;
    if (!confirm("Delete this private vault item permanently? This cannot be undone.")) return;
    workspace.privateVault.items = workspace.privateVault.items.filter((item) => item.id !== idValue);
    vaultState.items = vaultState.items.filter((item) => item.id !== idValue);
    workspace.privateVault.updatedAt = new Date().toISOString();
    logActivity(workspace, "Deleted private vault item", "vault", "Encrypted item");
    saveDb();
    flash("Private vault item deleted.", "good");
  }

  function toggleVaultSecretVisibility(button) {
    const workspace = getWorkspace();
    if (!vaultUnlockedFor(workspace)) return flash("Unlock the Private Vault first.", "error");
    const entry = vaultState.items.find((item) => item.id === button.dataset.revealVault);
    const value = entry?.payload?.[button.dataset.field];
    if (!value) return;
    const code = button.closest(".vault-secret-value")?.querySelector("code");
    if (!code) return;
    const revealing = button.dataset.revealed !== "true";
    code.textContent = revealing ? value : maskSecret(value);
    button.innerHTML = secretToggleContent(revealing, "Show");
    button.dataset.revealed = String(revealing);
    button.setAttribute("aria-pressed", String(revealing));
  }

  function copyVaultField(idValue, fieldName) {
    const workspace = getWorkspace();
    if (!vaultUnlockedFor(workspace)) return flash("Unlock the Private Vault first.", "error");
    const entry = vaultState.items.find((item) => item.id === idValue);
    const value = entry?.payload?.[fieldName];
    if (!value) return flash("Nothing to copy.", "error");
    copyText(value);
    flash(`${vaultFieldLabel(fieldName)} copied.`, "good", false);
  }

  function copyText(value) {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(value);
      return;
    }
    const textareaEl = document.createElement("textarea");
    textareaEl.value = value;
    document.body.appendChild(textareaEl);
    textareaEl.select();
    document.execCommand("copy");
    textareaEl.remove();
  }

  function moveCalendar(delta) {
    const [year, month] = ui.calendarMonth.split("-").map(Number);
    const next = new Date(year, month - 1 + delta, 1);
    ui.calendarMonth = monthKey(next);
    render();
  }

  function exportJson() {
    const workspace = getWorkspace();
    const data = JSON.stringify(workspace, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `daily-ops-hub-${dateKey(new Date())}.json`;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  function searchAll(workspace, query) {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    const result = [];
    const add = (type, label, route, item, previewFields) => {
      const haystack = [item.title, ...previewFields.map((fieldName) => item[fieldName]), ...(item.tags || [])]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      if (haystack.includes(q)) {
        result.push({
          type,
          label,
          route,
          id: item.id,
          title: item.title,
          preview: previewFields.map((fieldName) => item[fieldName]).filter(Boolean).join(" "),
          updatedAt: item.updatedAt || item.createdAt,
        });
      }
    };

    workspace.tasks.filter((item) => !item.archived).forEach((item) => add("task", "Task", "tasks", item, ["description", "priority", "dueDate"]));
    workspace.ideas.filter((item) => !item.archived).forEach((item) => add("idea", "Business Idea", "ideas", item, ["summary", "body", "status"]));
    workspace.researchItems.filter((item) => !item.archived).forEach((item) => add("research", "Research Idea", "research", item, ["question", "hypothesis", "summary", "body", "sources"]));
    workspace.prompts.filter((item) => !item.archived).forEach((item) => add("prompt", "Saved Prompt", "prompts", item, ["summary", "body", "category", "model"]));
    workspace.papers
      .filter((item) => !item.archived)
      .forEach((item) =>
        add("paper", "Submitted Paper", "papers", item, [
          "abstract",
          "venue",
          "paperType",
          "status",
          "overleafLink",
          "submissionUrl",
          "artifactLink",
          "doi",
          "arxivLink",
          "collaborators",
          "correspondingAuthor",
          "blindReview",
          "conflicts",
          "revisionNotes",
          "keywords",
          "body",
        ])
      );
    workspace.notes.filter((item) => !item.archived).forEach((item) => add("note", "Knowledge Note", "notes", item, ["summary", "body", "language"]));
    workspace.bookmarks.filter((item) => !item.archived).forEach((item) => add("bookmark", "Bookmark", "bookmarks", item, ["summary", "body", "url"]));
    workspace.projects.filter((item) => !item.archived).forEach((item) => add("project", "Project", "projects", item, ["summary", "body", "status"]));
    return result.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  }

  function computeStats(workspace) {
    const today = dateKey(new Date());
    return {
      openTasks: workspace.tasks.filter((task) => !task.archived && task.status !== "done").length,
      doneToday: workspace.tasks.filter((task) => !task.archived && task.status === "done" && dateKey(new Date(task.updatedAt)) === today).length,
      overdue: workspace.tasks.filter((task) => !task.archived && task.status !== "done" && task.dueDate && task.dueDate < today).length,
      ideas: workspace.ideas.filter((item) => !item.archived).length + workspace.researchItems.filter((item) => !item.archived).length,
      papers: workspace.papers.filter((item) => !item.archived).length,
      activePapers: workspace.papers.filter(
        (item) => !item.archived && !["Accepted", "Rejected", "Withdrawn", "Published", "Archived"].includes(item.status)
      ).length,
      assets:
        workspace.prompts.filter((item) => !item.archived).length +
        workspace.notes.filter((item) => !item.archived).length +
        workspace.bookmarks.filter((item) => !item.archived).length,
    };
  }

  function collectTags(workspace) {
    const counts = new Map();
    Object.values(collectionByType).forEach((key) => {
      workspace[key]?.forEach((item) => {
        (item.tags || []).forEach((tag) => counts.set(tag, (counts.get(tag) || 0) + 1));
      });
    });
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }

  function logActivity(workspace, action, entityType, entityTitle) {
    workspace.activityLogs.unshift({
      id: id("activity"),
      action,
      entityType,
      entityTitle,
      createdAt: new Date().toISOString(),
    });
    workspace.activityLogs = workspace.activityLogs.slice(0, 300);
  }

  function recentActivity(workspace, count) {
    return workspace.activityLogs.length
      ? workspace.activityLogs.slice(0, count).map(renderActivity).join("")
      : `<div class="empty-state">No activity yet.</div>`;
  }

  function renderActivity(item) {
    return `
      <div class="timeline-item">
        <strong>${esc(item.action)}: ${esc(item.entityTitle)}</strong>
        <span>${esc(item.entityType)} · ${formatDateTime(item.createdAt)}</span>
      </div>
    `;
  }

  function icon(name, extraClass = "") {
    const classes = ["ui-icon", extraClass].filter(Boolean).join(" ");
    return `<svg class="${classes}" aria-hidden="true" viewBox="0 0 24 24">${iconSvgs[name] || iconSvgs.file}</svg>`;
  }

  function iconLabel(name, label) {
    return `${icon(name)}<span>${esc(label)}</span>`;
  }

  function iconOnly(name, label) {
    return `${icon(name)}<span class="sr-only">${esc(label)}</span>`;
  }

  function themeIconOnly() {
    return iconOnly(currentTheme() === "dark" ? "sun" : "moon", "Toggle theme");
  }

  function secretToggleContent(revealing, revealWord = "View") {
    return iconOnly(revealing ? "eye-off" : "eye", revealing ? "Hide" : revealWord);
  }

  function pageHead(title, description, actions = "") {
    return `
      <section class="page-head">
        <div>
          <h1>${title}</h1>
          <p>${description}</p>
        </div>
        <div class="row-actions">${actions}</div>
      </section>
    `;
  }

  function field(name, label, type, value = "", required = false, hint = "") {
    const input = `<input id="${esc(name)}" name="${esc(name)}" type="${esc(type)}" value="${esc(value)}" ${required ? "required" : ""} />`;
    return `
      <div class="field">
        <label for="${esc(name)}">${esc(label)}</label>
        ${type === "password" ? `<div class="secret-input-wrap">${input}<button class="mini-btn secret-toggle" type="button" data-toggle-secret>${secretToggleContent(false)}</button></div>` : input}
        ${hint ? `<span class="hint">${esc(hint)}</span>` : ""}
      </div>
    `;
  }

  function textarea(name, label, value = "", required = false) {
    return `
      <div class="field">
        <label for="${esc(name)}">${esc(label)}</label>
        <textarea id="${esc(name)}" name="${esc(name)}" ${required ? "required" : ""}>${esc(value)}</textarea>
      </div>
    `;
  }

  function selectField(name, label, options, value) {
    return `
      <div class="field">
        <label for="${esc(name)}">${esc(label)}</label>
        <select id="${esc(name)}" name="${esc(name)}">
          ${options.map(([optionValue, optionLabel]) => `<option value="${esc(optionValue)}" ${optionValue === value ? "selected" : ""}>${esc(optionLabel)}</option>`).join("")}
        </select>
      </div>
    `;
  }

  function vaultCategories() {
    return ["Login", "Bank Account", "Payment Card", "Identity", "API Key", "Server", "Secure Note", "Other"];
  }

  function vaultCategoryField(value) {
    return `
      <div class="field">
        <label for="category">Category</label>
        <select id="category" name="category" data-vault-category>
          ${vaultCategories().map((category) => `<option value="${esc(category)}" ${category === value ? "selected" : ""}>${esc(category)}</option>`).join("")}
        </select>
      </div>
    `;
  }

  function vaultSection(activeCategory, category, content) {
    return `
      <section class="vault-form-section" data-vault-section="${esc(category)}" ${activeCategory === category ? "" : "hidden"}>
        ${content}
      </section>
    `;
  }

  function vaultField(name, label, type, value = "", required = false, hint = "", autocomplete = "off") {
    const input = `<input id="${esc(name)}" name="${esc(name)}" type="${esc(type)}" value="${esc(value)}" autocomplete="${esc(autocomplete)}" autocapitalize="off" spellcheck="false" ${required ? "required" : ""} />`;
    return `
      <div class="field">
        <label for="${esc(name)}">${esc(label)}</label>
        ${type === "password" ? `<div class="secret-input-wrap">${input}<button class="mini-btn secret-toggle" type="button" data-toggle-secret>${secretToggleContent(false)}</button></div>` : input}
        ${hint ? `<span class="hint">${esc(hint)}</span>` : ""}
      </div>
    `;
  }

  function vaultTextarea(name, label, value = "", required = false) {
    return `
      <div class="field">
        <label for="${esc(name)}">${esc(label)}</label>
        <textarea id="${esc(name)}" name="${esc(name)}" autocomplete="off" autocapitalize="off" spellcheck="false" ${required ? "required" : ""}>${esc(value)}</textarea>
      </div>
    `;
  }

  function projectField(workspace, value) {
    const options = [["", "No project"]].concat(
      workspace.projects.filter((project) => !project.archived).map((project) => [project.id, project.title])
    );
    return selectField("projectId", "Project", options, value);
  }

  function renderTags(tags = []) {
    if (!tags.length) return "";
    return `<div class="tag-row">${tags.map((tag) => `<span class="pill">#${esc(tag)}</span>`).join("")}</div>`;
  }

  function notice() {
    return "";
  }

  function devMail(title, code, expiresAt) {
    return `
      <div class="dev-mail">
        <strong>${esc(title)}</strong>
        <span class="hint">Local development cannot send real email. Appwrite will handle this in the free cloud build.</span>
        <div class="dev-code">${esc(code)}</div>
        <div class="hint">Expires ${formatDateTime(expiresAt)}</div>
      </div>
    `;
  }

  function flash(text, type = "good", shouldRender = true) {
    if (messageTimer) clearTimeout(messageTimer);
    ui.message = null;
    if (shouldRender) render();
    showToast(text, type);
    messageTimer = setTimeout(() => {
      clearToast();
      messageTimer = null;
    }, 5000);
  }

  function showToast(text, type = "good") {
    clearToast();
    const toast = document.createElement("div");
    toast.className = `message toast-message ${type}`;
    toast.setAttribute("role", type === "error" ? "alert" : "status");
    toast.textContent = text;
    document.body.appendChild(toast);
  }

  function clearToast() {
    document.querySelector(".toast-message")?.remove();
  }

  function collectionDescription(type) {
    const descriptions = {
      idea: "Scratch, validate, and mature business ideas by date, status, project, and tags.",
      research: "Capture research questions, hypotheses, sources, confidence, and next actions.",
      prompt: "Keep reusable AI prompts with variables, categories, version notes, and a copy action.",
      paper:
        "Track papers from idea and drafting through submission, review, revision, acceptance, rejection, publication, and resubmission planning.",
      note: "Store snippets, debug findings, architecture notes, commands, and technical references.",
      bookmark: "Track articles, docs, repositories, tools, and videos you plan to read or revisit.",
      project: "Group tasks, ideas, research, prompts, notes, and links into durable workspaces.",
    };
    return descriptions[type] || "";
  }

  function latestPendingCode(email) {
    return db.pendingVerifications
      .filter((item) => item.email === normalizeEmail(email))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
  }

  function latestResetCode(email) {
    return db.passwordResets
      .filter((item) => item.email === normalizeEmail(email))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
  }

  function currentTheme() {
    return document.documentElement.dataset.theme || "light";
  }

  function normalizeEmail(email) {
    return String(email || "").trim().toLowerCase();
  }

  function isEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  async function passwordMatchesCurrentUser(password) {
    const user = currentUser();
    return Boolean(user && (await hash(password || "")) === user.passwordHash);
  }

  function vaultConfigured(workspace) {
    return Boolean(workspace?.privateVault?.salt && workspace?.privateVault?.verifier);
  }

  function vaultUnlockedFor(workspace) {
    return Boolean(vaultState.unlocked && vaultState.workspaceId === session?.userId && workspace?.privateVault);
  }

  function cryptoAvailable() {
    return Boolean(window.crypto?.subtle && window.crypto?.getRandomValues);
  }

  function scheduleVaultAutoLock() {
    if (!vaultState.unlocked) return;
    if (vaultLockTimer) clearTimeout(vaultLockTimer);
    vaultLockTimer = setTimeout(() => {
      lockVault(false);
      flash("Private Vault auto-locked.", "good");
    }, VAULT_AUTO_LOCK_MS);
  }

  function lockVault(shouldRender = true) {
    if (vaultLockTimer) clearTimeout(vaultLockTimer);
    vaultLockTimer = null;
    vaultState = {
      workspaceId: null,
      unlocked: false,
      key: null,
      items: [],
    };
    ui.vaultEditor = null;
    if (shouldRender) render();
  }

  async function deriveVaultKey(passphrase, saltBase64) {
    const encoder = new TextEncoder();
    const baseKey = await crypto.subtle.importKey("raw", encoder.encode(passphrase), "PBKDF2", false, ["deriveKey"]);
    return crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: base64ToBytes(saltBase64),
        iterations: VAULT_KDF_ITERATIONS,
        hash: "SHA-256",
      },
      baseKey,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt", "decrypt"]
    );
  }

  async function encryptJson(key, value) {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encoded = new TextEncoder().encode(JSON.stringify(value));
    const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, encoded);
    return {
      alg: "AES-GCM",
      iv: bytesToBase64(iv),
      data: bytesToBase64(new Uint8Array(encrypted)),
    };
  }

  async function decryptJson(key, encrypted) {
    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: base64ToBytes(encrypted.iv) },
      key,
      base64ToBytes(encrypted.data)
    );
    return JSON.parse(new TextDecoder().decode(decrypted));
  }

  function randomBase64(length) {
    return bytesToBase64(crypto.getRandomValues(new Uint8Array(length)));
  }

  function bytesToBase64(bytes) {
    let binary = "";
    bytes.forEach((byte) => {
      binary += String.fromCharCode(byte);
    });
    return btoa(binary);
  }

  function base64ToBytes(value) {
    const binary = atob(value);
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) {
      bytes[index] = binary.charCodeAt(index);
    }
    return bytes;
  }

  function maskSecret(value, visible = 4) {
    const text = String(value || "").replace(/\s+/g, "");
    if (!text) return "";
    if (text.length <= visible) return "••••";
    return `•••• ${text.slice(-visible)}`;
  }

  function vaultFieldLabel(fieldName) {
    const labels = {
      username: "Username",
      password: "Password",
      accountNumber: "Account number",
      routingNumber: "Routing number",
      cardNumber: "Card number",
      cardCvv: "CVV",
      cardPin: "Card PIN",
      documentNumber: "Document number",
      apiKey: "API key",
      secretKey: "Secret key",
      sshKey: "SSH key",
    };
    return labels[fieldName] || "Vault field";
  }

  function otp() {
    return String(Math.floor(100000 + Math.random() * 900000));
  }

  function id(prefix) {
    return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
  }

  function minutesFromNow(minutes) {
    return new Date(Date.now() + minutes * 60 * 1000).toISOString();
  }

  function dateKey(date) {
    const value = date instanceof Date ? date : new Date(date);
    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, "0");
    const day = String(value.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function monthKey(date) {
    const value = date instanceof Date ? date : new Date(date);
    return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, "0")}`;
  }

  function addDays(days) {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return dateKey(date);
  }

  function daysSince(value) {
    return Math.floor((Date.now() - new Date(value).getTime()) / 86400000);
  }

  function formatDate(value) {
    if (!value) return "";
    return new Date(`${String(value).slice(0, 10)}T12:00:00`).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  function formatDateTime(value) {
    if (!value) return "";
    return new Date(value).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }

  function parseTags(value) {
    return [...new Set(String(value || "").split(",").map((tag) => tag.trim().replace(/^#/, "")).filter(Boolean))];
  }

  function lines(value) {
    return String(value || "")
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
  }

  function trim(value, max) {
    const text = String(value || "");
    if (text.length <= max) return text;
    return `${text.slice(0, max - 3)}...`;
  }

  function statusLabel(status) {
    return taskStatuses.find(([value]) => value === status)?.[1] || status;
  }

  function esc(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  async function hash(value) {
    if (window.crypto?.subtle) {
      const encoded = new TextEncoder().encode(value);
      const digest = await window.crypto.subtle.digest("SHA-256", encoded);
      return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
    }
    let output = 0;
    for (let index = 0; index < value.length; index += 1) {
      output = (output << 5) - output + value.charCodeAt(index);
      output |= 0;
    }
    return `fallback-${output}`;
  }
})();
