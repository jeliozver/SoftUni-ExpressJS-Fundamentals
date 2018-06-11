@echo off
echo Starting MongoDB...
mkdir MemeDB
mongod --dbpath=MemeDB
:finish
pause