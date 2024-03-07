-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: tms
-- ------------------------------------------------------
-- Server version	8.2.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `accounts`
--

DROP TABLE IF EXISTS `accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `accounts` (
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL,
  `isActive` tinyint(1) DEFAULT '1',
  `groupNames` varchar(255) NOT NULL,
  PRIMARY KEY (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accounts`
--

LOCK TABLES `accounts` WRITE;
/*!40000 ALTER TABLE `accounts` DISABLE KEYS */;
INSERT INTO `accounts` VALUES ('abc','$2b$10$vBB50yMLSdaOvu70YdDSNeBQ2CJdbIQT4efwbmKVKpngMe8JFlJmq','abc@gmail.com',1,''),('admin','$2b$10$agtDr9V1axw8/t/NdxOvzuSKhWV3K3txhFtLG7Wso31JIrjjCQS/W','admin@gmail.com',1,'admin,'),('demo1','$2b$10$OZCT0XNUC/4gkvtd0HA2geunfIIyccc.5PwrCdu/xp/djjD9/hWj6','admin2@gmail.com',1,'projectlead,projectmanager,dev,'),('dev','$2b$10$cbSXWKJGtSaPZOR4.6Cjge.BR5H8Zq1NnbhBRgD/a5KIdEyM0FZTC','dev@gmail.com',1,'devops,dev,'),('dev2','$2b$10$wPV.pHnC2w.BndRxk6IIVuxhdu1KZTunN9.rnCbPJicwmBy15qIyW','dev2@gmail.com',1,''),('projectlead','$2b$10$CO2Dkyz4kUTNKT55epwClOmym6PjPEG4oFm60ZOHfJu3jKbB3450K','projectlead@gmail.com',1,'projectlead,'),('projectmanager','$2b$10$.raDWkb8ZRQH5b7w7xobNu0E4QeYYopb2XZg0vnFWQ6qK5mUD/u1W','projectmanager@gmail.com',1,'projectmanager,');
/*!40000 ALTER TABLE `accounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `application`
--

DROP TABLE IF EXISTS `application`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `application` (
  `App_Acronym` varchar(20) NOT NULL,
  `App_Description` longtext NOT NULL,
  `App_Rnumber` int DEFAULT '0',
  `App_startDate` date DEFAULT NULL,
  `App_endDate` date DEFAULT NULL,
  `App_permit_Open` varchar(20) DEFAULT NULL,
  `App_permit_toDoList` varchar(20) DEFAULT NULL,
  `App_permit_Doing` varchar(20) DEFAULT NULL,
  `App_permit_Done` varchar(20) DEFAULT NULL,
  `App_permit_Create` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`App_Acronym`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `application`
--

LOCK TABLES `application` WRITE;
/*!40000 ALTER TABLE `application` DISABLE KEYS */;
INSERT INTO `application` VALUES ('app1','app1 description',1,'2024-01-01','2025-01-01','projectmanager','dev','dev','projectlead','projectlead'),('zoo','i love animals\nfeed my tiger',5,'2024-01-01','2025-01-01','projectmanager','devops','devops','projectlead','projectlead');
/*!40000 ALTER TABLE `application` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `groups`
--

DROP TABLE IF EXISTS `groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `groups` (
  `name` varchar(20) NOT NULL,
  PRIMARY KEY (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `groups`
--

LOCK TABLES `groups` WRITE;
/*!40000 ALTER TABLE `groups` DISABLE KEYS */;
INSERT INTO `groups` VALUES ('admin'),('dev'),('devops'),('projectlead'),('projectmanager'),('user');
/*!40000 ALTER TABLE `groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plan`
--

DROP TABLE IF EXISTS `plan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plan` (
  `Plan_MVP_name` varchar(20) NOT NULL,
  `Plan_startDate` date DEFAULT NULL,
  `Plan_endDate` date DEFAULT NULL,
  `Plan_app_Acronym` varchar(20) NOT NULL,
  PRIMARY KEY (`Plan_MVP_name`,`Plan_app_Acronym`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plan`
--

LOCK TABLES `plan` WRITE;
/*!40000 ALTER TABLE `plan` DISABLE KEYS */;
INSERT INTO `plan` VALUES ('plan1','2024-01-01','2024-06-06','app1'),('plan2','2023-01-01','2024-01-01','app1'),('sprint 1','2023-01-01','2024-01-01','app1'),('sprint 3','2024-01-01','2024-01-01','zoo'),('sprint1','2024-01-01','2025-01-01','app1'),('sprint1','2024-01-01','2024-01-01','zoo'),('sprint2','2024-01-01','2025-01-01','zoo');
/*!40000 ALTER TABLE `plan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `task`
--

DROP TABLE IF EXISTS `task`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `task` (
  `Task_name` varchar(20) NOT NULL,
  `Task_description` longtext,
  `Task_notes` longtext,
  `Task_app_Acronym` varchar(20) NOT NULL,
  `Task_creator` varchar(20) NOT NULL,
  `Task_owner` varchar(20) DEFAULT NULL,
  `Task_createDate` date NOT NULL,
  `Task_state` enum('open','todo','doing','done','closed') NOT NULL DEFAULT 'open',
  `Task_id` varchar(30) NOT NULL,
  `Task_plan` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`Task_id`),
  UNIQUE KEY `Task_id` (`Task_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `task`
--

LOCK TABLES `task` WRITE;
/*!40000 ALTER TABLE `task` DISABLE KEYS */;
INSERT INTO `task` VALUES ('task1','task1 description','projectlead, done, Wed Feb 28 2024 16:55:27 GMT+0800 (Singapore Standard Time): approved\rdev2, doing, Wed Feb 28 2024 16:54:45 GMT+0800 (Singapore Standard Time): ok redone\rprojectlead, done, Wed Feb 28 2024 16:54:27 GMT+0800 (Singapore Standard Time): not good enuf\rdev2, doing, Wed Feb 28 2024 16:42:32 GMT+0800 (Singapore Standard Time): im doing this\rdev2, todo, Wed Feb 28 2024 16:42:14 GMT+0800 (Singapore Standard Time): i will do this\rdev, doing, Wed Feb 28 2024 16:41:19 GMT+0800 (Singapore Standard Time): i cant do this\rdev, todo, Wed Feb 28 2024 16:40:55 GMT+0800 (Singapore Standard Time): dev progress\rprojectmanager, open, Wed Feb 28 2024 16:39:04 GMT+0800 (Singapore Standard Time): manager note\rprojectlead, create, Wed Feb 28 2024 16:37:54 GMT+0800 (Singapore Standard Time): note1','app1','projectlead','projectlead','2024-02-28','closed','app1_1','plan1'),('monkey','this is a bad two-legged animal\n','projectlead, done, Thu Feb 29 2024 14:45:14 GMT+0800 (Singapore Standard Time): demote\rprojectlead, done, Thu Feb 29 2024 14:44:54 GMT+0800 (Singapore Standard Time): i intend to close this case\rdev, doing, Thu Feb 29 2024 14:43:32 GMT+0800 (Singapore Standard Time): promote monkey\rdev, todo, Thu Feb 29 2024 14:42:50 GMT+0800 (Singapore Standard Time): promote monkey\rprojectmanager, open, Thu Feb 29 2024 14:39:24 GMT+0800 (Singapore Standard Time): promote monkey\rprojectmanager, open, Thu Feb 29 2024 14:37:16 GMT+0800 (Singapore Standard Time): this is the sample code i will be using\n#################################\nconst database = require(\"../config/db\");\n\nasync function findApp(name) {\n  return new Promise((resolve, reject) => {\n    database.query(\n      \"SELECT * FROM application WHERE App_Acronym = ?\",\n      [name],\n      function (err, results) {\n        if (err) {\n          resolve(false);\n        }\n        if (results.length === 0) {\n          resolve(false);\n        } else {\n          resolve(true);\n        }\n      }\n    );\n  });\n}\n\nfunction validateAcronym(res, acronym) {\n  const regex = \"^[a-zA-Z0-9]+$\";\n  let error = false;\n  if (acronym.length < 3 || acronym.length > 20) {\n    res.write(\"AcronymLength \");\n    error = true;\n  }\n  if (!acronym.match(regex)) {\n    res.write(\"AcronymCharacter \");\n    error = true;\n  }\n  return error;\n}\n\nfunction validateDates(res, startDate, endDate) {\n  const startArr = new Date(startDate);\n  const endArr = new Date(endDate);\n  if (startArr > endArr) {\n    res.write(\"DatesInvalid \");\n  }\n  return startArr > endArr;\n}\n\nexports.createApp = async (req, res, next) => {\n  let token;\n  if (\n    req.headers.authorization &&\n    req.headers.authorization.startsWith(\"Bearer\")\n  ) {\n    token = req.headers.authorization.split(\" \")[1];\n  }\n  if (!token) {\n    return res.send(false);\n  }\n  try {\n    const {\n      name,\n      description,\n      startDate,\n      endDate,\n      open,\n      todo,\n      doing,\n      done,\n      create,\n    } = req.body;\n    if (name) {\n      if (validateAcronym(res, name)) {\n        res.send();\n        return;\n      }\n      if (startDate && endDate && validateDates(res, startDate, endDate)) {\n        res.send();\n        return;\n      }\n      const appExists = await findApp(name);\n      if (!appExists) {\n        database.query(\n          \"INSERT INTO application (App_Acronym, App_Description, App_startDate, App_endDate, App_permit_Open, App_permit_toDoList, App_permit_Doing, App_permit_Done, App_permit_Create) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)\",\n          [\n            name,\n            description,\n            startDate,\n            endDate,\n            open,\n            todo,\n            doing,\n            done,\n            create,\n          ],\n          function (err, results) {\n            if (err) {\n              console.log(err);\n              res.write(\"Fail\");\n            } else {\n              res.write(\"Success \");\n            }\n          }\n        );\n      } else {\n        res.write(\"AppExists \");\n      }\n    } else {\n      res.send(false);\n    }\n  } catch (err) {\n    console.log(err);\n    res.send(false);\n  }\n  res.end();\n};\n\nexports.getApps = (req, res, next) => {\n  let token;\n  if (\n    req.headers.authorization &&\n    req.headers.authorization.startsWith(\"Bearer\")\n  ) {\n    token = req.headers.authorization.split(\" \")[1];\n  }\n  if (!token) {\n    return res.send(false);\n  }\n  database.query(\"SELECT * FROM application\", function (error, results) {\n    if (error) {\n      console.log(error);\n    } else {\n      res.json(results);\n    }\n  });\n};\n\nexports.getApp = (req, res, next) => {\n  let token;\n  if (\n    req.headers.authorization &&\n    req.headers.authorization.startsWith(\"Bearer\")\n  ) {\n    token = req.headers.authorization.split(\" \")[1];\n  }\n  if (!token) {\n    return res.send(false);\n  }\n  const name = req.body.name;\n  database.query(\n    \"SELECT * FROM application WHERE App_Acronym = ?\",\n    [name],\n    function (error, results) {\n      if (error) {\n        console.log(error);\n      } else {\n        res.json(results);\n      }\n    }\n  );\n};\n\nexports.editApp = async (req, res, next) => {\n  let token;\n  if (\n    req.headers.authorization &&\n    req.headers.authorization.startsWith(\"Bearer\")\n  ) {\n    token = req.headers.authorization.split(\" \")[1];\n  }\n  if (!token) {\n    return res.send(false);\n  }\n  try {\n    const {\n      name,\n      description,\n      startDate,\n      endDate,\n      open,\n      todo,\n      doing,\n      done,\n      create,\n    } = req.body;\n    if (startDate && endDate && validateDates(res, startDate, endDate)) {\n      res.send();\n      return;\n    }\n    if (description) {\n      database.query(\n        \"UPDATE application SET App_Description = ? WHERE App_Acronym = ?\",\n        [description, name]\n      );\n    }\n    if (startDate || startDate === null) {\n      database.query(\n        \"UPDATE application SET App_startDate = ? WHERE App_Acronym = ?\",\n        [startDate, name]\n      );\n    }\n    if (endDate || endDate === null) {\n      database.query(\n        \"UPDATE application SET App_endDate = ? WHERE App_Acronym = ?\",\n        [endDate, name]\n      );\n    }\n    if (open || open === null) {\n      database.query(\n        \"UPDATE application SET App_permit_Open = ? WHERE App_Acronym = ?\",\n        [open, name]\n      );\n    }\n    if (todo || todo === null) {\n      database.query(\n        \"UPDATE application SET App_permit_todoList = ? WHERE App_Acronym = ?\",\n        [todo, name]\n      );\n    }\n    if (doing || doing === null) {\n      database.query(\n        \"UPDATE application SET App_permit_Doing = ? WHERE App_Acronym = ?\",\n        [doing, name]\n      );\n    }\n    if (done || done === null) {\n      database.query(\n        \"UPDATE application SET App_permit_Done = ? WHERE App_Acronym = ?\",\n        [done, name]\n      );\n    }\n    if (create || create === null) {\n      database.query(\n        \"UPDATE application SET App_permit_Create = ? WHERE App_Acronym = ?\",\n        [create, name]\n      );\n    }\n  } catch (err) {\n    console.log(err);\n  }\n  res.end();\n};\n\nexports.getPermit = (req, res, next) => {\n  let token;\n  if (\n    req.headers.authorization &&\n    req.headers.authorization.startsWith(\"Bearer\")\n  ) {\n    token = req.headers.authorization.split(\" \")[1];\n  }\n  if (!token) {\n    return res.send(false);\n  }\n  try {\n    const { app } = req.body;\n    database.query(\n      \"SELECT * FROM application WHERE App_Acronym = ?\",\n      [app],\n      function (err, results) {\n        if (err) {\n          console.log(err);\n        } else if (results.length === 0) {\n          res.send(false);\n        } else {\n          res.json(results);\n        }\n      }\n    );\n  } catch (err) {\n    console.log(err);\n  }\n};\n\nexports.getDonePermit = async (app) => {\n  return new Promise((resolve, reject) => {\n    database.query(\n      \"SELECT * FROM application WHERE App_Acronym = ?\",\n      [app],\n      function (err, results) {\n        if (err) {\n          console.log(err);\n        } else {\n          resolve(results[0].App_permit_Done);\n        }\n      }\n    );\n  });\n};\n\rprojectmanager, open, Thu Feb 29 2024 14:36:02 GMT+0800 (Singapore Standard Time): first task to work one\rprojectlead, create, Thu Feb 29 2024 14:31:09 GMT+0800 (Singapore Standard Time): this is the first time i work on','zoo','projectlead','projectlead','2024-02-29','doing','zoo_1','sprint2'),('lion','two-legs bad four-legs good','projectlead, done, Thu Feb 29 2024 14:45:29 GMT+0800 (Singapore Standard Time): save\rdev, doing, Thu Feb 29 2024 14:43:38 GMT+0800 (Singapore Standard Time): promote lion\rdev, todo, Thu Feb 29 2024 14:42:58 GMT+0800 (Singapore Standard Time): promote lion\rprojectmanager, open, Thu Feb 29 2024 14:38:56 GMT+0800 (Singapore Standard Time): promote lion\rprojectlead, create, Thu Feb 29 2024 14:31:53 GMT+0800 (Singapore Standard Time): anytask ','zoo','projectlead','projectlead','2024-02-29','closed','zoo_2','sprint2'),('bear','this is a furry animal','dev, doing, Thu Feb 29 2024 14:43:19 GMT+0800 (Singapore Standard Time): demote bear\rdev, todo, Thu Feb 29 2024 14:43:04 GMT+0800 (Singapore Standard Time): promote bear\rprojectmanager, open, Thu Feb 29 2024 14:39:17 GMT+0800 (Singapore Standard Time): promote bear','zoo','projectlead','dev','2024-02-29','todo','zoo_3','sprint2'),('snake','legless','projectlead, create, Thu Feb 29 2024 14:41:09 GMT+0800 (Singapore Standard Time): any notes','zoo','projectlead','projectlead','2024-02-29','open','zoo_4','sprint2'),('Zoo',NULL,NULL,'zoo','projectlead','projectlead','2024-02-29','open','zoo_5','');
/*!40000 ALTER TABLE `task` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-03-06 17:05:31
