SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL';



-- -----------------------------------------------------
-- Table `beez`.`migrations`
-- -----------------------------------------------------
CREATE TABLE `migrations` (
  `id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `migration` VARCHAR(255) NOT NULL COLLATE 'utf8mb4_unicode_ci',
  `batch` INT(10) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
)
COLLATE='utf8mb4_unicode_ci'
ENGINE=InnoDB
;

-- -----------------------------------------------------
-- Table `beez`.`users`
-- -----------------------------------------------------


CREATE TABLE IF NOT EXISTS `beez`.`users` (
	`id` BIGINT(20) NOT NULL AUTO_INCREMENT,
	`name` VARCHAR(255) NOT NULL COLLATE 'utf8mb4_unicode_ci',
	`address` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8mb4_unicode_ci',
	`email` VARCHAR(255) NOT NULL COLLATE 'utf8mb4_unicode_ci',
	`email_verified_at` TIMESTAMP NULL DEFAULT NULL,
	`password` VARCHAR(255) NOT NULL COLLATE 'utf8mb4_unicode_ci',
	`remember_token` VARCHAR(100) NULL DEFAULT NULL COLLATE 'utf8mb4_unicode_ci',
	`role` ENUM('admin','regular') NULL DEFAULT 'regular' COLLATE 'utf8mb4_unicode_ci',
	`image` LONGBLOB NULL DEFAULT NULL,
	`created_at` TIMESTAMP NULL DEFAULT NULL,
	`updated_at` TIMESTAMP NULL DEFAULT NULL,
	`deleted_at` DATETIME NULL DEFAULT NULL,
    `show_video` TINYINT(3) NOT NULL DEFAULT '1',
	PRIMARY KEY (`id`) USING BTREE,
	UNIQUE INDEX `users_email_unique` (`email`) USING BTREE
)
COLLATE='utf8mb4_unicode_ci'
ENGINE=InnoDB;


-- -----------------------------------------------------
-- Table `beez`.`password_resets`
-- -----------------------------------------------------


CREATE TABLE IF NOT EXISTS `password_resets` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  KEY `password_resets_email_index` (`email`(250))
)
COLLATE='utf8mb4_unicode_ci';


-- -----------------------------------------------------
-- Table `beez`.`apiaries`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `beez`.`apiaries` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `address` VARCHAR(45) NULL,
  `latitude` DECIMAL(10,6) NULL,
  `longitude` DECIMAL(10,6) NULL,
  `area` POLYGON NULL DEFAULT NULL,
  `altitude` DECIMAL(10,0) NULL,
  `description` VARCHAR(255) NULL,
  `type_of_env` ENUM('natural', 'urban', 'agriculture', 'other') NULL,
  `flora_type` VARCHAR(255) NULL,
  `sun_exposure` ENUM('low', 'medium', 'high') NULL,
  `migrate` TINYINT NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `owner_id` BIGINT(20) NOT NULL,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_apiaries_users1_idx` (`owner_id` ASC) VISIBLE,
  CONSTRAINT `fk_apiaries_users1`
    FOREIGN KEY (`owner_id`)
    REFERENCES `beez`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `beez`.`beehives`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `beez`.`beehives` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `uid` CHAR(36) NOT NULL COMMENT 'Unique identifier',
  `name` VARCHAR(255) NOT NULL,
  `description` VARCHAR(255) NULL,
  `type` VARCHAR(100) NULL,
  `latitude` DECIMAL(10,6) NULL DEFAULT NULL,
  `longitude` DECIMAL(10,6) NULL DEFAULT NULL,
  `altitude` DECIMAL(10,0) NULL DEFAULT NULL,
  `num_honey_frames` INT NULL,
  `num_pollen_frames` INT NULL,
  `num_brood_frames` INT NULL,
  `num_empty_frames` INT NULL,
  `source_of_swarm` VARCHAR(45) NULL,
  `queen_color` VARCHAR(45) NULL,
  `installation_date` DATE NULL,
  `created_at` TIMESTAMP(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` TIMESTAMP(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
  `apiary_id` INT NULL,
  `owner_id` BIGINT(20) NOT NULL,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_Beehives_Apiaries1_idx` (`apiary_id` ASC) VISIBLE,
  INDEX `fk_beehives_users1_idx` (`owner_id` ASC) VISIBLE,
  CONSTRAINT `fk_Beehives_Apiaries1`
    FOREIGN KEY (`apiary_id`)
    REFERENCES `beez`.`apiaries` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_beehives_users1`
    FOREIGN KEY (`owner_id`)
    REFERENCES `beez`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `beez`.`plans`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `beez`.`plans` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `description` VARCHAR(1024) NULL,
    `start_date` DATE NULL,
    `stop_date` DATE NULL,
    `user_id` BIGINT(20) NULL,
    `template` TINYINT(3) NOT NULL DEFAULT '0',
    `created_at` TIMESTAMP(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` TIMESTAMP(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deleted_at` TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (`id`),
    INDEX `fk_plans_users1_idx` (`user_id` ASC) VISIBLE,
    CONSTRAINT `fk_plans_users1`
    FOREIGN KEY (`user_id`)
    REFERENCES `beez`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `beez`.`operations`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `beez`.`operations` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `description` VARCHAR(1024) NULL,
  `status` ENUM('planned', 'started', 'done','canceled') NULL,
  `planning_comments` VARCHAR(4096) NULL,
  `planned_date` DATE NULL,
  `executed_date` DATE NULL,
  `execution_comments` VARCHAR(4096) NULL,
  `type` ENUM('harvest', 'interventions', 'analysis', 'custom') NOT NULL,
  `harvest_honey` VARCHAR(45) NULL,
  `harvest_weight` FLOAT NULL,
  `harvest_batch_id` INT NULL,
  `template` TINYINT NOT NULL DEFAULT 0,
  `user_id` BIGINT(20) NULL,
  `plan_id` INT NULL,
  `beehive_id` INT NULL,
  `apiary_id` INT NULL,
  `created_at` TIMESTAMP(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` TIMESTAMP(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_operations_users1_idx` (`user_id` ASC) VISIBLE,
  INDEX `fk_operations_plan1_idx` (`plan_id` ASC) VISIBLE,
  INDEX `fk_operations_beehives1_idx` (`beehive_id` ASC) VISIBLE,
  INDEX `fk_operations_apiary1_idx` (`apiary_id` ASC) VISIBLE,
  CONSTRAINT `fk_operations_users1`
    FOREIGN KEY (`user_id`)
    REFERENCES `beez`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_operations_plan1`
    FOREIGN KEY (`plan_id`)
    REFERENCES `beez`.`plans` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_operations_apiary1`
    FOREIGN KEY (`apiary_id`)
    REFERENCES `beez`.`apiaries` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_operations_beehives1`
    FOREIGN KEY (`beehive_id`)
    REFERENCES `beez`.`beehives` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `beez`.`beehive_in_apiary`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `beez`.`beehive_in_apiary` (
  `apiary_id` INT NOT NULL,
  `beehive_id` INT NOT NULL,
  `from` DATETIME NOT NULL,
  `until` DATETIME NULL,
  `operation_id` INT NULL,
  INDEX `fk_Apiaries_has_Beehives_Beehives1_idx` (`beehive_id` ASC) VISIBLE,
  INDEX `fk_Apiaries_has_Beehives_Apiaries_idx` (`apiary_id` ASC) VISIBLE,
  INDEX `fk_beehive_in_apiary_Operation1_idx` (`Operation_id` ASC) VISIBLE,
  CONSTRAINT `fk_Apiaries_has_Beehives_Apiaries`
    FOREIGN KEY (`apiary_id`)
    REFERENCES `beez`.`apiaries` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Apiaries_has_Beehives_Beehives1`
    FOREIGN KEY (`beehive_id`)
    REFERENCES `beez`.`beehives` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_beehive_in_apiary_Operation1`
    FOREIGN KEY (`Operation_id`)
    REFERENCES `beez`.`operations` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `beez`.`settings`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `beez`.`settings` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `key` VARCHAR(255),
  `value` VARCHAR(100) NULL,
  `scope` BIGINT(20) NULL,
  `created_at` TIMESTAMP(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` TIMESTAMP(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  INDEX `fk_settings_idx` (`scope` ASC) VISIBLE,
  CONSTRAINT `fk_settings`
  FOREIGN KEY (`scope`)
  REFERENCES `beez`.`users` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `beez`.`nodes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `beez`.`nodes` (
    `id` VARCHAR(32) NOT NULL,
    `description` VARCHAR(255) NULL,
    `claim_key` VARCHAR(32) NULL,
    `serial_number` VARCHAR(32) NULL,
    `hw_version` VARCHAR(16) NULL,
    `fw_version` VARCHAR(16) NULL,
    `installed_date` DATE NULL,
    `claimed_date` DATE NULL,
    `beehive_id` INT NULL,
    `created_at` TIMESTAMP(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` TIMESTAMP(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (`id`),
    INDEX `fk_beehive_idx` (`beehive_id` ASC) VISIBLE,
    CONSTRAINT `fk_beehive`
    FOREIGN KEY (`beehive_id`)
    REFERENCES `beez`.`beehives` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
    ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `beez`.`localizations`
-- -----------------------------------------------------

CREATE TABLE `beez`.`localizations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `language` varchar(10) NOT NULL,
  `key_path` varchar(255) NOT NULL,
  `translation` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT localizations_UN UNIQUE (`language` , `key_path`)
) 
COLLATE='utf8mb4_unicode_ci'
ENGINE=InnoDB;

DELIMITER $$

USE `beez`$$
CREATE DEFINER = CURRENT_USER TRIGGER `beez`.`beehives_BEFORE_INSERT` BEFORE INSERT ON `beehives` FOR EACH ROW
BEGIN
	IF new.`uid` is NULL
	THEN
		SET new.`uid` = UUID();
	END IF;

	SET new.`created_at` = NOW(3);
END$$

USE `beez`$$
CREATE DEFINER = CURRENT_USER TRIGGER `beez`.`beehives_BEFORE_UPDATE` BEFORE UPDATE ON `beehives` FOR EACH ROW
BEGIN
  SET new.`updated_at` = NOW(3);
END$$

DELIMITER ;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
