# Vision

## What LDGR is

LDGR is open-source financial infrastructure.

Not an accounting tool. Not a SaaS product. Infrastructure — the foundational
layer that correct financial systems are built on.

The closest analogy is PostgreSQL. PostgreSQL did not compete with Oracle on
features. It competed on correctness, reliability, and trust — and made the
category free. LDGR does the same thing for financial record-keeping.

## The problem

Every organisation needs a correct, auditable, trustworthy financial record.
Today the choice is between two bad options.

**Too simple.** Zoho Books, QuickBooks, Tally. Built for bookkeeping, not
infrastructure. The audit trail is an afterthought. Multi-entity is bolted on.
The data lives in their silo and you rent access to it indefinitely. When you
outgrow them, you migrate — and you pay for it in time, money, and lost history.

**Too closed.** Oracle Financials, SAP ERP. Enterprise-grade, but costs crores
to implement, requires certified consultants, takes 18 months, and locks you in
permanently. The total cost of ownership is indistinguishable from a long-term
tax.

The gap between them — open, correct, self-hostable, genuinely enterprise-grade
financial infrastructure — does not exist.

That gap is LDGR.

## The deeper problem

The Big 4 — Deloitte, EY, KPMG, PwC — charge crores annually to have junior
staff do work that software should do automatically. Reconciliation. Financial
statement preparation. Audit trail verification. Anomaly detection. Cash flow
modelling.

This work is expensive because the underlying data infrastructure is fragmented,
closed, and untrustworthy. When the ledger cannot be trusted, humans verify it.

If the ledger is correct by architecture — immutable, double-entry enforced at
the database layer, continuously reconciled — then the majority of what junior
Big 4 staff currently do becomes automatable.

LDGR does not replace the CA's judgment. It eliminates the data assembly work
that currently justifies most of the bill.

## Who LDGR is for

The first user is a technical founder at seed stage. Tired of paying ₹15,000 a
month for Zoho Books. Capable of self-hosting. Needing one thing above all else:
numbers that are correct when an investor asks for financial statements.

LDGR gives them that. Zero licensing cost. Running in an afternoon with Docker
Compose.

That founder is the entry point. They are not the ceiling.

When they raise a Series A — LDGR scales with them. When they expand
internationally — LDGR handles multi-currency. When they acquire subsidiaries —
LDGR handles multi-entity consolidation. When they get audited — the audit trail
is already immutable and complete.

They never migrate. They never switch. The infrastructure that handled their
first journal entry handles their thousandth entity.

The first user and the long-term user are the same person at different points in
time. That is intentional.

## What "grow without switching" means

It means the architectural decisions made for a seed stage startup are the same
architectural decisions that work for a conglomerate with 200 subsidiaries.

**Multi-tenancy from day one.** Every organisation is isolated at the PostgreSQL
Row Level Security layer. Adding a subsidiary or an acquired company is an
organisation creation — not a migration.

**Double-entry enforced at the database layer.** Not application logic. The
database rejects an unbalanced transaction. This constraint does not change
with scale.

**Immutable audit trail by architecture.** Database triggers prevent UPDATE and
DELETE on journal entries. The audit trail quality on day one with one user is
identical to audit trail quality at enterprise scale with ten thousand users.

**A defined path beyond PostgreSQL.** PostgreSQL handles everything up to a
certain transaction volume and settlement latency requirement. When an
organisation needs real-time gross settlement at financial institution scale,
the repository pattern in LDGR's architecture allows migration to a different
database engine without changing a line of business logic. Same LDGR. Different
storage underneath. The organisation does not experience it as a platform change.

**Currency-neutral storage.** LDGR's internal unit of account is Ledra — a
synthetic currency. Display currency is a presentation layer. A startup
operating in one currency and a conglomerate operating in forty use the same
storage architecture. Consolidation requires no currency translation at the
ledger layer.

## What LDGR refuses to be

**LDGR refuses to be a SaaS product.** Infrastructure competes on correctness
and trust. Not on having more features than Zoho Books.

**LDGR refuses to be an invoicing tool.** Invoicing is a workflow on top of a
ledger. LDGR is the ledger. Other tools build invoicing on top of LDGR.

**LDGR refuses to be AI-first.** The intelligence layer is opt-in, secondary,
and read-only. The ledger works perfectly without it. Correct data first.
Intelligence second. Always.

**LDGR refuses to make judgment calls.** LDGR surfaces insights. Humans decide.
LDGR never executes financial decisions autonomously. The ledger is sacred.
Intelligence is advisory.

**LDGR refuses to lock anyone in.** AGPL licensing means the software is
permanently open. Self-hostable means the data is permanently yours. The
repository pattern means the database is replaceable. Vendor lock-in is
impossible by design. That is not a feature. That is a founding principle.

**LDGR refuses to be closed to the organisations it disrupts.** The Big 4 firms
whose business model LDGR threatens are welcome to license it commercially and
use it to deliver their services more efficiently. The most deliberate outcome —
and the planned one — is the Big 4 writing LDGR a commercial license cheque.
The open source is the product. The trust is the moat. The irony is the business
model.

## The long-term direction

Every serious financial system in the world will eventually need what LDGR
provides. Most of them will build it themselves, badly, at enormous cost, and
own it as a liability rather than an asset.

LDGR exists so they do not have to.

The roadmap is not a feature list. It is a sequence of correctness guarantees —
each one making the system more trustworthy, more auditable, and more capable of
being the foundation that other systems are built on.

Features follow from correctness. Adoption follows from trust.

---

*It is what it is.*
