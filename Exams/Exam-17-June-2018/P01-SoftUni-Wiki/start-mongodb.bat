@echo off
echo Starting MongoDB...
mkdir SoftUniWiki
mongod --dbpath=SoftUniWiki
:finish
pause