-- this will be used when the user is attempting to make a new account
-- this will check to see if the username already exists.
-- if so, and the user does not put in the corresponding password, 
-- then the user will be added to the Users with all the fields
-- if the user puts in an existing username and corresponding password, 
-- user will not be added and error will be outputed
DELIMITER $$
CREATE TRIGGER `ExistingUserCheck`
    BEFORE INSERT ON `Users`
        FOR EACH ROW
    BEGIN
        SET @username = (SELECT UserName FROM Users WHERE UserName = new.UserName)$$
        -- if the username does not exist in Users
        IF @username IS NULL THEN
            SET @userid = (SELECT count(*) + 1 FROM Users)$$
            IF (new.FirstName IS NOT NULL) AND (new.LastName IS NOT NULL THEN)
                INSERT INTO Users VALUES(@userid, new.UserName, new.Password, new.FirstName, new.LastName)$$
            END IF$$
            ELSE
                INSERT INTO Users VALUES(@userid, new.UserName, new.Password)$$
            END ELSE$$
        -- if the username already exists in Users
        SET @password = (SELECT Password FROM Users WHERE UserName = new.UserName)$$
        IF @password IS NULL THEN
             SIGNAL SQLSTATE `45000` SET MESSAGE_TEXT = "User Name Is Already Taken. Please Enter A New User Name"$$
        END IF$$
        IF @password = new.Password THEN 
            SIGNAL SQLSTATE `45000` SET MESSAGE_TEXT = "Account Already Exists. Please Use The Log-In Page"$$
        END IF$$
    END$$
DELIMITER ;