# Daily Ops Hub

A modern daily operations workspace for tech-minded users. Daily Ops Hub combines a Jira-style Kanban board, idea vaults, research notes, saved prompts, submitted paper tracking, daily planning, analytics, and a client-side encrypted private vault in one deployable web app.

The current production build is a static JavaScript frontend hosted on GitHub Pages with Appwrite Cloud used for real authentication, email verification/password recovery, and cloud workspace persistence for personal accounts.

Live app: <https://smasifhossain.github.io/Daily-Ops-Hub/>

## Repository Layout

```text
.
|-- assets/                         # App logo and browser favicon
|-- docs/                           # Appwrite deployment notes and data schema
|-- scripts/                        # One-time backend setup utilities
|-- .github/workflows/pages.yml     # GitHub Pages deployment workflow
|-- .gitignore                      # Local secret and generated-file exclusions
|-- .nojekyll                       # Prevent GitHub Pages from applying Jekyll
|-- app.js                          # Application logic, UI rendering, auth, and persistence
|-- index.html                      # Static app entry point
|-- styles.css                      # Responsive UI system and theme styles
|-- How to run.txt                  # Short local run note
`-- README.md                       # Project overview and workflows
```

## Product Features

- Email/password signup and login through Appwrite for personal accounts.
- Email verification and password recovery through Appwrite email links.
- Demo account for public previews without requiring a real backend account.
- Light and dark mode.
- Dashboard with quick capture, daily summary, stats, recent activity, and Kanban overview.
- Kanban task board with Backlog, In Progress, and Done columns.
- Drag-and-drop task movement plus mobile-safe move controls.
- Business Ideas, Research Ideas, and Saved Prompts workspaces.
- Submitted Papers tracker for venues, submission states, abstracts, Overleaf links, collaborators, conflicts, revisions, and decisions.
- Private Vault for logins, bank details, cards, API keys, server access, identity records, and secure notes.
- Client-side vault encryption using Web Crypto AES-GCM with a login-password-derived key.
- Knowledge Notes, Reading Queue, Daily Planner, Calendar, Projects, Timeline, Analytics, command palette, global search, JSON import, and JSON export.

## Toolchain & Requirements

This repo intentionally keeps the frontend lightweight. There is no bundler or package install required for normal local development.

### Required Tools

Node.js 18+ - used for the local static server and Appwrite setup script.

```powershell
node --version
```

Git - version control and deployment through GitHub Pages.

```powershell
git --version
```

### Optional Tools

Appwrite Cloud account - required for real production auth, email verification, password recovery, and cloud persistence.

Python 3 - optional static server alternative.

```powershell
python --version
```

## Quick Start

Clone the repository:

```powershell
git clone https://github.com/smAsifHossain/Daily-Ops-Hub.git
cd Daily-Ops-Hub
```

Run a local static server:

```powershell
npx serve . -l 8080
```

Open:

```text
http://localhost:8080
```

Alternative with Python:

```powershell
python -m http.server 8080
```

## Demo Account

Use the built-in demo account for public preview and UI exploration:

```text
Email: demo@gmail.com
Password: demo@gmail.com
```

The demo account uses browser storage and is intentionally local-only. It includes sample tasks, ideas, research records, prompts, submitted papers, notes, bookmarks, projects, analytics examples, and fake encrypted Private Vault records.

Unlock the demo vault with:

```text
demo@gmail.com
```

## Appwrite Backend

Personal accounts use Appwrite Cloud for authentication and cloud data saving.

Current project values:

```text
APPWRITE_ENDPOINT=https://nyc.cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=6a41f0a600372166cc8a
APPWRITE_DATABASE_ID=daily_ops
APPWRITE_WORKSPACE_COLLECTION_ID=workspaces
APPWRITE_BUCKET_ID=attachments
WEB_PLATFORM_HOSTNAME=smasifhossain.github.io
```

### Backend Resources

The Appwrite setup creates:

| Resource | ID | Purpose |
| --- | --- | --- |
| Database | `daily_ops` | Stores cloud workspace data |
| Collection | `workspaces` | One private workspace document per Appwrite user |
| Storage bucket | `attachments` | Reserved for future file attachments |
| Web platform | `smasifhossain.github.io` | Allows GitHub Pages auth callbacks |

The first production backend stores each user workspace as a private JSON payload. This keeps the initial live release simple and reliable while preserving the option to later split tasks, ideas, papers, prompts, vault metadata, and activity into separate collections.

### One-Time Backend Setup

Create a temporary Appwrite API key with these scopes:

```text
databases.read
databases.write
collections.read
collections.write
attributes.read
attributes.write
indexes.read
indexes.write
buckets.read
buckets.write
```

Run the setup script from the repository root:

```powershell
$env:APPWRITE_ENDPOINT="https://nyc.cloud.appwrite.io/v1"
$env:APPWRITE_PROJECT_ID="6a41f0a600372166cc8a"
$env:APPWRITE_API_KEY="paste-temporary-api-key-here"
node scripts/setup-appwrite.mjs
Remove-Item Env:APPWRITE_API_KEY
```

Delete or rotate the temporary API key after setup. Never commit API keys or place them in frontend code.

## Local Development

The app is a dependency-free static build. Day-to-day changes usually involve:

- `index.html` for document metadata and static asset links.
- `styles.css` for layout, themes, responsive behavior, and component polish.
- `app.js` for rendering, state management, auth, Appwrite sync, vault encryption, and feature logic.
- `docs/schema.md` for planned Appwrite collection structure.
- `docs/appwrite-free-deployment.md` for backend deployment notes.

### Common Commands

| Command | Purpose |
| --- | --- |
| `npx serve . -l 8080` | Run the app locally at `http://localhost:8080` |
| `python -m http.server 8080` | Run a local server without Node packages |
| `node --check app.js` | Syntax-check the main application file |
| `node --check scripts/setup-appwrite.mjs` | Syntax-check the Appwrite setup script |
| `node scripts/setup-appwrite.mjs` | Create Appwrite database, collection, attributes, index, and bucket |
| `git status --short --branch` | Check local repository state |

## Deployment

The frontend is deployed for free with GitHub Pages.

Deployment workflow:

1. Push changes to the `main` branch.
2. GitHub Actions runs `.github/workflows/pages.yml`.
3. The workflow uploads the static repository files.
4. GitHub Pages publishes the app.

Production URL:

```text
https://smasifhossain.github.io/Daily-Ops-Hub/
```

GitHub Pages hosts the frontend only. Appwrite Cloud provides the backend services needed for user registration, email verification, password recovery, and cloud data persistence.

## Authentication Flow

### Demo Account

- Uses local browser storage.
- Does not send real email.
- Resets sample data to a deployment-ready demo workspace.
- Useful for public previews and UI testing.

### Personal Accounts

- Signup creates an Appwrite account.
- Appwrite sends an email verification link.
- User verifies email before normal login.
- Login creates an Appwrite session.
- Workspace data is saved locally first, then synced to the user's private Appwrite workspace document.
- Forgot password sends a secure Appwrite recovery email.

## Private Vault Security Model

The Private Vault is designed for sensitive personal records, so it is handled differently from normal workspace data.

- Vault entries are encrypted before saving.
- Encryption uses Web Crypto AES-GCM.
- The encryption key is derived from the login password with PBKDF2.
- The plaintext password is not stored.
- Decrypted vault contents are held only in memory while the vault is unlocked.
- Vault auto-locks after inactivity.
- Vault item titles and secret fields are excluded from search and activity logs.
- Normal password changes re-encrypt the vault.
- Forgot-password recovery clears the local encrypted vault because the old password is not available for decryption.

CVV/PIN fields exist for personal records, but storing CVV/PIN data is risky and may violate payment-processing rules. Do not store seed phrases, recovery codes, or one-time codes.

## Technology Stack

| Area | Technology | Purpose |
| --- | --- | --- |
| Frontend | HTML, CSS, JavaScript | Static app shell and UI |
| Hosting | GitHub Pages | Free static deployment |
| CI/CD | GitHub Actions | Pages deployment workflow |
| Auth | Appwrite Auth | Email/password, verification, recovery |
| Database | Appwrite Databases | Cloud workspace persistence |
| Storage | Appwrite Storage | Reserved for future attachments |
| Encryption | Web Crypto API | Client-side vault encryption |
| Local persistence | `localStorage` | Demo mode and offline-first browser cache |

## Data Model

The current Appwrite-backed release stores each user's workspace as one private document in the `workspaces` collection.

The workspace contains:

- Tasks
- Daily plans
- Business ideas
- Research items
- Saved prompts
- Submitted papers
- Private vault metadata and encrypted entries
- Knowledge notes
- Bookmarks
- Projects
- Activity logs
- Settings

See `docs/schema.md` for the planned feature-level collection model.

## Development Workflow

Recommended workflow:

1. Pull the latest `main` branch.
2. Run the app locally through `npx serve . -l 8080`.
3. Make changes in `app.js`, `styles.css`, or docs.
4. Run `node --check app.js`.
5. Test the demo account locally.
6. Test a personal Appwrite account when auth or cloud persistence changes.
7. Commit focused changes.
8. Push to `main` and verify GitHub Pages deployment.

## Troubleshooting

### App opens, but auth does not work

Confirm the Appwrite Web platform hostname is:

```text
smasifhossain.github.io
```

Do not include `https://` or `/Daily-Ops-Hub/` in the Appwrite platform hostname.

### Verification or reset link opens the app but does not complete

Check that the link is opening the GitHub Pages production URL and that the Appwrite platform hostname matches the deployed domain.

### Data is not syncing across devices

Make sure you are using a personal account, not the demo account. The demo account intentionally uses local browser storage.

### Vault will not unlock after password recovery

This is expected. Password recovery does not know the old password, so the app cannot decrypt the previous vault key. Normal password changes re-encrypt the vault; forgot-password recovery clears it.

### Web Crypto errors locally

Run through `localhost` or HTTPS:

```powershell
npx serve . -l 8080
```

Then open `http://localhost:8080`.

## Security Notes

- Appwrite API keys are only for backend setup scripts and must never be committed.
- Public frontend code may contain the Appwrite endpoint and project ID.
- Private user data is protected through Appwrite document permissions.
- Vault contents are encrypted client-side before saving.
- Clipboard copy actions can be read by other apps, so avoid leaving sensitive data on the clipboard.

## Roadmap

- Split `app.js` into modules for auth, storage, UI renderers, and domain logic.
- Add feature-level Appwrite collections for richer querying and pagination.
- Add file upload support for task and paper attachments.
- Add Appwrite Realtime updates for multi-tab and multi-device refresh.
- Add stronger import/export migration tooling for cloud workspaces.
- Add automated browser smoke tests for auth, dashboard, vault, and deployment flows.

## Contributing

Before committing:

```powershell
node --check app.js
node --check scripts/setup-appwrite.mjs
git status --short --branch
```

Keep commits focused and avoid committing local secrets, API keys, or generated environment files.

## License

No license file has been added yet. Add a `LICENSE` file before distributing or accepting external contributions.
