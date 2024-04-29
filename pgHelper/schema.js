export const createTbl = `
CREATE TABLE IF NOT EXISTS roles(id CHAR(36) NOT NULL PRIMARY KEY,role VARCHAR(50) NOT NULL UNIQUE);

CREATE TABLE IF NOT EXISTS countries (id CHAR(36) NOT NULL PRIMARY KEY,name VARCHAR(50) NOT NULL,dial_code CHAR(5) NOT NULL, country_code VARCHAR(2) NOT NULL UNIQUE);

CREATE TABLE IF NOT EXISTS statuses (id CHAR(36) NOT NULL PRIMARY KEY,status VARCHAR(50) NOT NULL UNIQUE);

CREATE TABLE IF NOT EXISTS users (id CHAR(36) NOT NULL PRIMARY KEY,email VARCHAR(100) NOT NULL,password_hash VARCHAR(255) NOT NULL,first_name VARCHAR(50) NOT NULL,last_name VARCHAR(50) NOT NULL,full_name VARCHAR(100) NOT NULL,gender CHAR(10),dob DATE,phone VARCHAR(10),address1 VARCHAR(100),address2 VARCHAR(100),city VARCHAR(50),state VARCHAR(50),country VARCHAR(2),zip_code VARCHAR(8),status VARCHAR(50) NOT NULL,role VARCHAR(50),created_by CHAR(36),created_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
updated_by CHAR(36),updated_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),password_reset_code int,password_reset_expiry TIMESTAMPTZ,CONSTRAINT fk_users_roles FOREIGN KEY (role) REFERENCES roles (role),CONSTRAINT fk_users_countries FOREIGN KEY (country) REFERENCES countries (country_code),CONSTRAINT fk_users_statuses FOREIGN KEY (status) REFERENCES statuses (status));`;
