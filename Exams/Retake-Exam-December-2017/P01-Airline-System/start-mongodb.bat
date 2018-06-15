@echo off
echo Starting MongoDB...
mkdir AirlineSystem
mongod --dbpath=AirlineSystem
:finish
pause