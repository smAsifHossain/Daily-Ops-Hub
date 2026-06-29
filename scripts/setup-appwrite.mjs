const config = {
  endpoint: cleanEnv("APPWRITE_ENDPOINT") || "https://nyc.cloud.appwrite.io/v1",
  projectId: cleanEnv("APPWRITE_PROJECT_ID") || "6a41f0a600372166cc8a",
  apiKey: cleanEnv("APPWRITE_API_KEY"),
  databaseId: cleanEnv("APPWRITE_DATABASE_ID") || "daily_ops",
  workspaceCollectionId: cleanEnv("APPWRITE_WORKSPACE_COLLECTION_ID") || "workspaces",
  bucketId: cleanEnv("APPWRITE_BUCKET_ID") || "attachments",
};

if (!config.apiKey) {
  console.error("Missing APPWRITE_API_KEY.");
  console.error("Create a temporary Appwrite API key, set APPWRITE_API_KEY, run this script, then delete or rotate the key.");
  process.exit(1);
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});

async function main() {
  console.log(`Using Appwrite project ${config.projectId}`);
  await ensureDatabase();
  await ensureWorkspaceCollection();
  await ensureBucket();
  console.log("Appwrite backend setup complete.");
}

async function ensureDatabase() {
  const database = await request("GET", `/databases/${config.databaseId}`, null, { allow404: true });
  if (database) {
    console.log(`Database exists: ${config.databaseId}`);
    return database;
  }

  const created = await request("POST", "/databases", {
    databaseId: config.databaseId,
    name: "Daily Ops Hub",
    enabled: true,
  });
  console.log(`Database created: ${created.$id}`);
  return created;
}

async function ensureWorkspaceCollection() {
  const collectionPath = `/databases/${config.databaseId}/collections/${config.workspaceCollectionId}`;
  const collection = await request("GET", collectionPath, null, { allow404: true });
  if (collection) {
    console.log(`Collection exists: ${config.workspaceCollectionId}`);
  } else {
    const created = await request("POST", `/databases/${config.databaseId}/collections`, {
      collectionId: config.workspaceCollectionId,
      name: "User Workspaces",
      permissions: ['create("users")'],
      documentSecurity: true,
      enabled: true,
    });
    console.log(`Collection created: ${created.$id}`);
  }

  await ensureStringAttribute("userId", 128, true);
  await ensureStringAttribute("email", 320, false);
  await ensureStringAttribute("schemaVersion", 64, false);
  await ensureStringAttribute("payload", 1000000, true);
  await ensureDatetimeAttribute("createdAt", false);
  await ensureDatetimeAttribute("updatedAt", false);
  await ensureIndex("userId_idx", "key", ["userId"]);
}

async function ensureStringAttribute(key, size, required) {
  const path = `/databases/${config.databaseId}/collections/${config.workspaceCollectionId}/attributes/${key}`;
  const existing = await request("GET", path, null, { allow404: true });
  if (existing) {
    console.log(`Attribute exists: ${key}`);
    return existing;
  }

  const created = await request("POST", `/databases/${config.databaseId}/collections/${config.workspaceCollectionId}/attributes/string`, {
    key,
    size,
    required,
    array: false,
    encrypt: false,
  });
  console.log(`Attribute queued: ${created.key}`);
  await sleep(1000);
  return created;
}

async function ensureDatetimeAttribute(key, required) {
  const path = `/databases/${config.databaseId}/collections/${config.workspaceCollectionId}/attributes/${key}`;
  const existing = await request("GET", path, null, { allow404: true });
  if (existing) {
    console.log(`Attribute exists: ${key}`);
    return existing;
  }

  const created = await request("POST", `/databases/${config.databaseId}/collections/${config.workspaceCollectionId}/attributes/datetime`, {
    key,
    required,
    array: false,
  });
  console.log(`Attribute queued: ${created.key}`);
  await sleep(1000);
  return created;
}

async function ensureIndex(key, type, attributes) {
  await waitForAttributes(attributes);
  const path = `/databases/${config.databaseId}/collections/${config.workspaceCollectionId}/indexes/${key}`;
  const existing = await request("GET", path, null, { allow404: true });
  if (existing) {
    console.log(`Index exists: ${key}`);
    return existing;
  }

  const created = await request("POST", `/databases/${config.databaseId}/collections/${config.workspaceCollectionId}/indexes`, {
    key,
    type,
    attributes,
    orders: attributes.map(() => "ASC"),
  });
  console.log(`Index queued: ${created.key}`);
  return created;
}

async function waitForAttributes(keys) {
  for (let attempt = 1; attempt <= 20; attempt += 1) {
    const attributes = await request(
      "GET",
      `/databases/${config.databaseId}/collections/${config.workspaceCollectionId}/attributes`
    );
    const ready = keys.every((key) =>
      attributes.attributes?.some((attribute) => attribute.key === key && attribute.status === "available")
    );
    if (ready) return;
    await sleep(1500);
  }
  throw new Error(`Timed out waiting for attributes: ${keys.join(", ")}`);
}

async function ensureBucket() {
  const bucket = await request("GET", `/storage/buckets/${config.bucketId}`, null, { allow404: true });
  if (bucket) {
    console.log(`Storage bucket exists: ${config.bucketId}`);
    return bucket;
  }

  const created = await request("POST", "/storage/buckets", {
    bucketId: config.bucketId,
    name: "Attachments",
    permissions: ['create("users")'],
    fileSecurity: true,
    enabled: true,
    maximumFileSize: 10485760,
    allowedFileExtensions: [],
    compression: "none",
    encryption: true,
    antivirus: true,
  });
  console.log(`Storage bucket created: ${created.$id}`);
  return created;
}

async function request(method, path, body, options = {}) {
  const response = await fetch(`${config.endpoint}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      "X-Appwrite-Project": config.projectId,
      "X-Appwrite-Key": config.apiKey,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const raw = await response.text();
  const data = raw ? parseJson(raw) : null;

  if (response.status === 404 && options.allow404) return null;
  if (!response.ok) {
    const message = data?.message || raw || response.statusText;
    throw new Error(`${method} ${path} failed with ${response.status}: ${message}`);
  }
  return data;
}

function parseJson(raw) {
  try {
    return JSON.parse(raw);
  } catch {
    return { raw };
  }
}

function cleanEnv(name) {
  return process.env[name]?.trim();
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
