# ISA

Intermediate Storage Area management and monitoring application.

## Requirements

### node.js

Server-side JavaScript.

Download: http://nodejs.org/#download

Installation instructions: https://github.com/joyent/node/wiki/Installation

### MongoDB

NoSQL database.

Download: http://www.mongodb.org/downloads

Installation instructions: http://www.mongodb.org/display/DOCS/Quickstart

## Installation

Clone the repository:

    git clone git://github.com/morkai/walkner-isa.git

or [download](https://github.com/morkai/walkner-isa/zipball/master)
and extract it.

Go to the project's directory:

    $ cd walkner-isa/

Install the dependencies:

    $ npm install

## Configuration

TODO

## Start

If not yet running, start the MongoDB server.

Start the application server in `development` or `production` environment:

  * under *nix:

        $ NODE_ENV=development node walkner-isa/backend/server.js

  * under Windows:

        $ SET NODE_ENV=development
        $ node walkner-isa/backend/server.js

Application should be available on a port defined in `modules/httpServer.js` file
(`80` by default). Point the Internet browser to http://127.0.0.1/.
