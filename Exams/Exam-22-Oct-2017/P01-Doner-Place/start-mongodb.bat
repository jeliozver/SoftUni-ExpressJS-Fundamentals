@echo off
echo Starting MongoDB...
mkdir DonerPlace
mongod --dbpath=DonerPlace
:finish
pause