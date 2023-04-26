CREATE DEFINER=`root`@`%` PROCEDURE `Result`(
	IN requestIATA VARCHAR(3))
BEGIN
 -- define local vars -- 
  DECLARE varIATA VARCHAR(3);
  DECLARE varAirportName VARCHAR(225);
  DECLARE varAvgDepartureDelay REAL;
  -- declare vars to define --
  DECLARE varRegion VARCHAR(100);
  DECLARE varDelayRating VARCHAR(100);
  DECLARE exit_loop BOOLEAN DEFAULT FALSE;

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
    DelayRating VARCHAR(225)
  );

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

	  INSERT INTO TmpTable VALUE (varIATA, varAirportName, varDelayRating);

  END LOOP cloop;

  -- free memory -- 
  CLOSE curr; 

  -- obtain desired output -- 
  SELECT AirportIATA, AirportName, DelayRating
  FROM TmpTable
  ORDER BY DelayRating ASC;
  
END;
