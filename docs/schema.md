# Data Schema

The current browser build stores this shape in localStorage. The Appwrite version should use
one database with collections that mirror these entities.

## Shared Fields

Most collections should include:

```text
userId: string
title: string
summary: string
body: string
status: string
tags: string[]
projectId: string
favorite: boolean
archived: boolean
createdAt: datetime
updatedAt: datetime
```

## Collections

### users_profile

```text
userId: string
name: string
email: string
theme: string
createdAt: datetime
updatedAt: datetime
```

### tasks

```text
title: string
description: string
status: backlog | inProgress | done
priority: Low | Medium | High
dueDate: date
projectId: string
tags: string[]
subtasks: string[]
recurring: string
attachmentNote: string
favorite: boolean
archived: boolean
createdAt: datetime
updatedAt: datetime
```

### daily_plans

```text
date: date
focus: string
notes: string
review: string
createdAt: datetime
updatedAt: datetime
```

### ideas

```text
title: string
summary: string
body: string
status: Raw | Validating | Building | Paused | Archived
tags: string[]
projectId: string
favorite: boolean
archived: boolean
createdAt: datetime
updatedAt: datetime
```

### research_items

```text
title: string
question: string
hypothesis: string
summary: string
body: string
sources: string
confidence: Low | Medium | High
nextAction: string
status: Question | Investigating | Validated | Rejected | Archived
tags: string[]
projectId: string
favorite: boolean
archived: boolean
createdAt: datetime
updatedAt: datetime
```

### prompts

```text
title: string
summary: string
body: string
variables: string
category: string
model: string
versionNotes: string
status: Draft | Tested | Favorite | Deprecated | Archived
tags: string[]
projectId: string
favorite: boolean
archived: boolean
createdAt: datetime
updatedAt: datetime
```

### papers

```text
title: string
abstract: string
venue: string
paperType: Conference | Journal | Workshop | Preprint | Demo | Poster | Other
status: Idea | Drafting | Internal Review | Ready to Submit | Submitted | Under Review | Revision | Accepted | Rejected | Withdrawn | Published | Archived
deadline: date
submittedAt: date
decisionAt: date
overleafLink: string
submissionUrl: string
artifactLink: string
doi: string
arxivLink: string
collaborators: string[]
correspondingAuthor: string
blindReview: string
conflicts: string[]
revisionNotes: string
body: string
keywords: string[]
tags: string[]
projectId: string
favorite: boolean
archived: boolean
createdAt: datetime
updatedAt: datetime
```

### private_vault

The local browser build stores encrypted vault metadata inside each workspace. In Appwrite,
store only encrypted payloads and non-sensitive metadata. Do not index decrypted vault
content or write private item titles to activity logs.

```text
salt: string
verifier: object
items: private_vault_items[]
createdAt: datetime
updatedAt: datetime
```

### private_vault_items

```text
encrypted: object
archived: boolean
createdAt: datetime
updatedAt: datetime
```

The encrypted payload can contain login, bank account, payment card, identity, API key,
server, secure note, and other private record fields. CVV/PIN fields are supported for
personal records but are risky and may violate payment-processing rules. Seed phrases,
recovery codes, and one-time codes should not be stored.

### notes

```text
title: string
summary: string
body: string
language: string
status: Active | Reference | Needs Review | Archived
tags: string[]
projectId: string
favorite: boolean
archived: boolean
createdAt: datetime
updatedAt: datetime
```

### bookmarks

```text
title: string
url: string
summary: string
body: string
status: Unread | Reading | Saved | Done | Archived
tags: string[]
projectId: string
favorite: boolean
archived: boolean
createdAt: datetime
updatedAt: datetime
```

### projects

```text
title: string
summary: string
body: string
status: Active | Planning | Paused | Archived
tags: string[]
favorite: boolean
archived: boolean
createdAt: datetime
updatedAt: datetime
```

### attachments

```text
ownerType: task | idea | research | prompt | note | bookmark | project
ownerId: string
fileId: string
fileName: string
fileSize: integer
mimeType: string
createdAt: datetime
```

### activity_logs

```text
action: string
entityType: string
entityTitle: string
createdAt: datetime
```

### recurring_rules

```text
taskTemplateId: string
ruleText: string
nextRunAt: datetime
enabled: boolean
createdAt: datetime
updatedAt: datetime
```
