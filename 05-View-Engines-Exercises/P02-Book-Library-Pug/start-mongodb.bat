@echo off
echo Starting MongoDB...
mkdir BookLibrary
mongod --dbpath=BookLibrary
:finish
pause