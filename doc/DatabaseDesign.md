# Database Design
We implemented 5 tables for our database: Airlines, Airports, FlightPath, FlightRoutes, and Delays.

<img width="744" alt="Tables" src="https://user-images.githubusercontent.com/67709954/223869628-26867933-e415-43e8-850f-72036a5cefb3.png">

The count screenshots for each of these tables (other than auxilliary tables Users and Itinerary are as follow:

#### Airlines:

<img width="300" alt="image" src="https://user-images.githubusercontent.com/67709954/223868949-210b7528-5802-4c12-85ef-d1296ce7e784.png">


#### Airports:

<img width="300" alt="AirportsCount" src="https://user-images.githubusercontent.com/67709954/223869018-532b3bda-1ee3-438b-994d-7e4c449abe7d.png">


#### FlightPath:

<img width="300" alt="FlightPathCount" src="https://user-images.githubusercontent.com/67709954/223869060-3bb8ec79-d9a5-49e7-8113-ddd388fd5ee4.png">


#### FlightRoutes:

<img width="300" alt="FlightRoutesCount" src="https://user-images.githubusercontent.com/67709954/223869099-8bc6bde6-103b-456f-9fcf-5a61be070319.png">

#### Delays:

<img width="300" alt="DelaysCount" src="https://user-images.githubusercontent.com/67709954/223869142-cb68e291-4d49-41eb-91d5-32a8f686919d.png">



### DDL Commands
#### Airlines:

    CREATE TABLE `Airlines` (
      `IATACode` VARCHAR(2) NOT NULL,
      `Airline` VARCHAR(255) NOT NULL,

      PRIMARY KEY (`IATACode`) 
    )

#### Airports:

    CREATE TABLE `Airports` (
      `IATACode` VARCHAR(3) NOT NULL,
      `AirportName` VARCHAR(255) NOT NULL,
      `City` VARCHAR(255) NOT NULL,
      `State` VARCHAR(255) NOT NULL,
      `Latitude` REAL,
      `Longitude` REAL,

      PRIMARY KEY (`IATACode`)
    )

#### FlightPath:

    CREATE TABLE `FlightPath` (
      `FlightNumber` INT NOT NULL,
      `ScheduledDepartureTime` TIME NOT NULL,
      `RelevantDate` DATE NOT NULL,
      `OriginAirportIATACode` VARCHAR(3) NOT NULL,
      `DestinationAirportIATACode` VARCHAR(3) NOT NULL, 

      PRIMARY KEY (`FlightNumber`, `ScheduledDepartureTime`, `RelevantDate`, `OriginAirportIATACode`, `DestinationAirportIATACode`),
      FOREIGN KEY (`FlightNumber`) REFERENCES `FlightRoutes` (`FlightNumber`),
      FOREIGN KEY (`ScheduledDepartureTime`) REFERENCES `FlightRoutes` (`ScheduledDepartureTime`),
      FOREIGN KEY (`RelevantDate`) REFERENCES `FlightRoutes` (`RelevantDate`),
      FOREIGN KEY (`OriginAirportIATACode`) REFERENCES `Airports` (`IATACode`),
      FOREIGN KEY (`DestinationAirportIATACode`) REFERENCES `Airports` (`IATACode`)
    )

#### FlightRoutes:

    CREATE TABLE `FlightRoutes` (
      `FlightNumber` INT NOT NULL,
      `ScheduledDepartureTime` TIME NOT NULL,
      `RelevantDate` DATE NOT NULL,
      `AirlineIATA` VARCHAR(3) NOT NULL,
      `ScheduledFlightDuration` INT NOT NULL,

      PRIMARY KEY (`FlightNumber`, `ScheduledDepartureTime`, `RelevantDate`, `AirlineIATA`), 
      KEY `AirlineIATA` (`AirlineIATA`),
      KEY `ScheduledDepartureTime` (`ScheduledDepartureTime`),
      KEY `RelevantDate` (`RelevantDate`),
      FOREIGN KEY (`AirlineIATA`) REFERENCES `Airlines` (`IATACode`)
    )

#### Delays
    
    CREATE TABLE `Delays` (
      `FlightNum` INT NOT NULL,
      `ScheduledDepartureTime` TIME NOT NULL,
      `Date` DATE NOT NULL,
      `OriginAirportIATACode` VARCHAR(3) NOT NULL,
      `DestinationAirportIATACode` VARCHAR(3) NOT NULL,
      `DepartureDelay` INT,
      `IsCanceled` INT,
      `DelayCancellationReason` VARCHAR(100),
      `AirlineIATA` VARCHAR(2) NOT NULL,


      PRIMARY KEY (`FlightNum`, `Date`, `ScheduledDepartureTime`, `DestinationAirportIATACode`, `OriginAirportIATACode`),
      KEY `FlightNum` (`FlightNum`),
      KEY `DestinationAirportIATACode` (`DestinationAirportIATACode`),
      KEY `OriginAirportIATACode` (`OriginAirportIATACode`),
      KEY `AirlineIATA` (`AirlineIATA`),
      CONSTRAINT `FlightNum` FOREIGN KEY (`FlightNum`) REFERENCES `FlightRoutes` (`FlightNumber`),
      CONSTRAINT `ScheduledDepartureTime` FOREIGN KEY (`ScheduledDepartureTime`) REFERENCES `FlightRoutes` (`ScheduledDepartureTime`),
      CONSTRAINT `RelevantDate` FOREIGN KEY (`Date`) REFERENCES `FlightRoutes` (`RelevantDate`),
      CONSTRAINT `DestAirport` FOREIGN KEY (`DestinationAirportIATACode`) REFERENCES `Airports` (`IATACode`),
      CONSTRAINT `OriginAirport` FOREIGN KEY (`OriginAirportIATACode`) REFERENCES `Airports` (`IATACode`),
      CONSTRAINT `AirlineCode` FOREIGN KEY (`AirlineIATA`) REFERENCES `Airlines` (`IATACode`)
    )

### Advanced Queries
###### 1) Average Delay by Airline of non-cancelled flights 
    SELECT d.AirlineIATA, a.Airline, AVG(d.DepartureDelay) AS avgDepartureDelay
    FROM Delays d JOIN Airlines a ON (d.AirlineIATA = a.IATACode)
    WHERE d.IsCanceled LIKE 0
    GROUP BY d.AirlineIATA
    ORDER BY avgDepartureDelay DESC
    LIMIT 15;

![image](https://user-images.githubusercontent.com/67709954/223892617-62e9638b-d7e5-4b0d-99f9-ef3cc7aac835.png)
* Less than 15 results because there are less than 15 airlines *
    
###### 2) Most popular airlines from Chicago O'Hare Airport (ORD)
    SELECT r.AirlineIATA, a.Airline, COUNT(*) AS FlightCount
    FROM FlightPath p 
        JOIN FlightRoutes r ON (p.FlightNumber = r.FlightNumber) 
        JOIN Airlines a ON (r.AirlineIATA = a.IATACode) 
    WHERE p.OriginAirportIATACode LIKE "ORD"
    GROUP BY r.AirlineIATA
    ORDER BY FlightCount DESC
    LIMIT 15;
    
![image](https://user-images.githubusercontent.com/67709954/223892547-5142f788-65e6-406a-a899-617338ca129f.png)
* Less than 15 results because there are less than 15 airlines *
    

    
