# Database Design
We implemented 5 tables for our database: Airlines, Airports, FlightPath, FlightRoutes, and Delays.

<img width="744" alt="Tables" src="https://user-images.githubusercontent.com/67709954/223869628-26867933-e415-43e8-850f-72036a5cefb3.png">

The count screenshots for each of these tables (other than auxilliary tables Users and Itinerary are as follow:

#### Airlines:

<img width="300" alt="image" src="https://user-images.githubusercontent.com/67709954/223893161-1cf8f07e-b182-445d-a883-3cc62417f30b.png">


#### Airports:

<img width="300" alt="AirportsCount" src="https://user-images.githubusercontent.com/67709954/223893180-1808402d-ad35-4046-9ed8-cd797dcf16b5.png">


#### FlightPath:

<img width="300" alt="FlightPathCount" src="https://user-images.githubusercontent.com/67709954/223892812-8e366331-7d87-4ea3-983e-67b562394706.png">


#### FlightRoutes:

<img width="300" alt="FlightRoutesCount" src="https://user-images.githubusercontent.com/67709954/223892869-d23137f2-25f6-4216-b44b-00b3e742bb23.png">

#### Delays:

<img width="300" alt="DelaysCount" src="https://user-images.githubusercontent.com/67709954/223892950-f315c963-32ca-46c8-aa90-5faf9a376c4a.png">



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
1) Average Delay by Airline of non-cancelled flights 
```sql
    SELECT d.AirlineIATA, a.Airline, AVG(d.DepartureDelay) AS avgDepartureDelay
    FROM Delays d JOIN Airlines a ON (d.AirlineIATA = a.IATACode)
    WHERE d.IsCanceled LIKE 0
    GROUP BY d.AirlineIATA
    ORDER BY avgDepartureDelay DESC
    LIMIT 15;
 ```

![image](https://user-images.githubusercontent.com/67709954/223892617-62e9638b-d7e5-4b0d-99f9-ef3cc7aac835.png)
* Less than 15 results because there are less than 15 airlines
    
2) Most popular airlines from Chicago O'Hare Airport (ORD)

```sql
    SELECT r.AirlineIATA, a.Airline, COUNT(*) AS FlightCount
    FROM FlightPath p 
        JOIN FlightRoutes r ON (p.FlightNumber = r.FlightNumber) 
        JOIN Airlines a ON (r.AirlineIATA = a.IATACode) 
    WHERE p.OriginAirportIATACode LIKE "ORD"
    GROUP BY r.AirlineIATA
    ORDER BY FlightCount DESC
    LIMIT 15;
 ```
    
![image](https://user-images.githubusercontent.com/67709954/223892547-5142f788-65e6-406a-a899-617338ca129f.png)
* Less than 15 results because there are less than 15 airlines
    

### Indexing
#### Advanced Query 1
![image](https://user-images.githubusercontent.com/67709954/224196853-724bc4f1-c796-4d55-bfac-64f9e47747c0.png)

##### Index on Delays(DepartureDelay)
```sql
CREATE INDEX idx_departure_delay ON Delays(DepartureDelay);

The first indexing we tried was an index on DepartureDelay. This index was able to decrease the cost from 33901.32 to 20695.37, which is quite drastic. Thus this optimization was quite effective, and we believe it does so because the AVG function is an aggreagate function and it had to look up all the DepartureDelays.

```
![image](https://user-images.githubusercontent.com/67709954/224198590-3e4d75b6-6f4b-48a5-9917-539ada60cbbe.png)

##### Index on Airlines(Airline)
```sql
CREATE INDEX idx_airline ON Airlines(Airline);

Similar to the last index, indexing on Airline was able to cut down the cost from 33901.32 to 20695.37. The overall cost is identical to  idx_departure_delay, but the actual time for aggregate using temporary table is slightly less compared to idx_departure_delay. We believe this is because we were trying compare Airlines during a join.

```
![image](https://user-images.githubusercontent.com/67709954/224199972-d431cf3e-88fb-42f5-b351-536d261960d2.png)

##### Index on Delays(AirlineIATA) and Airlines(IATACode)
```sql
CREATE INDEX idx_delays_iata ON Delays(AirlineIATA);

```

```sql
CREATE INDEX idx_airlines_iata ON Airlines(IATACode);

Next, we tried to index on AirlineIATA and IATACode. This was able to decrease the cost even more than the last two indexing, from 33901.32 to 14993.20. This is most likely due to that we grouped by AirlineIATA and joined on the condition that the AirlineIATA and IATACode are the same.

```
![image](https://user-images.githubusercontent.com/67709954/224201584-0f417ce1-da88-4137-b1ff-4a66aa3508e9.png)

#### Advanced Query 2
![image](https://user-images.githubusercontent.com/67709954/224201926-2c246f82-1948-4f95-be26-2a775067000c.png)

##### Index on FlightRoutes(ScheduledFlightDuration)
```sql
CREATE INDEX idx_route_scheduled_duration ON FlightRoutes(ScheduledFlightDuration);
```
Since all the other options were already indexed, we decided to try indexing this query on ScheduledFlightDuration. This optimization helped decrease the cost from 234.77 to 225.98, which is not too drastic because this query doesn't rely on ScheduledFlightDuration so indexing on it doesn't impact the performance as much. 

![image](https://user-images.githubusercontent.com/67709954/224202005-21068a1f-0208-49ec-a6cf-6f9154e430dc.png)

##### Index on Airlines(Airline)
Similar to the last index, indexing on Airline also resulted in the same cost deduction from 234.77 to 225.98. We see that the time improved more than with a `idx_route_scheduled_duration` but the overall cost was unchanged. Altough Airline is a column in our table, this is possibly because we are already grouping by Airline and there aren't that many airlines to index.  

```sql
CREATE INDEX idx_airline ON Airlines(Airline);
```
![image](https://user-images.githubusercontent.com/67709954/224202148-a51533fc-09ba-4b9d-a309-58bbc9e55cdb.png)

##### Index on FlightRoutes(ScheduledFlightDuration) and Airlines(Airline)
```sql
CREATE INDEX idx_route_scheduled_duration ON FlightRoutes(ScheduledFlightDuration);
CREATE INDEX idx_airline ON Airlines(Airline);
```
As seen in the previous two index analyses, neither proved to change cost by much, so using both as indices reduces cost by the same amount from 234.77 to 225.98.

![image](https://user-images.githubusercontent.com/67709954/224202139-8d0ef167-fee2-4b3f-8cb9-04124f487306.png)

