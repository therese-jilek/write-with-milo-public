# Write with Milo

Write with Milo is a writing-support tool for students who have ideas but may struggle to retrieve, organize, formulate, or express them.

Milo is being built around a simple principle: support should help students express their thinking without doing the thinking for them.

This is an early build-in-public repository. It contains a working, local-only interface snapshot, selected presentation components, public-safe writing-structure utilities, and a curated portion of the design system. The interface stores its temporary state only in the browser session and does not connect to a database or an AI provider.

This repository is intentionally a curated subset of a private production codebase. Security controls, authentication, privacy workflows, research and measurement systems, production infrastructure, provider integrations, and detailed instructional content are intentionally excluded.

## Run locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Included

- A local teacher project setup view
- An interactive student Outline and Draft workspace
- Writing-structure and essay-assembly utilities used by Milo
- Read-aloud and copy-writing presentation components
- Shared visual tokens and responsive UI styling
- Public editions of selected design-system notes

## Not included

- Production accounts, authentication, or authorization
- Database schemas, migrations, or security policies
- Student data, persistence, analytics, or instrumentation
- AI provider requests or safety-filter implementation
- Internal question banks, sentence-starter libraries, or writing-goal definitions
- Production deployment configuration

No open-source license has been added. All rights are reserved unless and until a license is provided.
