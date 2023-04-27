CREATE DEFINER=`root`@`%` TRIGGER `Users_BEFORE_DELETE` BEFORE DELETE ON `Users` FOR EACH ROW BEGIN
	SET @userid = (SELECT UserID FROM Users WHERE UserName = old.UserName);
    IF @userid IS NOT NULL THEN
		DELETE FROM Itinerary WHERE UserID = @userid;
	END IF;
END
