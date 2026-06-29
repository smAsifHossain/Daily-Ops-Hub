# Appwrite Free Deployment Plan

This app is designed to move to Appwrite Cloud Free without changing the product shape.

## Recommended Free Architecture

- Frontend hosting: Appwrite Sites
- Authentication: Appwrite Auth
- Email verification: Appwrite Email OTP
- Password reset: Appwrite email/password recovery
- Database: Appwrite Databases
- File attachments: Appwrite Storage
- Realtime board updates: Appwrite Realtime
- Optional server work: Appwrite Functions

## Appwrite Project Setup

1. Create an Appwrite Cloud project.
2. Add a Web platform with the deployed site domain.
3. Enable Auth methods:
   - Email/password
   - Email OTP
4. Create one database named `daily_ops`.
5. Create the collections listed in `schema.md`.
6. Create one storage bucket named `attachments`.
7. Deploy the static frontend to Appwrite Sites.
8. Replace local auth/store functions with Appwrite adapters.

## Environment Values Needed Later

The production client will need:

```text
APPWRITE_ENDPOINT=https://nyc.cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=6a41f0a600372166cc8a
APPWRITE_DATABASE_ID=daily_ops
APPWRITE_BUCKET_ID=attachments
```

For a Vite/React conversion, these would usually become:

```text
VITE_APPWRITE_ENDPOINT=
VITE_APPWRITE_PROJECT_ID=
VITE_APPWRITE_DATABASE_ID=
VITE_APPWRITE_BUCKET_ID=
```

## Auth Mapping

Current local flow:

- Signup creates an inactive local user.
- A 6-digit verification code is generated.
- User enters the code to activate the account.
- Login works after activation.
- Forgot password creates a reset code.

Production Appwrite flow:

- Use Email OTP to verify ownership of the email address.
- After verification, create or update the account with email/password.
- Use Appwrite password recovery for forgot password.
- Store profile data in `users_profile`.

## Free-Tier Guardrails

To keep the app healthy on a free plan:

- Paginate lists once a user has more than 100 items per collection.
- Keep activity logs capped, for example latest 300 entries per user.
- Compress large exports client-side or keep them as downloads only.
- Store attachments in Appwrite Storage and metadata in the database.
- Avoid writing analytics events for every keystroke.
- Debounce autosave writes to 800-1500 ms.
- Keep recurring task generation client-triggered or inside one scheduled function.

## First Appwrite Migration Tasks

1. Add the Web platform for `smasifhossain.github.io`.
2. Create a temporary Appwrite API key for setup only.
3. Run `node scripts/setup-appwrite.mjs` with the endpoint, project ID, and API key in environment variables.
4. Replace local signup/login/reset with Appwrite Auth calls.
5. Store each user workspace as a private Appwrite document first, then split into feature-level collections later if needed.
6. Add attachment upload to the `attachments` bucket.
7. Add pagination and query filters when documents are split per feature.
8. Keep GitHub Pages as the free frontend host.

## One-Time Backend Setup Script

The repository includes `scripts/setup-appwrite.mjs`. It creates:

- Database: `daily_ops`
- Collection: `workspaces`
- Storage bucket: `attachments`

The first production backend can store a user's full workspace JSON in one private document.
This is simpler and safer for the first live version because the existing app is already
local-first. Later, we can migrate the JSON payload into separate `tasks`, `ideas`, `papers`,
`prompts`, and `private_vault` collections for deeper querying.

Run from the project folder after creating a temporary API key:

```powershell
$env:APPWRITE_ENDPOINT="https://nyc.cloud.appwrite.io/v1"
$env:APPWRITE_PROJECT_ID="6a41f0a600372166cc8a"
$env:APPWRITE_API_KEY="paste-temporary-api-key-here"
node scripts/setup-appwrite.mjs
Remove-Item Env:APPWRITE_API_KEY
```

Never commit the API key. It is only for backend setup from your machine.
