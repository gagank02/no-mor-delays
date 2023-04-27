CREATE DEFINER=`root`@`%` TRIGGER `Delays_BEFORE_INSERT` BEFORE INSERT ON `Delays` FOR EACH ROW BEGIN
	SET @check = (SELECT * FROM FlightRoutes WHERE FlightNumber = new.FlightNum);
    IF @check IS NULL THEN
		INSERT INTO FlightRoutes(FlightNumber, ScheduleDepartureTime, RelevantDate, AirlineIATA) VALUES (new.FlightNum,new.ScheduledDepartureTime,new.Date, new.AirlineIATA);
	END IF;
END
