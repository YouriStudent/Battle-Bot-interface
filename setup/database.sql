DROP DATABASE IF EXISTS `battlebot`;
CREATE DATABASE IF NOT EXISTS `battlebot`;

USE `battlebot`;

CREATE TABLE IF NOT EXISTS `role` (
    Id INT NOT NULL AUTO_INCREMENT,
    Name VARCHAR(50) NOT NULL,

    CONSTRAINT pk_role PRIMARY KEY (Id)
);

CREATE TABLE IF NOT EXISTS `stats` (
    Id INT NOT NULL AUTO_INCREMENT,
    Wins INT NOT NULL DEFAULT 0,
    PlayedMatches INT NOT NULL DEFAULT 0,

    CONSTRAINT pk_stats PRIMARY KEY (Id)
);

CREATE TABLE IF NOT EXISTS `specs` (
    Id INT NOT NULL AUTO_INCREMENT,
    Board VARCHAR(100) NOT NULL,
    Interface VARCHAR(100) NOT NULL,

    CONSTRAINT pk_specs PRIMARY KEY (Id)
);

CREATE TABLE IF NOT EXISTS `bot` (
    Id INT NOT NULL AUTO_INCREMENT,
    StatsId INT NOT NULL,
    SpecsId INT NOT NULL,
    Name VARCHAR(50) NOT NULL,

    CONSTRAINT pk_bot PRIMARY KEY (Id),
    CONSTRAINT fk_botstats FOREIGN KEY (StatsId) REFERENCES stats(Id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_botspecs FOREIGN KEY (SpecsId) REFERENCES specs(Id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS `team` (
    Id INT NOT NULL AUTO_INCREMENT,
    BotId INT NOT NULL,
    Name VARCHAR(50) NOT NULL,

    CONSTRAINT pk_team PRIMARY KEY (Id),
    CONSTRAINT fk_teambot FOREIGN KEY (BotId) REFERENCES bot(Id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS `account` (
    Id INT NOT NULL AUTO_INCREMENT,
    TeamId INT NOT NULL,
    RoleId INT NOT NULL,
    Username VARCHAR(50) NOT NULL,
    Password VARCHAR(255) NOT NULL,
    Email VARCHAR(200) NOT NULL,

    CONSTRAINT pk_account PRIMARY KEY (Id),
    CONSTRAINT fk_accountteam FOREIGN KEY (TeamId) REFERENCES team(Id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_accountrole FOREIGN KEY (RoleId) REFERENCES `role`(Id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS `event` (
    Id INT NOT NULL AUTO_INCREMENT,
    Name VARCHAR(50) NOT NULL,
    Date TIMESTAMP NOT NULL,
    Description VARCHAR(999) NOT NULL,

    CONSTRAINT pk_event PRIMARY KEY (Id)
);

CREATE TABLE IF NOT EXISTS `team-event` (
    EventId INT NOT NULL,
    TeamId INT NOT NULL,

    CONSTRAINT pk_team_event PRIMARY KEY (EventId, TeamId),
    CONSTRAINT fk_cevent FOREIGN KEY (EventId) REFERENCES event(Id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_cteam FOREIGN KEY (TeamId) REFERENCES team(Id) ON DELETE CASCADE ON UPDATE CASCADE
);