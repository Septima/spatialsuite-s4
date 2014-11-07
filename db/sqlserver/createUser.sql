--Create the s4 user manually OR Use this script
-- This script assumes a database with the name [s4]
-- Creates login and user s4 and gives permissions to acces the database

--Login
USE [master]
GO
CREATE LOGIN [s4] WITH PASSWORD=N's4', DEFAULT_DATABASE=[master], CHECK_EXPIRATION=OFF, CHECK_POLICY=OFF
GO

--User
USE [s4]
GO
CREATE USER [s4] FOR LOGIN [s4]
GO

--Permissions
USE [s4]
GO
ALTER ROLE [db_datareader] ADD MEMBER [s4]
GO
USE [s4]
GO
ALTER ROLE [db_datawriter] ADD MEMBER [s4]
GO
