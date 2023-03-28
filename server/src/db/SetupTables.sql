/* This is MySql */
DROP TABLE IF EXISTS Feedback;
CREATE TABLE Feedback (
    id BIGINT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
    message VARCHAR(255) NOT NULL,
    browser_info VARCHAR(255) NOT NULL,
    algorithm_data TEXT NOT NULL
);