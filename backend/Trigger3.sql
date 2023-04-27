CREATE DEFINER=`root`@`%` TRIGGER `Delays_BEFORE_INSERT` BEFORE INSERT ON `Delays` FOR EACH ROW BEGIN
	SET @check = (SELECT FlightNumber FROM FlightRoutes WHERE FlightNumber = new.FlightNum);
    IF @check IS NULL THEN
		INSERT INTO FlightRoutes(FlightNumber, ScheduledDepartureTime, RelevantDate, AirlineIATA, ScheduledFlightDuration) VALUES (new.FlightNum,new.ScheduledDepartureTime, new.Date, new.AirlineIATA, 0);
	END IF;
END
