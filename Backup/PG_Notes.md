# Postgres Command Notes
## Postgres Local DB Details 
- Database: tryout 
- Super User: postgres 
- Pass: suryan0800
- port: 5432
- pgAdmin master pass: suryan0800

## Postgres CLI commands
### To login into the local DB system
```
psql command: psql -h localhost -p 5432 -d tryout -U postgres
```
Where: 
- -h Host 
- -p Port 
- -d Database 
- -U username 

### To take backup of database 
```
pg_dump -O -U postgres -f shop_dump.sql tryout
```
Where: 
- -O --no-owner 
- -U username 
- -f file name 
- tryout - database name to be backed up

### To restore backedup database
```
pg_restore -d tryout -n shop -O -U postgres shop_dump.dump 
```
Where: 
- -d Database 
- -n schema to restore 
- -O no owner 
- -U username 
- shop_dump.dump - backed up database

### To restore backedup database from sql file 
```
psql -U suryan0800 -d postgres < shop_dump.sql
```
Where: 
- -d Database 
- -U username 
- shop_dump.sql - backed up database