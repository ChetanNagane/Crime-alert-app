# Content

- [Details](#Crime-alert-app)
- [Tech Stack](#Technology-Stack)
- [Features](#features)
- [How To Run App and API](#How_To_Run)
- [Databases](#Databases)
- [Env Structure](#env)
- [App basic Design](#App_design)

# Crime-alert-app

- Under development
- Main Goal
  - Whenever someone is in panic condition he/she can immediately ask for help to near by police-station and also contacting family members by only one tap in app and with more additional [features](#features)

# Technology-Stack

- Node.js
- Express.js
- MongoDB
- React Native

## Features

- Coming soon

# How_To_Run

- Install Node.js and mongoDB

- ## How To run backend API

- Follow below [.env](#env) structure

```
$ git clone https://github.com/MananDesai54/Crime-alert-app.git
$ cd Crime-alert-app

$ cd server
$ npm install

$ npm start
```

- ## How To run Front-end App

- Install Node.js and expo-cli

```
$ git clone https://github.com/MananDesai54/Crime-alert-app.git
$ cd Crime-alert-app

$ cd app
$ npm install

$ npm start
```

## DataBases

- Total 5 DBs:
  1. User
     - First Name
     - Last Name
     - Email
     - Address
     - DOB
     - Mobile NO.
     - Password
     - ID
  2. Place
     - Location
       - Lat
       - Long
     - PlaceId
     - CrimeLevel
     - State
     - City
     - Address
  3. Relatives
     - Id
     - Firstname
     - Lastname
     - Mobile NO
     - email
     - userID
  4. PoliceStation
  5. Crime

## env

- NODE_ENV = development
- DB_URI = xxxxxxxxxx
- DB_PASSWORD = xxxxxxxxxx
- JWT_SECRET = xxxxx
- EMAIL_ID = xxxxx
- EMAIL_PASSWORD = xxxxxxx

## App_Design

![alt text](/CrimeAppFlowImage.png)
