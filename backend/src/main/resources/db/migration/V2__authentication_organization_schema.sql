-- ============================================================
-- LDGR V2
-- Authentication + Organisation Foundation
-- ============================================================

-- ============================================================
-- USERS
-- Global LDGR identity.
-- ============================================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    email VARCHAR(320) NOT NULL,
    password_hash VARCHAR(255),

    first_name VARCHAR(100),
    last_name VARCHAR(100),

    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    email_verified BOOLEAN NOT NULL DEFAULT FALSE,

    last_login_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uq_users_email UNIQUE (email),

    CONSTRAINT chk_users_status
        CHECK (status IN ('ACTIVE', 'SUSPENDED', 'DISABLED'))
);


-- ============================================================
-- USER IDENTITIES
-- Allows LDGR to support password login, Google OAuth,
-- and additional identity providers later.
-- ============================================================

CREATE TABLE user_identities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL,

    provider VARCHAR(50) NOT NULL,
    provider_subject VARCHAR(255) NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_user_identities_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT uq_user_identity_provider_subject
        UNIQUE (provider, provider_subject),

    CONSTRAINT uq_user_identity_user_provider
        UNIQUE (user_id, provider)
);


-- ============================================================
-- ORGANISATIONS
-- A tenant / business entity inside LDGR.
-- ============================================================

CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name VARCHAR(200) NOT NULL,
    type VARCHAR(50) NOT NULL,
    description TEXT,

    og_code CHAR(6) NOT NULL,

    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uq_organizations_og_code UNIQUE (og_code),

    CONSTRAINT chk_organizations_status
        CHECK (status IN ('ACTIVE', 'SUSPENDED', 'ARCHIVED'))
);


-- ============================================================
-- ORGANISATION MEMBERSHIPS
-- Connects a global LDGR user to an organisation.
-- Authentication and organisation membership remain separate.
-- ============================================================

CREATE TABLE organization_memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID NOT NULL,
    user_id UUID NOT NULL,

    role VARCHAR(30) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_membership_organization
        FOREIGN KEY (organization_id)
        REFERENCES organizations(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_membership_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT uq_organization_membership
        UNIQUE (organization_id, user_id),

    CONSTRAINT chk_membership_role
        CHECK (
            role IN (
                'OWNER',
                'ADMIN',
                'ACCOUNTANT',
                'VIEWER'
            )
        ),

    CONSTRAINT chk_membership_status
        CHECK (
            status IN (
                'ACTIVE',
                'SUSPENDED',
                'REMOVED'
            )
        )
);


-- ============================================================
-- ONBOARDING FORMS
-- Each organisation owns its own access-request form.
-- ============================================================

CREATE TABLE onboarding_forms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID NOT NULL,

    name VARCHAR(200) NOT NULL DEFAULT 'Organisation Access Request',
    version INTEGER NOT NULL DEFAULT 1,
    active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_onboarding_form_organization
        FOREIGN KEY (organization_id)
        REFERENCES organizations(id)
        ON DELETE CASCADE,

    CONSTRAINT uq_onboarding_form_organization
        UNIQUE (organization_id),

    CONSTRAINT chk_onboarding_form_version
        CHECK (version > 0)
);


-- ============================================================
-- ONBOARDING FORM FIELDS
-- Dynamic fields configured by the organisation owner.
-- ============================================================

CREATE TABLE onboarding_form_fields (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    form_id UUID NOT NULL,

    field_key VARCHAR(100) NOT NULL,
    label VARCHAR(200) NOT NULL,
    field_type VARCHAR(30) NOT NULL,

    required BOOLEAN NOT NULL DEFAULT FALSE,
    display_order INTEGER NOT NULL,

    config JSONB,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_onboarding_field_form
        FOREIGN KEY (form_id)
        REFERENCES onboarding_forms(id)
        ON DELETE CASCADE,

    CONSTRAINT uq_onboarding_field_key
        UNIQUE (form_id, field_key),

    CONSTRAINT uq_onboarding_field_order
        UNIQUE (form_id, display_order),

    CONSTRAINT chk_onboarding_field_type
        CHECK (
            field_type IN (
                'TEXT',
                'TEXTAREA',
                'NUMBER',
                'EMAIL',
                'DATE',
                'SELECT',
                'MULTI_SELECT',
                'BOOLEAN'
            )
        ),

    CONSTRAINT chk_onboarding_field_order
        CHECK (display_order >= 0)
);


-- ============================================================
-- ACCESS REQUESTS
-- A user requesting membership in an organisation.
--
-- OG code only identifies the organisation.
-- It NEVER creates membership by itself.
-- ============================================================

CREATE TABLE access_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID NOT NULL,
    user_id UUID NOT NULL,
    form_id UUID NOT NULL,

    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',

    submitted_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMPTZ,
    reviewed_by UUID,

    rejection_reason TEXT,

    CONSTRAINT fk_access_request_organization
        FOREIGN KEY (organization_id)
        REFERENCES organizations(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_access_request_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_access_request_form
        FOREIGN KEY (form_id)
        REFERENCES onboarding_forms(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_access_request_reviewer
        FOREIGN KEY (reviewed_by)
        REFERENCES users(id)
        ON DELETE SET NULL,

    CONSTRAINT chk_access_request_status
        CHECK (
            status IN (
                'PENDING',
                'APPROVED',
                'REJECTED',
                'CANCELLED'
            )
        )
);


-- ============================================================
-- ACCESS REQUEST ANSWERS
-- Stores the answers submitted through an organisation's
-- custom onboarding form.
-- ============================================================

CREATE TABLE access_request_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    access_request_id UUID NOT NULL,
    field_id UUID NOT NULL,

    answer TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_access_answer_request
        FOREIGN KEY (access_request_id)
        REFERENCES access_requests(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_access_answer_field
        FOREIGN KEY (field_id)
        REFERENCES onboarding_form_fields(id)
        ON DELETE RESTRICT,

    CONSTRAINT uq_access_request_field_answer
        UNIQUE (access_request_id, field_id)
);


-- ============================================================
-- REFRESH TOKENS
-- Server-side session control for future token authentication.
-- ============================================================

CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL,

    token_hash VARCHAR(255) NOT NULL,

    expires_at TIMESTAMPTZ NOT NULL,
    revoked_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    ip_address INET,
    user_agent TEXT,

    CONSTRAINT fk_refresh_token_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT uq_refresh_token_hash
        UNIQUE (token_hash)
);


-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX idx_user_identities_user_id
    ON user_identities(user_id);

CREATE INDEX idx_memberships_user_id
    ON organization_memberships(user_id);

CREATE INDEX idx_memberships_organization_id
    ON organization_memberships(organization_id);

CREATE INDEX idx_access_requests_organization_id
    ON access_requests(organization_id);

CREATE INDEX idx_access_requests_user_id
    ON access_requests(user_id);

CREATE INDEX idx_access_requests_status
    ON access_requests(status);

CREATE INDEX idx_access_requests_organization_status
    ON access_requests(organization_id, status);

CREATE INDEX idx_access_request_answers_request_id
    ON access_request_answers(access_request_id);

CREATE INDEX idx_refresh_tokens_user_id
    ON refresh_tokens(user_id);
