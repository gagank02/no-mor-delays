CREATE DEFINER=`root`@`%` PROCEDURE `Result`(
	IN requestIATA VARCHAR(3))
BEGIN
 -- define local vars -- 
  DECLARE varIATA VARCHAR(3);
  DECLARE varAirportName VARCHAR(225);
  DECLARE varAvgDepartureDelay REAL;
  -- declare vars to define --
  DECLARE varBestDestination VARCHAR(100);
  DECLARE varDelayRating VARCHAR(100);
  DECLARE exit_loop BOOLEAN DEFAULT FALSE;
  DECLARE airLineCode VARCHAR(100);
  DECLARE airline VARCHAR(100);
  DECLARE avgAirlineDepartureDelay FLOAT;
	
  -- define and setup cursor --
  DECLARE curr CURSOR FOR (
    SELECT IATACode, AirportName, AVG(d.DepartureDelay) AS avgDepartureDelay
    FROM Delays d JOIN Airports a ON (d.OriginAirportIATACode = a.IATACode)
    WHERE d.IsCanceled LIKE 0
    GROUP BY d.OriginAirportIATACode
    HAVING d.OriginAirportIATACode = requestIATA
  );
  
  -- declare cursor handler to figure out when cursor finishes --
  -- NOT FOUND is an event that is flagged when we are done reading records --
  DECLARE CONTINUE HANDLER FOR NOT FOUND SET exit_loop = TRUE; 

  DROP TABLE IF EXISTS TmpTable;
  CREATE Table TmpTable(
    AirportIATA VARCHAR(3) Primary Key,
    AirportName VARCHAR(225),
    DelayRating VARCHAR(225),
    avgAirlineDepartureDelay FLOAT,
	AirLineCode VARCHAR(225),
    Airline VARCHAR(225)
  );

  -- second adv query -- 
  -- finds the most reliable destination airport from user's chosen origin airport -- 
  SELECT d.AirlineIATA, a.Airline, AVG(d.DepartureDelay)
  INTO airLineCode, airline, avgAirlineDepartureDelay
  FROM Delays d JOIN Airlines a ON (d.AirlineIATA = a.IATACode)
  WHERE d.IsCanceled LIKE 0 AND d.OriginAirportIATACode = requestIATA
  GROUP BY d.AirlineIATA
  ORDER BY avgAirlineDepartureDelay
  LIMIT 1;

  -- create loop structure to iterate through records -- 
  OPEN curr;
	  cloop: loop
	  FETCH curr INTO varIATA, varAirportName, varAvgDepartureDelay;
	  IF exit_loop THEN
		LEAVE cloop;
	  END IF;

	  -- set status -- 
	  IF varAvgDepartureDelay > 60 THEN
		SET varDelayRating = "Least Reliable";
	  ELSEIF varAvgDepartureDelay > 30 THEN
		SET varDelayRating = "Relatively Reliable";
	  ELSEIF varAvgDepartureDelay > 10 THEN
		SET varDelayRating = "Reliable";
	  ELSE
		SET varDelayRating = "Most Reliable";
	  END IF;

	  INSERT INTO TmpTable VALUE (varIATA, varAirportName, varDelayRating, avgAirlineDepartureDelay, airLineCode, airline);

  END LOOP cloop;

  -- free memory -- 
  CLOSE curr; 

  -- obtain desired output -- 
  -- should return IATA, airport name, delay rating, best destination airport --
  SELECT * FROM TmpTable;
  
END
