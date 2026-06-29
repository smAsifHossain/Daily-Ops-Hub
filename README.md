# Daily Ops Hub

A dependency-free starter build for a daily operations app aimed at tech-minded users.

Open `index.html` in a browser to run the current build. The app persists data in browser
`localStorage`, so it is usable immediately without installing packages or creating cloud
credentials first.

## Current Build

Implemented:

- Login, signup, email verification code flow, forgot password, and reset code flow.
- Local development email preview for verification and reset codes.
- Light and dark mode.
- Dashboard with quick capture, daily summary, stats, recent activity, and Kanban board.
- Task board with Backlog, In Progress, Done, drag-and-drop, mobile move buttons, priority,
  due date, tags, projects, recurring text, subtasks, and attachment notes.
- Business Ideas page.
- Research Ideas page.
- Saved Prompts page with copy action.
- Submitted Papers page for paper pipeline tracking, venues, deadlines, Overleaf links,
  collaborators, blind-review notes, conflicts, submissions, decisions, and revisions.
- Private Vault page for encrypted login, bank, payment-card, identity, and secure-note
  records using Web Crypto AES-GCM with a login-password-derived key.
- Knowledge Notes page.
- Reading Queue / Bookmarks page.
- Daily Planner page.
- Calendar page.
- Project Spaces page.
- Activity Timeline.
- Analytics.
- Global search.
- Command palette with `Ctrl+K`.
- JSON export and import.
- User-scoped local persistence.

## Private Vault Security Notes

- Vault entries are encrypted before being saved to browser `localStorage`.
- The vault uses the same password as account login. The plaintext password is not stored.
- Decrypted vault contents are kept only in memory while unlocked and auto-lock after inactivity.
- Vault item titles and secret fields are excluded from global search and activity logs.
- CVV/PIN fields exist for personal records, but storing them is risky and may violate
  payment-processing rules. Do not store seed phrases, recovery codes, or one-time codes.
- Normal password changes re-encrypt the vault. Forgot-password recovery resets the vault
  because the old password is not available for decryption.

## Demo Account

Use the built-in demo account for deployment previews:

```text
Email: demo@gmail.com
Password: demo@gmail.com
```

The demo workspace refreshes to a deployment-ready sample set for this build. It includes
tasks, daily plans, business ideas, research ideas, saved prompts, submitted papers, notes,
bookmarks, projects, activity, analytics examples, and fake encrypted Private Vault records.
Unlock the demo vault with the same `demo@gmail.com` login password.

## Development Account Flow

Because this first version is a browser-only starter, it cannot send real email by itself.
When you sign up or request password reset, the generated code appears in a development email
preview panel.

The production version should use Appwrite Auth for email OTP, email/password login, and
password recovery.

## Free Deployment Notes

- GitHub Pages can host this build for free and the app will work in the browser.
- On GitHub Pages, data is saved in that browser's `localStorage`; it is not server-side,
  cross-device, or shared between users.
- Real email verification, password-reset email, cloud database persistence, storage, and
  per-user permissions require the planned Appwrite Cloud Free migration.
- Appwrite project values for this deployment:
  - Endpoint: `https://nyc.cloud.appwrite.io/v1`
  - Project ID: `6a41f0a600372166cc8a`
  - Web platform hostname: `smasifhossain.github.io`
- For local testing of encrypted vault data, run through `localhost` or HTTPS so Web Crypto
  is available in all modern browsers.

## Appwrite Backend Setup

Create a temporary Appwrite API key, set it as an environment variable, then run:

```powershell
$env:APPWRITE_ENDPOINT="https://nyc.cloud.appwrite.io/v1"
$env:APPWRITE_PROJECT_ID="6a41f0a600372166cc8a"
$env:APPWRITE_API_KEY="paste-temporary-api-key-here"
node scripts/setup-appwrite.mjs
Remove-Item Env:APPWRITE_API_KEY
```

The setup script creates the `daily_ops` database, a private `workspaces` collection, and
an `attachments` bucket. Do not put the API key in frontend code or commit it to GitHub.

## Files

- `index.html`: browser entry point.
- `styles.css`: full responsive UI system.
- `app.js`: application logic, local data store, auth simulation, feature pages.
- `scripts/setup-appwrite.mjs`: one-time Appwrite database and storage setup.
- `docs/appwrite-free-deployment.md`: free cloud deployment path.
- `docs/schema.md`: collection model for Appwrite migration.

## Next Development Step

The right next engineering step is to split `app.js` into modules:

- `storage/localStore.js`
- `storage/appwriteStore.js`
- `auth/localAuth.js`
- `auth/appwriteAuth.js`
- `ui/renderers/*`
- `domain/tasks.js`
- `domain/libraryItems.js`

After that, add the Appwrite SDK and switch persistence behind a repository adapter.

## Submitted Paper Edge Cases Covered

- Papers can be tracked before submission, after submission, during review, in revision,
  after acceptance, after rejection, after withdrawal, and after publication.
- Venue can represent either the planned venue or the venue already submitted to.
- Deadline, submitted date, and decision/notification date are separate calendar events.
- Collaborators, conflicts of interest, and keywords are stored as structured lists.
- Overleaf, submission portal, artifact/code, preprint, DOI, and arXiv fields are separate.
- Blind-review notes are tracked so author names, acknowledgements, and conflicts are not
  forgotten before anonymous submission.
- Existing local workspaces created before this feature are migrated automatically.
