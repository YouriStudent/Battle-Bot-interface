DROP DATABASE IF EXISTS `battlebot`;
CREATE DATABASE IF NOT EXISTS `battlebot`;

USE `battlebot`;

CREATE TABLE IF NOT EXISTS `role` (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,

    CONSTRAINT pk_role PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS `stats` (
    id INT NOT NULL AUTO_INCREMENT,
    wins INT NOT NULL DEFAULT 0,
    playedMatches INT NOT NULL DEFAULT 0,

    CONSTRAINT pk_stats PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS `specs` (
    id INT NOT NULL AUTO_INCREMENT,
    board VARCHAR(100) NOT NULL,
    interface VARCHAR(100) NOT NULL,

    CONSTRAINT pk_specs PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS `bot` (
    id INT NOT NULL AUTO_INCREMENT,
    statsId INT NOT NULL,
    specsId INT NOT NULL,
    name VARCHAR(50) NOT NULL,

    CONSTRAINT pk_bot PRIMARY KEY (id),
    CONSTRAINT fk_botstats FOREIGN KEY (statsId) REFERENCES stats(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_botspecs FOREIGN KEY (specsId) REFERENCES specs(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS `team` (
    id INT NOT NULL AUTO_INCREMENT,
    botId INT NOT NULL,
    name VARCHAR(50) NOT NULL,

    CONSTRAINT pk_team PRIMARY KEY (id),
    CONSTRAINT fk_teambot FOREIGN KEY (botId) REFERENCES bot(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS `account` (
    id INT NOT NULL AUTO_INCREMENT,
    teamId INT,
    roleId INT NOT NULL,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(200) NOT NULL,

    CONSTRAINT pk_account PRIMARY KEY (id),
    CONSTRAINT fk_accountteam FOREIGN KEY (teamId) REFERENCES team(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_accountrole FOREIGN KEY (roleId) REFERENCES `role`(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS `event` (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    date TIMESTAMP NOT NULL,
    description VARCHAR(999) NOT NULL,

    CONSTRAINT pk_event PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS `team-event` (
    eventId INT NOT NULL,
    teamId INT NOT NULL,

    CONSTRAINT pk_team_event PRIMARY KEY (eventId, teamId),
    CONSTRAINT fk_cevent FOREIGN KEY (eventId) REFERENCES event(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_cteam FOREIGN KEY (teamId) REFERENCES team(id) ON DELETE CASCADE ON UPDATE CASCADE
);