-- MySQL dump 10.16  Distrib 10.1.37-MariaDB, for Linux (x86_64)
--
-- Host: localhost    Database: YouGuess
-- ------------------------------------------------------
-- Server version	10.1.37-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `YouTube_Channels`
--

DROP TABLE IF EXISTS `YouTube_Channels`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `YouTube_Channels` (
  `channelID` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  `numSubcribers` int(11) NOT NULL,
  `channelPhotoUrl` varchar(255) NOT NULL
  PRIMARY KEY (`channelID`)
) ENGINE=InnoDB 
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `YouTube_Channels`
--

LOCK TABLES `YouTube_Channels` WRITE;
/*!40000 ALTER TABLE `YouTube_Channels` DISABLE KEYS */;
INSERT INTO `YouTube_Channels` (`channelID`, `name`, `numSubscribers`, `channelPhotoUrl`) VALUES (0, 'SyKe', 16, 'https://yt3.ggpht.com/ytc/AKedOLTvs0ScA2dRb2zjwR6fPdCLgAwKTVIiOlLLjfzBTg=s88-c-k-c0x00ffffff-no-rj');
INSERT INTO `YouTube_Channels` (`channelID`, `name`, `numSubscribers`, `channelPhotoUrl`) VALUES (1, 'PewDiePie', 111000000, 'https://yt3.ggpht.com/5oUY3tashyxfqsjO5SGhjT4dus8FkN9CsAHwXWISFrdPYii1FudD4ICtLfuCw6-THJsJbgoY=s88-c-k-c0x00ffffff-no-rj');
/*!40000 ALTER TABLE `YouTube_Channels` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `YouTube_Videos`
--

CREATE TABLE `YouTube_Videos` ( 
    `channelID` INT(11) NOT NULL,  
    `title` VARCHAR(255) NOT NULL,  
    `thumbnailURL` VARCHAR(255) NOT NULL,  
    `numViews` INT(11) NOT NULL,    
    PRIMARY KEY(`channelID`)
) ENGINE = InnoDB;

INSERT INTO YouTube_Videos (`title`, `thumbnailURL`, `numViews`, `channelID`) VALUES ('An Advanced Warfare Montage By SyKe Buritoe','https://i.ytimg.com/vi/skXvYAmQbaY/hqdefault.jpg?sqp=-oaymwEcCNACELwBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLB9n_KgrgGpksGJ0v7MWDiHOE6Byw', 118, 0);
INSERT INTO YouTube_Videos (`title`, `thumbnailURL`, `numViews`, `channelID`) VALUES ('Congratulations', 'https://i.ytimg.com/an_webp/PHgc8Q6qTjc/mqdefault_6s.webp?du=3000&sqp=COCZ8pMG&rs=AOn4CLAHovwlwKDw8bqHGQlFjRYiMplqRg', 222711307, 1);

--
-- Table structure for table `Users`
--

CREATE TABLE Users (
    `userID` int(11) UNIQUE NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(255) NOT NULL,
    `password` varchar(256) NOT NULL,
    `username` varchar(32) NOT NULL,
    PRIMARY KEY(`userID`) 
) ENGINE=INNODB;

INSERT INTO `Users` (`userID`, `email`, `password`, `username`) VALUES (0 ,'nguyejo5@oregonstate.edu', 'nezuko4ever', 'John');
INSERT INTO `Users` (`userID`, `email`, `password`, `username`) VALUES (1 ,'fullerbl@oregonstate.edu', 'StephenTheGOAT!0', 'Blake');


--
-- Table structure for table `High_Scores`
--

CREATE TABLE High_Scores (
    `userID` int(11) NOT NULL,
    `scoreID` INT AUTO_INCREMENT PRIMARY KEY,
    `highScore` INT NOT NULL,
    `gameMode` VARCHAR(255) NOT NULL,
    `date` date NOT NULL,
    FOREIGN KEY(`userID`) REFERENCES Users (`userID`)
) ENGINE=INNODB;

INSERT INTO High_Scores (`highScore`, `gameMode`, `userID`) VALUES (10, 'subscribers', 0);
INSERT INTO High_Scores (`highScore`, `gameMode`, `userID`) VALUES (8, 'subscribers', 1);

--
-- Table structure for table `Friends_List`
--

CREATE TABLE Friends_List (
    `userID` int(11) NOT NULL PRIMARY KEY,
    `friendID` int(11) UNIQUE NOT NULL,
    FOREIGN KEY(`userID`) REFERENCES Users (`userID`),
    FOREIGN KEY(`friendID`) REFERENCES Users (`userID`)
) ENGINE=INNODB;

INSERT INTO Friends_List (`userID`, `friendID`) VALUES (0, 1); 
INSERT INTO Friends_List (`userID`, `friendID`) VALUES (1, 0); 

--
-- Table structure for table `Items_List`
--


CREATE TABLE Items_List (
    `userID` int(11) NOT NULL PRIMARY KEY,
    `skipQuantity` int NOT NULL,
    `reviveQuantity` int NOT NULL,
    FOREIGN KEY(`userID`) REFERENCES Users (`userID`)
) ENGINE=INNODB;

INSERT INTO Items_List (`userID`, `skipQuantity`, `reviveQuantity`) VALUES (0 ,99999, 99999);
INSERT INTO Items_List (`userID`, `skipQuantity`, `reviveQuantity`) VALUES (1, 99999, 99999); 

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;