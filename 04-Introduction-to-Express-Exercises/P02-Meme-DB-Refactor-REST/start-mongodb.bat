@echo off
echo Starting MongoDB...
mkdir MemeDB-REST
mongod --dbpath=MemeDB-REST
:finish
pause