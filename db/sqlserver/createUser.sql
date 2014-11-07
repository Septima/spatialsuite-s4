--This script assumes a database with the name [s4Index]
--Creates login and user s4Index and gives permissions to acces the database
--Login
USE [master]
GO
CREATE LOGIN [s4Index] WITH PASSWORD=N's4Index', DEFAULT_DATABASE=[master], CHECK_EXPIRATION=OFF, CHECK_POLICY=OFF
GO

--User
USE [s4]
GO
CREATE USER [s4Index] FOR LOGIN [s4Index]
GO

--Permissions
use [s4]
GO
GRANT DELETE TO [s4Index]
GO
use [s4]
GO
GRANT EXECUTE TO [s4Index]
GO
use [s4]
GO
GRANT INSERT TO [s4Index]
GO
use [s4]
GO
GRANT REFERENCES TO [s4Index]
GO
use [s4]
GO
GRANT SELECT TO [s4Index]
GO
use [s4]
GO
GRANT UPDATE TO [s4Index]
GO

