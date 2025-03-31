@echo off

call mvn package

java -jar target\FetchDemo-1.0.0-SNAPSHOT.jar

call mvn clean