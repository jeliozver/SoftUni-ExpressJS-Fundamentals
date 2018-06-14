@echo off
echo Starting MongoDB...
mkdir CarRent
mongod --dbpath=CarRent
:finish
pause