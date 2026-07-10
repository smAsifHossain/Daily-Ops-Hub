# Daily Digest Function

This Appwrite Function sends the Daily Ops Hub 8 AM email digest.

## What It Sends

- Tasks left today
- Tasks due this week
- Overdue task count
- Business idea focus items for today and this week
- Research idea focus items for today and this week
- Submitted paper focus items, deadlines, and decision dates

Private Vault data is intentionally excluded.

## Appwrite Settings

Create an Appwrite Function with:

```text
Runtime: Node.js
Root directory: functions/daily-digest
Entrypoint: src/main.js
Build command: npm install
Schedule: 0 * * * *
```

The hourly schedule lets the function respect each user's saved timezone and still send at that user's local 8:00 AM.

Required function scopes:

```text
databases.read
databases.write
messaging.write
```

Required environment variables:

```text
DAILY_OPS_DATABASE_ID=daily_ops
DAILY_OPS_WORKSPACE_COLLECTION_ID=workspaces
DAILY_OPS_APP_URL=https://smasifhossain.github.io/Daily-Ops-Hub/
DAILY_DIGEST_TIME=08:00
DAILY_DIGEST_DEFAULT_TIMEZONE=America/Chicago
```

Appwrite injects the project ID and dynamic function API key at runtime.

## Email Provider

Configure an Appwrite Messaging email provider before enabling this function in production. SMTP, SendGrid, Mailgun, or Resend can be used depending on the provider available in your Appwrite project and free-tier preference.

## Test

Run a dry test execution from the function URL:

```text
?force=1&dryRun=1
```

Send a real forced digest:

```text
?force=1
```
