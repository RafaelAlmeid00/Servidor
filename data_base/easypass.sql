-- MySQL Script generated by MySQL Workbench
-- Sun May 28 17:24:33 2023
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `easypass` DEFAULT CHARACTER SET utf8 ;
USE `easypass` ;


-- -----------------------------------------------------
-- Table `bussines`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bussines` (
  `buss_CNPJ` VARCHAR(14) NOT NULL,
  `buss_nome` VARCHAR(45) NOT NULL,
  `buss_contato` VARCHAR(45) NOT NULL,
  `buss_FotoPerfil` VARCHAR(45) NULL,
  `buss_endCEP` VARCHAR(9) NOT NULL,
  `buss_endUF` VARCHAR(2) NOT NULL,
  `buss_endrua` VARCHAR(45) NOT NULL,
  `buss_endnum` VARCHAR(45) NOT NULL,
  `buss_endcomplemento` VARCHAR(45) NULL,
  `buss_endcidade` VARCHAR(45) NOT NULL,
  `buss_tipo` ENUM("school", "bussines", "bussinesbus") NOT NULL,
  PRIMARY KEY (`buss_CNPJ`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `list_CPF`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `list_CPF` (
  `list_id` INT NOT NULL AUTO_INCREMENT,
  `bussines_buss_CNPJ` VARCHAR(14) NOT NULL,
  `list_tipo` ENUM("student", "worker") NOT NULL,
  `list_CPF` VARCHAR(11) NOT NULL,
  PRIMARY KEY (`list_id`),
  CONSTRAINT `fk_list_CPF_bussines`
    FOREIGN KEY (`bussines_buss_CNPJ`)
    REFERENCES `bussines` (`buss_CNPJ`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_list_CPF_bussines_idx` ON `list_CPF` (`bussines_buss_CNPJ`);


-- -----------------------------------------------------
-- Table `user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `user` (
  `user_CPF` VARCHAR(11) NOT NULL,
  `user_RG` VARCHAR(9) NOT NULL,
  `user_nome` VARCHAR(45) NOT NULL,
  `user_email` VARCHAR(45) NOT NULL,
  `user_senha` VARCHAR(200) NOT NULL,
  `user_nascimento` DATE NOT NULL,
  `user_FotoPerfil` BLOB NULL,
  `user_RGFrente` BLOB NULL,
  `user_RGTras` BLOB NULL,
  `user_endCEP` VARCHAR(9) NOT NULL,
  `user_endUF` VARCHAR(2) NOT NULL,
  `user_endbairro` VARCHAR(45) NOT NULL,
  `user_endrua` VARCHAR(45) NOT NULL,
  `user_endnum` VARCHAR(45) NOT NULL,
  `user_endcomplemento` VARCHAR(45) NOT NULL,
  `user_endcidade` VARCHAR(45) NOT NULL,
  `user_tipo` ENUM("student", "worker", "default") NOT NULL,
  `list_CPF_list_id` INT NULL,
  PRIMARY KEY (`user_CPF`),
  CONSTRAINT `fk_user_list_CPF1`
    FOREIGN KEY (`list_CPF_list_id`)
    REFERENCES `list_CPF` (`list_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE UNIQUE INDEX `user_RG_UNIQUE` ON `user` (`user_RG`);

CREATE INDEX `fk_user_list_CPF1_idx` ON `user` (`list_CPF_list_id`);


-- -----------------------------------------------------
-- Table `admin`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `admin` (
  `adm_id` INT NOT NULL AUTO_INCREMENT,
  `adm_nome` VARCHAR(45) NOT NULL,
  `adm_email` VARCHAR(45) NOT NULL,
  `adm_senha` VARCHAR(45) NOT NULL,
  `adm_level` ENUM("1", "2") NOT NULL,
  PRIMARY KEY (`adm_id`))
ENGINE = InnoDB;

CREATE UNIQUE INDEX `adm_email_UNIQUE` ON `admin` (`adm_email`);


-- -----------------------------------------------------
-- Table `sac`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sac` (
  `sac_ticket` VARCHAR(9) NOT NULL,
  `sac_data` DATE NOT NULL,
  `user_user_CPF` VARCHAR(11) NOT NULL,
  PRIMARY KEY (`sac_ticket`),
  CONSTRAINT `fk_sac_user1`
    FOREIGN KEY (`user_user_CPF`)
    REFERENCES `user` (`user_CPF`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_sac_user1_idx` ON `sac` (`user_user_CPF`);


-- -----------------------------------------------------
-- Table `sac_message`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sac_message` (
  `sacmen_id` INT NOT NULL AUTO_INCREMENT,
  `sacmen_texto` LONGTEXT NOT NULL,
  `admin_adm_id` INT NULL,
  `user_user_CPF` VARCHAR(11) NULL,
  `sac_sac_ticket` VARCHAR(9) NOT NULL,
  PRIMARY KEY (`sacmen_id`),
  CONSTRAINT `fk_sac_message_admin1`
    FOREIGN KEY (`admin_adm_id`)
    REFERENCES `admin` (`adm_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_sac_message_user1`
    FOREIGN KEY (`user_user_CPF`)
    REFERENCES `user` (`user_CPF`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_sac_message_sac1`
    FOREIGN KEY (`sac_sac_ticket`)
    REFERENCES `sac` (`sac_ticket`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_sac_message_admin1_idx` ON `sac_message` (`admin_adm_id`);

CREATE INDEX `fk_sac_message_user1_idx` ON `sac_message` (`user_user_CPF`);

CREATE INDEX `fk_sac_message_sac1_idx` ON `sac_message` (`sac_sac_ticket`);


-- -----------------------------------------------------
-- Table `driver_bus`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `driver_bus` (
  `driver_CPF` VARCHAR(11) NOT NULL,
  `driver_RG` VARCHAR(7) NOT NULL,
  `driver_nome` VARCHAR(45) NOT NULL,
  `driver_imento` DATE NOT NULL,
  `driver_admissao` DATE NOT NULL,
  `driver_demissao` DATE NULL,
  PRIMARY KEY (`driver_CPF`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `bus_route`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bus_route` (
  `rote_id` INT NOT NULL AUTO_INCREMENT,
  `route_nome` VARCHAR(45) NOT NULL,
  `route_num` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`rote_id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `buss`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `buss` (
  `bus_id` INT NOT NULL,
  `bus_nome` VARCHAR(45) NOT NULL,
  `bus_num` VARCHAR(45) NOT NULL,
  `bus_placa` VARCHAR(45) NOT NULL,
  `bus_fabricacao` VARCHAR(45) NOT NULL,
  `bus_status` VARCHAR(45) NOT NULL,
  `bus_modelo` VARCHAR(45) NOT NULL,
  `bus_tarifa` DECIMAL NOT NULL,
  `bussines_buss_CNPJ` VARCHAR(14) NOT NULL,
  `bus_route_rote_id` INT NOT NULL,
  PRIMARY KEY (`bus_id`),
  CONSTRAINT `fk_buss_bussines1`
    FOREIGN KEY (`bussines_buss_CNPJ`)
    REFERENCES `bussines` (`buss_CNPJ`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_buss_bus_route1`
    FOREIGN KEY (`bus_route_rote_id`)
    REFERENCES `bus_route` (`rote_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_buss_bussines1_idx` ON `buss` (`bussines_buss_CNPJ`);

CREATE INDEX `fk_buss_bus_route1_idx` ON `buss` (`bus_route_rote_id`);


-- -----------------------------------------------------
-- Table `turn_bus`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `turn_bus` (
  `turn_id` INT NOT NULL,
  `turn_inicio` DATETIME NOT NULL,
  `turn_fim` DATETIME NOT NULL,
  `driver_bus_driver_CPF` VARCHAR(11) NOT NULL,
  `buss_bus_id` INT NOT NULL,
  PRIMARY KEY (`turn_id`),
  CONSTRAINT `fk_turn_bus_driver_bus1`
    FOREIGN KEY (`driver_bus_driver_CPF`)
    REFERENCES `driver_bus` (`driver_CPF`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_turn_bus_buss1`
    FOREIGN KEY (`buss_bus_id`)
    REFERENCES `buss` (`bus_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_turn_bus_driver_bus1_idx` ON `turn_bus` (`driver_bus_driver_CPF`);

CREATE INDEX `fk_turn_bus_buss1_idx` ON `turn_bus` (`buss_bus_id`);


-- -----------------------------------------------------
-- Table `request_card`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `request_card` (
  `req_id` INT NOT NULL AUTO_INCREMENT,
  `req_data` DATE NOT NULL,
  `req_envio` DATE NULL,
  `req_TipoCartao` ENUM("estudante", "vale-transporte", "acompanhante", "terceira-idade", "expresso") NOT NULL,
  `user_user_CPF` VARCHAR(11) NOT NULL,
  PRIMARY KEY (`req_id`),
  CONSTRAINT `fk_request_card_user1`
    FOREIGN KEY (`user_user_CPF`)
    REFERENCES `user` (`user_CPF`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_request_card_user1_idx` ON `request_card` (`user_user_CPF`);


-- -----------------------------------------------------
-- Table `card`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `card` (
  `card_id` INT NOT NULL,
  `card_validade` VARCHAR(45) NOT NULL,
  `card_saldo` VARCHAR(45) NOT NULL,
  `card_tipo` VARCHAR(45) NOT NULL,
  `card_status` VARCHAR(45) NULL,
  `card_UltimoUso` DATETIME NULL,
  `card_UltimoOnibus` INT NULL,
  `request_card_req_id` INT NOT NULL,
  PRIMARY KEY (`card_id`),
  CONSTRAINT `fk_card_request_card1`
    FOREIGN KEY (`request_card_req_id`)
    REFERENCES `request_card` (`req_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_card_request_card1_idx` ON `card` (`request_card_req_id`);


-- -----------------------------------------------------
-- Table `validation_card`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `validation_card` (
  `val_id` INT NOT NULL AUTO_INCREMENT,
  `val_onibus` INT NOT NULL,
  `val_horario` DATETIME NOT NULL,
  `val_gasto` DECIMAL NOT NULL,
  `card_card_id` INT NOT NULL,
  `turn_bus_turn_id` INT NOT NULL,
  PRIMARY KEY (`val_id`),
  CONSTRAINT `fk_validation_card_card1`
    FOREIGN KEY (`card_card_id`)
    REFERENCES `card` (`card_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_validation_card_turn_bus1`
    FOREIGN KEY (`turn_bus_turn_id`)
    REFERENCES `turn_bus` (`turn_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_validation_card_card1_idx` ON `validation_card` (`card_card_id`);

CREATE INDEX `fk_validation_card_turn_bus1_idx` ON `validation_card` (`turn_bus_turn_id`);


-- -----------------------------------------------------
-- Table `bus_stop`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bus_stop` (
  `stop_id` INT NOT NULL AUTO_INCREMENT,
  `stop_endCEP` VARCHAR(9) NOT NULL,
  `stop_endUF` VARCHAR(2) NOT NULL,
  `stop_endrua` VARCHAR(45) NOT NULL,
  `stop_endnum` VARCHAR(45) NOT NULL,
  `stop_endcomplemento` VARCHAR(45) NULL,
  `stop_endcidade` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`stop_id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `routes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `routes` (
  `bus_stop_stop_id` INT NOT NULL,
  `bus_route_rote_id` INT NOT NULL,
  PRIMARY KEY (`bus_stop_stop_id`, `bus_route_rote_id`),
  CONSTRAINT `fk_routes_bus_stop1`
    FOREIGN KEY (`bus_stop_stop_id`)
    REFERENCES `bus_stop` (`stop_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_routes_bus_route1`
    FOREIGN KEY (`bus_route_rote_id`)
    REFERENCES `bus_route` (`rote_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_routes_bus_stop1_idx` ON `routes` (`bus_stop_stop_id`);

CREATE INDEX `fk_routes_bus_route1_idx` ON `routes` (`bus_route_rote_id`);


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
