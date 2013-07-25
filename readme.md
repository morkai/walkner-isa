# ISA

__Postponed work in progress.__

Intermediate Storage Area management and monitoring application.

## Requirements

### node.js

Node.js is a server side software system designed for writing scalable
Internet applications in JavaScript.

  * __Version__: 0.8.x
  * __Website__: http://nodejs.org/
  * __Download__: http://nodejs.org/download/
  * __Installation guide__: https://github.com/joyent/node/wiki/Installation

### MongoDB

MongoDB is a scalable, high-performance, open source NoSQL database.

  * __Version__: 2.x.x
  * __Website__: http://mongodb.org/
  * __Download__: http://www.mongodb.org/downloads
  * __Installation guide__: http://www.mongodb.org/display/DOCS/Quickstart

### GraphicsMagick

GraphicsMagick Image Processing System is required by the `gm` node module used for resizing
the storage areas maps.

  * __Version__: 1.3.x
  * __Website__: http://www.graphicsmagick.org/
  * __Download__: http://www.graphicsmagick.org/download.html
  * __Installation guide__: http://www.graphicsmagick.org/README.html#installation

### jquery.smoothZoom

Optional. Used for showing the location of storage areas on a map.
Files `icons.png`, `pin.png`, `preloader.gif` and `jquery.smoothZoom.min.js`
should be placed in the `frontend/vendor/jquery/smoothZoom` directory.

Available from CodeCanyon:
[Smooth Zoom Pan - jQuery Image Viewer](http://codecanyon.net/item/smooth-zoom-pan-jquery-image-viewer/511142)

## Installation

Clone the repository:

```
git clone git://github.com/morkai/walkner-isa.git
```

or [download](https://github.com/morkai/walkner-isa/zipball/master)
and extract it.

Go to the project's directory and install the dependencies:

```
cd walkner-isa/
npm install
```

Give write permissions to `var/uploads/` directory and all of its subdirectories:

```
chmod -R 0777 var/
```

## Configuration

TODO

## Start

If not yet running, start the MongoDB server.

Start the application server in a `development` or `production` environment:

  * under *nix:

    ```
    NODE_ENV=development node walkner-isa/backend/server.js
    ```

  * under Windows:

    ```
    SET NODE_ENV=development
    node walkner-isa/backend/server.js
    ```

Application should be available on a port defined in the `modules/httpServer.js` file
(`80` by default). Point the Internet browser to http://127.0.0.1/.

## License

This project is released under the
[NPOSL-3.0](https://raw.github.com/morkai/walkner-isa/master/license.md).
