# ISA

Intermediate Storage Area management and monitoring application.

## License

The application is licensed under the
[Creative Commons Attribution-NonCommercial 3.0 Unported License](http://creativecommons.org/licenses/by-nc/3.0/).

The `frontend/img/mapmarker.png` file created by [The Noun Project](http://www.thenounproject.com/)
is licensed under the [Creative Commons Attribution License](http://creativecommons.org/licenses/by/3.0/).

## Requirements

### node.js

Server-side JavaScript.

Download: http://nodejs.org/#download

Installation instructions: https://github.com/joyent/node/wiki/Installation

### MongoDB

NoSQL database.

Download: http://www.mongodb.org/downloads

Installation instructions: http://www.mongodb.org/display/DOCS/Quickstart

### GraphicsMagick

GraphicsMagick Image Processing System is required by the `gm` node module used for resizing
the storage areas maps.

Download: http://www.graphicsmagick.org/download.html

Installaction instructions: http://www.graphicsmagick.org/README.html#installation

### jquery.smoothZoom

Optional. Used for showing the location of storage areas on a map.
Files `icons.png`, `pin.png`, `preloader.gif` and `jquery.smoothZoom.min.js`
should be placed in the `frontend/vendor/jquery/smoothZoom` directory.

Available from CodeCanyon:
[Smooth Zoom Pan - jQuery Image Viewer](http://codecanyon.net/item/smooth-zoom-pan-jquery-image-viewer/511142)

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

## Starting

If not yet running, start the MongoDB server.

Start the application server in a `development` or `production` environment:

  * under *nix:

        $ NODE_ENV=development node walkner-isa/backend/server.js

  * under Windows:

        $ SET NODE_ENV=development
        $ node walkner-isa/backend/server.js

Application should be available on a port defined in the `modules/httpServer.js` file
(`80` by default). Point the Internet browser to http://127.0.0.1/.
