-- when user with nonexisting username tries to login, an account will be created for them
-- when user with an existing account tries to login but password is incorrect, an error is generated
-- when user with existing account logs in with correct password, success message generated
DELIMITER $$
CREATE TRIGGER `ExistingUserCheck`
    BEFORE INSERT ON `Users`
        FOR EACH ROW
    BEGIN
        SET @username = (SELECT UserName FROM Users WHERE UserName = new.UserName)$$
        -- if the username does not exist in Users
        IF @username IS NULL THEN
            SET @userid = (SELECT count(*) + 1 FROM Users)$$
            INSERT INTO Users VALUES(@userid, new.UserName, new.Password)$$
        END IF$$
        
        ELSE 
        -- if the username already exists in Users
            SET @password = (SELECT Password FROM Users WHERE UserName = new.UserName)$$
            IF @password != new.Password
                SIGNAL SQLSTATE `45000` SET MESSAGE_TEXT = "Password Is Incorrect. Please Try Again"$$
            END IF$$
            IF @password = new.Password THEN 
                SIGNAL SQLSTATE `45000` SET MESSAGE_TEXT = "You Are Successfully Logged In"$$
            END IF$$
        END ELSE$$
    END$$
DELIMITER ;
