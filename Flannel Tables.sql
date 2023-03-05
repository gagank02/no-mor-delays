
-- USERS TABLE:
DROP TABLE IF EXISTS `Users`;

CREATE TABLE `Users` (
  `UserID` INT [PK] NOT NULL,
  `UserName` VARCHAR(100) NOT NULL, 
  `Password` VARCHAR(100) NOT NULL 
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- insert will happen when user joins (front end needs to communicate)

-- DELAYS TABLE:
DROP TABLE IF EXISTS `Delays`; 

CREATE TABLE `Delays` (
  `FlightNum` INT NOT NULL,
  `Date` DATE NOT NULL,
  `ScheduledDepartureTime` TIME NOT NULL,
  `DestinationAirportIATACode` VARCHAR(3) NOT NULL,
  `OriginAirportIATACode` VARCHAR(3),
  `DepartureDelay` TIME,
  `IsCanceled` INT,
  `DelayCancellationReason` VARCHAR(100),
  `AirlineIATA` VARCHAR(3) NOT NULL,


  PRIMARY KEY (`FlightNum`, `Date`, `ScheduledDepartureTime`, `DestinationAirportIATACode`, `OriginAirportIATACode`),
  FOREIGN KEY (`FlightNum`) REFERENCES `FlightRoutes` (`FlightNumber`),
  FOREIGN KEY (`Date`) REFERENCES `FlightRoutes` (`Date`),
  FOREIGN KEY (`ScheduledDepartureTime`) REFERENCES `FlightRoutes` (`ScheduledDepartureTime`),
  FOREIGN KEY (`DestinationAirportIATACode`) REFERENCES `Airports` (`IATA`),
  FOREIGN KEY (`OriginAirportIATACode`) REFERENCES `Airports` (`IATA`),
  FOREIGN KEY (`AirlineIATA`) REFERENCES `Airlines` (`IATACode`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `Delays` (`FlightNum`, `Date`, `ScheduledDepartureTime`, `DestinationAirportIATACode`, `OriginAirportIATACode`,
                       `DepartureDelay`, `IsCanceled`, `DelayCancellationReason`, `AirlineIATA`) values ();


-- AIRPORTS TABLE:
DROP TABLE IF EXISTS `Airports`;

CREATE TABLE `Airports` (
  `IATACode` VARCHAR(3) NOT NULL,
  `AirportName` VARCHAR(255) NOT NULL,
  `City` VARCHAR(255) NOT NULL,
  `State` VARCHAR(255) NOT NULL,
  `Latitude` REAL NOT NULL,
  `Longitude` REAL NOT NULL,

  PRIMARY KEY (`IATACode`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `Airports` (`IATACode`, `AirportName`, `City`, `State`, `Latitude`, `Longitude`) values ();


--  ITINERARY TABLE:
DROP TABLE IF EXISTS `Itinerary`;

CREATE TABLE `Itinerary` (
  `UserID` INT NOT NULL,
  `FlightNum` INT NOT NULL,
  `Date` DATE NOT NULL,
  `ScheduledDepartureTime` TIME NOT NULL,
  `OriginAirportIATACode` VARCHAR(3) NOT NULL,
  `DestinationAirportIATACode` VARCHAR(100) NOT NULL,

  PRIMARY KEY (`UserID`, `FlightNum`, `Date`, `ScheduledDepartureTime`),
  FOREIGN KEY (`UserID`) REFERENCES `Users` (`UserId`),
  FOREIGN KEY (`FlightNum`) REFERENCES `FlightRoutes` (`FlightNumber`), 
  FOREIGN KEY (`Date`) REFERENCES `FlightRoutes` (`Date`), 
  FOREIGN KEY (`ScheduledDepartureTime`) REFERENCES `FlightRoutes` (`ScheduledDepartureTime`),
  FOREIGN KEY (`OriginAirportIATACode`) REFERENCES `Airports` (`IATA`),
  FOREIGN KEY (`DestinationAirportIATACode`) REFERENCES `Airports` (`IATA`) 
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- INSERT INTO `Airlines` (`UserID`, `FlightNum`, `Date`, `ScheduledDepartureTime`, `OriginAirportIATACode`, `DestinationAirportIATACode`) values ();


-- AIRLINES TABLE:
DROP TABLE IF EXISTS `Airlines`; 

CREATE TABLE `Airlines` (
  `IATACode` VARCHAR(2) NOT NULL,
  `Airline` VARCHAR(255) NOT NULL,

  PRIMARY KEY (`IATACode`) 
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `Airlines` (`IATACode`, `Airline`) values ();