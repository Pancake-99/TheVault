CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- Table: CREDENTIALS
CREATE TABLE CREDENTIALS (
    id_credential UUID NOT NULL DEFAULT uuid_generate_v4(),
    id_user UUID NOT NULL,
    service_name varchar(100) NOT NULL,
    account_username varchar(255),
    password_encrypted text NOT NULL,
    url text,
    notes text,
    created_at_credential TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_at_credential TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT CREDENTIALS_pk PRIMARY KEY (id_credential)
);
-- Table: USERS
CREATE TABLE USERS (
    id_user UUID NOT NULL DEFAULT uuid_generate_v4(),
    email varchar(255) UNIQUE NOT NULL,
    password_hash varchar(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT USERS_pk PRIMARY KEY (id_user)
);
-- Table: audit_logs
CREATE TABLE audit_logs (
    id_audit UUID NOT NULL DEFAULT uuid_generate_v4(),
    id_user UUID NOT NULL,
    id_credential UUID NOT NULL,
    action varchar(50) NOT NULL,
    created_at_audit TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp,
    metadata JSONB,
    CONSTRAINT audit_logs_pk PRIMARY KEY (id_audit)
);
-- foreign keys
-- Reference: CREDENTIALS_USERS (table: CREDENTIALS)
ALTER TABLE CREDENTIALS
ADD CONSTRAINT CREDENTIALS_USERS FOREIGN KEY (id_user) REFERENCES USERS (id_user) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE;
-- Reference: audit_logs_CREDENTIALS (table: audit_logs)
ALTER TABLE audit_logs
ADD CONSTRAINT audit_logs_CREDENTIALS FOREIGN KEY (id_credential) REFERENCES CREDENTIALS (id_credential) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE;
-- Reference: audit_logs_USERS (table: audit_logs)
ALTER TABLE audit_logs
ADD CONSTRAINT audit_logs_USERS FOREIGN KEY (id_user) REFERENCES USERS (id_user) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE;