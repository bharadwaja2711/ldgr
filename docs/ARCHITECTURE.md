# Architecture

LDGR is a polyglot monorepo. The backend is the single source of truth.
Every client speaks HTTP to it and owns nothing except presentation.

## System Architecture

![LDGR Architecture Overview](assets/architecture-overview.webp)

All clients — web, CLI, and mobile — communicate with the backend exclusively
through HTTP. No client touches the database. No client owns business logic.
The backend contract is the only shared interface. A new client in any language
is a new HTTP consumer. Nothing else changes.

## Repository

```text
ldgr/
├── backend/          Spring Boot — the financial engine
├── cli/              TypeScript — terminal access to LDGR
├── web/              React — browser access to LDGR
└── docker-compose.yml
```

Each module has its own toolchain, its own dependency management, and its own
release lifecycle.

## Backend

**Java 21, Spring Boot, PostgreSQL 17, Flyway**

The backend owns all financial logic, all authentication, all authorisation,
and all data. It is the only component that reads or writes the database.
Migrations are managed by Flyway — versioned, automatic, no manual SQL.

```text
com.ldgr.backend/
├── common/
│   └── exception/
├── identity/
│   ├── controller/
│   ├── dto/
│   ├── entity/
│   ├── repository/
│   └── service/
└── security/
    ├── config/
    ├── jwt/
    └── oauth/
```

`identity` owns everything about who a user is. `security` owns everything
about proving it. They are deliberately separate — identity is a domain
concept, security is infrastructure.

## Authentication

![LDGR Authentication Flow](assets/auth-flow-part1.webp)

Authentication is divided into two stages. The diagram above covers Stage 1:
proving identity and issuing tokens. Stage 2 (organisation context, membership,
and roles) follows after a token is in hand.

Two authentication paths are supported today:

**Password** — email and password verified against BCrypt hash. Issues a JWT
access token and refresh token on success.

**Google OAuth** — browser-initiated OAuth2 flow. The backend upserts the user
record and issues the same token pair. In the CLI, a local callback server
receives the redirect so terminal users authenticate through a browser without
ever handling tokens manually.

**Token lifecycle:** Access tokens carry `typ: ACCESS` and are short-lived.
Refresh tokens carry `typ: REFRESH`, are long-lived, and stored as SHA-256
hashes. The refresh endpoint validates signature, checks the type claim, looks
up the hash, checks revocation and expiry, issues a new pair, and revokes the
old token. Logout revokes server-side. The filter chain enforces type at every
boundary — a refresh token cannot authenticate an API request and an access
token cannot be used to refresh.

## Data Model

The schema is designed for multi-tenancy from migration V1.

**`users`** — Global LDGR identity. One record per human, independent of any
organisation or authentication method.

**`user_identities`** — How a user proves identity. A user can have multiple
providers (password, Google OAuth, others in future) without duplicating the
user record.

**`organizations`** — A tenant. Every financial record belongs to an
organisation. Identified by a short human-readable `og_code`.

**`organization_memberships`** — The join between a global user and an
organisation. Carries role (`OWNER`, `ADMIN`, `ACCOUNTANT`, `VIEWER`) and
status. Authentication and membership are explicitly separated — a valid LDGR
user has no access to an organisation until a membership record exists.

**`onboarding_forms` / `onboarding_form_fields`** — Each organisation
configures its own access-request form with dynamic fields.

**`access_requests` / `access_request_answers`** — A user requests membership
by submitting the organisation's form. An owner or admin approves or rejects
it. The `og_code` identifies the organisation — it never grants access by
itself.

**`refresh_tokens`** — Server-side session control. Stored as SHA-256 hashes.
Revocation is always explicit.

## Clients

### Web

**React, TypeScript, Vite, Tailwind CSS, shadcn/ui**

```text
web/src/
├── app/
├── components/
│   └── ui/
├── core/
│   ├── api/
│   └── auth/
└── features/
    ├── home/
    └── identity/
        ├── api/
        ├── pages/
        └── services/
```

Credentials stored in browser storage. All backend communication through
`/api/*` — proxied in development, direct in production.

### CLI

**TypeScript, Node.js**

```text
cli/src/
├── core/
│   ├── api/
│   └── auth/
└── identity/
    ├── api/
    ├── commands/
    ├── models/
    ├── oauth/
    └── services/
```

Credentials stored in the OS keychain — not plaintext config files. Commands:
`login`, `logout`, `register`, `whoami`, `google-login`.

### Mobile

A Swift client is planned. It will be an HTTP consumer of the same backend —
no different in principle from web or CLI. The backend contract does not change.
A new client in a new language is additive.

## Architectural Invariants

These properties must remain true as LDGR grows:

- The backend is the only component that reads or writes the database.
- No client owns business logic.
- Authentication and organisation membership are always separate concepts.
- The HTTP contract between backend and clients is the only shared interface.
- A new client requires no changes to the backend beyond what the API already exposes.
- Token type is always enforced — at issuance, at validation, and at every endpoint boundary.
