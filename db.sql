CREATE DATABASE IF NOT EXISTS METEO;
USE METEO;


--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;

INSERT INTO `users` VALUES (1,'test','$2a$12$LjmUJdDJsw/BzPN2OGTHi.cdIgcpPeyvC11H0duT0nu1d3/pg7oOq'),(2,'test2','$2a$12$xlWF6OjFkpDHKn8CquVbR.m6UC2FkN.bL/0bxli5Mq7w9PcJKGGF2');

UNLOCK TABLES;

--
-- Table structure for table `weather_data`
--

DROP TABLE IF EXISTS `weather_data`;

CREATE TABLE `weather_data` (
  `id` int NOT NULL AUTO_INCREMENT,
  `city` varchar(100) DEFAULT NULL,
  `temperature_c` decimal(4,2) DEFAULT NULL,
  `temperature_h` decimal(5,2) DEFAULT NULL,
  `feelslike_c` decimal(5,2) DEFAULT NULL,
  `feelslike_f` decimal(5,2) DEFAULT NULL,
  `condition_text` varchar(255) DEFAULT NULL,
  `condition_icon` varchar(255) DEFAULT NULL,
  `condition_code` int DEFAULT NULL,
  `wind_mph` decimal(5,2) DEFAULT NULL,
  `wind_kph` decimal(5,2) DEFAULT NULL,
  `wind_degree` int DEFAULT NULL,
  `pressure_mb` decimal(6,2) DEFAULT NULL,
  `pressure_in` decimal(6,2) DEFAULT NULL,
  `precip_mm` decimal(6,2) DEFAULT NULL,
  `precip_in` decimal(6,2) DEFAULT NULL,
  `humidity` int DEFAULT NULL,
  `cloud` int DEFAULT NULL,
  `is_day` int DEFAULT NULL,
  `uv` decimal(4,2) DEFAULT NULL,
  `gust_mph` decimal(5,2) DEFAULT NULL,
  `gust_kph` decimal(5,2) DEFAULT NULL,
  `last_updated` timestamp DEFAULT CURRENT_TIMESTAMP,
  `last_updated_epoch` int DEFAULT NULL,
  `data_recorded` datetime DEFAULT CURRENT_TIMESTAMP,
  `date_recorded` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


--
-- Dumping data for table `weather_data`
--


-- Dump completed on 2024-05-23 17:29:50
SELECT * FROM weather_data;