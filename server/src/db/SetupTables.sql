/* This is Postgres */
DROP TABLE IF EXISTS Feedback;
CREATE TABLE Feedback (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
    message VARCHAR(1023) NOT NULL,
    browser_info VARCHAR(255),
    algorithm_data TEXT
);

/* This is MySql */
DROP TABLE IF EXISTS Feedback;
CREATE TABLE Feedback (
    id BIGINT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
    message VARCHAR(255) NOT NULL,
    browser_info VARCHAR(255) NOT NULL,
    algorithm_data TEXT NOT NULL
);