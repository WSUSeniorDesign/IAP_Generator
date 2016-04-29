# IAP Generator
A web application for generating Incident Application Plans for FEMA ICS/NIMS incidents built using 
[Express](http://expressjs.com/) and [MongoDB](https://www.mongodb.org/).

Designed and developed as part of the senior-year capstone project course for the Department of Computer 
Science and Engineering at [Wright State University](https://www.wright.edu/).

#### Team Members
- [Andrew Berger](http://andrewberger.net)
- William Edmonds
- Jacob Henningsgaard
- Jon Mercer
- Kyle Wood

## Dependencies
A few key highlights from the many NPM packages listed in `package.json` which our app depends on:

- [express](http://expressjs.com/) web application framework
- [mongoose](http://mongoosejs.com/) for object modeling and simpler interaction with MongoDB
- [passport](http://passportjs.org/) for user authentication
- [swig](https://paularmstrong.github.io/swig/) template engine for generating HTML
- [mocha](https://mochajs.org/) testing framework
- [chai](https://mochajs.org/) test assertions and expectations

## Installation
> In this README, a `$` followed by a command indicates that it should be executed on the command line. On Windows, 
> the best option is to use **Git Bash**, which is installed when you install [Git](https://git-scm.com/downloads).

Install Git, NodeJS, and MongoDB.
- [Git](https://git-scm.com/downloads)
- [Node.JS 5.x](https://nodejs.org/en/download/stable/)
- [MongoDB 3.2.x](https://www.mongodb.org/downloads)

Clone the repository to your local machine. 
```
$ cd ~/some/directory
$ git clone https://github.com/WSUSeniorDesign/IAP_Generator.git
$ cd IAP_Generator
```

Install the NPM package dependencies locally in the project directory.
```
$ npm install
```

## Running
Ensure that MongoDB is running (on 
[Windows](https://docs.mongodb.org/manual/tutorial/install-mongodb-on-windows/#run-mongodb-community-edition); 
on [OS X](https://docs.mongodb.org/manual/tutorial/install-mongodb-on-os-x/#run-mongodb)).

To start the application:

```
$ npm start
```

Open [http://localhost:3000](http://localhost:3000) in a web browser to see it in all its glory.

#### Restarting the Application
At any time while the application is running, you can enter `rs` into the command line to restart the app.

```
$ npm start

> ceg-4981-team-projects@1.0.0 start ~/projects/senior-design
> nodemon server.js

[nodemon] 1.8.1
[nodemon] to restart at any time, enter `rs`
[nodemon] watching: *.*
[nodemon] starting `node server.js`
Express app started on port 3000
rs
[nodemon] starting `node server.js`
Express app started on port 3000
```

## Testing
Tests are located at `/test/`. The full suite can be run with the command

```
$ npm test
```

Individual tests can be run with

```
$ node_modules/.bin/cross-env NODE_ENV=test node_modules/.bin/mocha --timeout 5000 --reporter spec --ui tdd test/[filename]
```

## File/Directory Structure
An listing of the important files and directories within this repository:

```
.
├── app
│   ├── controllers     ; code that responds to user requests/input
│   │    └── ...
│   ├── models          ; Mongoose models for MongoDB document collections
│   │    └── ...
│   └── views           ; templates which are rendered into HTML
│        └── ...
├── config
│   ├── env             ; holds config for specific environments (development, testing, live)
│   │    └── ...
│   ├── passport        ; setup files for Passport user authentication
│   │    └── ...
│   ├── config.js       ; loads configuration when the app is run
│   ├── express.js      ; config for Express
│   ├── passport.js     ; config for user authentication
│   ├── roles.js        ; config for user access controls
│   └── routes.js       ; this is where we define our app's URLs and such
├── public              ; static things like images and unchanging HTML/CSS/JavaScript
│   └── ...
├── test                ; unit tests
│   └── ...
├── package.json        ; dependency declarations, NPM config
├── README.md           ; this README
└── server.js           ; connects to MongoDB and runs the server
```