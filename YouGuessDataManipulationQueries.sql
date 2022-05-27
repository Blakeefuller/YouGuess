-- These are some Database Manipulation queries for a partially implemented Project Website 
-- using the bsg database.
-- Your submission should contain ALL the queries required to implement ALL the
-- functionalities listed in the Project Specs.

-- modifies friends table
INSERT INTO Friends_List ('friendID') VALUES (:friendIDInput) WHERE `userID`= :userIDReference
DELETE FROM Friends_List WHERE friendID= (SELECT userID FROM Users WHERE username= "friendUsernameReference") AND userID = usernameReference;
--DELETE FROM Friends_List WHERE `friendID`= :friendIDReference AND `userID`= :userIDReference

-- modifies items table
INSERT INTO Items_List (skipQuantity, reviveQuantity, userID) VALUES (:skipQuantity, :reviveQuantity, :userIDReference)
UPDATE Items_List SET skipQuantity += 1
UPDATE Items_List SET skipQuantity -= 1 where skipQuantity > 0
UPDATE Items_List SET skipQuantity = 0
UPDATE Items_List SET reviveQuantity += 1
UPDATE Items_List SET reviveQuantity -= 1 where reviveQuantity > 0
UPDATE Items_List SET reviveQuantity = 0

-- modifies high scores table
INSERT INTO High_Scores (highScore, gameMode, userID) VALUES (:highScoreInput, :gameModeInput, :userIDReference)
UPDATE High_Scores SET highScore = :highScoreInput WHERE gameMode = :gameModeInput

-- modifies users table
UPDATE Users SET username = :usernameInput WHERE userID = :userIDReference
UPDATE Users SET 'password' = :passwordInput WHERE userID = :userIDReference

-- gets all usernames from a user's friends list
SELECT username as friend from Friends_List