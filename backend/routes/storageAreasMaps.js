// Copyright (c) 2014, Łukasz Walukiewicz <lukasz@walukiewicz.eu>. Some Rights Reserved.
// Licensed under CC BY-NC-SA 4.0 <http://creativecommons.org/licenses/by-nc-sa/4.0/>.
// Part of the walkner-isa project <http://lukasz.walukiewicz.eu/p/walkner-isa>

var crypto = require('crypto');
var fs = require('fs');
var _ = require('underscore');
var step = require('step');
var gm = require('gm');

module.exports = function startStorageAreasMapsRoutes(app, done)
{
  app.get('/storageAreasMaps', browseStorageAreasMaps.bind(null, app));

  app.post('/storageAreasMaps', createStorageAreasMap.bind(null, app));

  app.get('/storageAreasMaps;add', showAddStorageAreasMapForm.bind(null, app));

  app.get('/storageAreasMaps/:id;edit', showEditStorageAreasMapForm.bind(null, app));

  app.get('/storageAreasMaps/:id;delete', showDeleteStorageAreasMapForm.bind(null, app));

  app.get('/storageAreasMaps/:id', viewStorageAreasMap.bind(null, app));

  app.get('/storageAreasMaps/:id/thumbnail', sendStorageAreasMapThumbnail.bind(null, app));

  app.get('/storageAreasMaps/:id/image', sendStorageAreasMapImage.bind(null, app));

  app.put('/storageAreasMaps/:id', updateStorageAreasMap.bind(null, app));

  app.del('/storageAreasMaps/:id', deleteStorageAreasMap.bind(null, app));

  app.post('/storageAreasMaps/:mapId/markers', createStorageAreasMapMarker.bind(null, app));

  app.put('/storageAreasMaps/:mapId/markers/:markerId', updateStorageAreasMapMarker.bind(null, app));

  app.del('/storageAreasMaps/:mapId/markers/:markerId', deleteStorageAreasMapMarker.bind(null, app));

  return done();
};

function browseStorageAreasMaps(app, req, res, next)
{
  var StorageAreasMap = app.db.model('StorageAreasMap');
  var criteria = {};
  var selector = {name: 1};
  var options = {
    sort: {name: 1}
  };

  StorageAreasMap.find(criteria, selector, options, function(err, storageAreasMaps)
  {
    if (err) return next(err);

    res.format({
      html: function()
      {
        res.render('storageAreasMaps/browse', {
          storageAreasMaps: storageAreasMaps
        });
      },
      json: function()
      {
        res.send({
          storageAreasMaps: storageAreasMaps
        });
      }
    });
  });
}

function showAddStorageAreasMapForm(app, req, res, next)
{
  var StorageAreasMap = app.db.model('StorageAreasMap');
  var storageAreasMap = new StorageAreasMap();

  res.format({
    html: function()
    {
      res.render('storageAreasMaps/add', {storageAreasMap: storageAreasMap});
    }
  });
}

function showEditStorageAreasMapForm(app, req, res, next)
{
  var StorageAreasMap = app.db.model('StorageAreasMap');

  StorageAreasMap.findById(req.params.id, function(err, storageAreasMap)
  {
    if (err)
    {
      return next(err);
    }

    if (storageAreasMap === null)
    {
      return res.send(404);
    }

    res.format({
      html: function()
      {
        res.render('storageAreasMaps/edit', {storageAreasMap: storageAreasMap});
      }
    });
  });
}

function showDeleteStorageAreasMapForm(app, req, res, next)
{
  var StorageAreasMap = app.db.model('StorageAreasMap');

  StorageAreasMap.findById(req.params.id, function(err, storageAreasMap)
  {
    if (err)
    {
      return next(err);
    }

    if (storageAreasMap === null)
    {
      return res.send(404);
    }

    res.format({
      html: function()
      {
        res.render('storageAreasMaps/delete', {storageAreasMap: storageAreasMap});
      }
    });
  });
}

function createStorageAreasMap(app, req, res, next)
{
  if (!hasImageFile(req))
  {
    return res.send(400, 'Image file is required');
  }

  var imageFile = req.files.image;
  var StorageAreasMap = app.db.model('StorageAreasMap');

  uploadImageAndThumbnail(StorageAreasMap, imageFile, function(err, file, width, height)
  {
    if (err)
    {
      return next(err);
    }

    var storageAreasMap = new StorageAreasMap({
      name: req.body.name,
      type: imageFile.type,
      file: file,
      width: width,
      height: height
    });

    storageAreasMap.save(function(err)
    {
      if (err)
      {
        return next(err);
      }

      res.format({
        html: function()
        {
          res.flash('success', 'Nowa mapa została pomyślnie dodana :)');
          res.redirect(303, '/storageAreasMaps/' + storageAreasMap.id);
        },
        json: function()
        {
          res.send(201, storageAreasMap);
        }
      });
    });
  });
}

function viewStorageAreasMap(app, req, res, next)
{
  var StorageAreasMap = app.db.model('StorageAreasMap');

  StorageAreasMap.fetchByIdWithMarkers(req.params.id, function(err, storageAreasMap)
  {
    if (err)
    {
      return next(err);
    }

    if (storageAreasMap === null)
    {
      return res.send(404);
    }

    res.format({
      html: function()
      {
        res.render('storageAreasMaps/view', {
          storageAreasMap: storageAreasMap,
          editable: req.query.mode === 'edit'
        });
      },
      json: function()
      {
        res.send(storageAreasMap);
      }
    });
  });
}

function updateStorageAreasMap(app, req, res, next)
{
  var StorageAreasMap = app.db.model('StorageAreasMap');

  StorageAreasMap.findById(req.params.id, function(err, storageAreasMap)
  {
    if (err)
    {
      return next(err);
    }

    if (storageAreasMap === null)
    {
      return res.send(404);
    }

    function saveStorageAreasMap(oldFile)
    {
      storageAreasMap.set({
        name: req.body.name
      });
      storageAreasMap.save(function(err)
      {
        if (err)
        {
          return next(err);
        }

        res.format({
          html: function()
          {
            res.flash('success', 'Pole odkładcze zostało pomyślnie zmodyfikowane :)');
            res.redirect(303, '/storageAreasMaps/' + storageAreasMap.id);
          },
          json: function()
          {
            res.send(storageAreasMap);
          }
        });

        if (_.isString(oldFile))
        {
          StorageAreasMap.removeImageAndThumbnail(oldFile);
        }
      });
    }

    if (!hasImageFile(req))
    {
      return saveStorageAreasMap();
    }

    var imageFile = req.files.image;

    uploadImageAndThumbnail(StorageAreasMap, imageFile, function(err, newFile, width, height)
    {
      if (err)
      {
        return next(err);
      }

      var oldFile = storageAreasMap.file;

      storageAreasMap.set({
        file: newFile,
        type: imageFile.type,
        width: width,
        height: height
      });

      return saveStorageAreasMap(oldFile);
    });
  });
}

function deleteStorageAreasMap(app, req, res, next)
{
  var StorageAreasMap = app.db.model('StorageAreasMap');

  StorageAreasMap.findById(req.params.id, function(err, storageAreasMap)
  {
    if (err)
    {
      return next(err);
    }

    if (storageAreasMap === null)
    {
      return res.send(404);
    }

    storageAreasMap.remove(function(err)
    {
      if (err)
      {
        return next(err);
      }

      res.format({
        html: function()
        {
          res.flash('success', 'Mapa została pomyślnie usunięta :)');
          res.redirect('/storageAreasMaps');
        },
        json: function()
        {
          res.send(204);
        }
      });
    });
  });
}

function sendStorageAreasMapThumbnail(app, req, res, next)
{
  var StorageAreasMap = app.db.model('StorageAreasMap');

  StorageAreasMap.findById(req.params.id, {file: 1, type: 1}, function(err, storageAreasMap)
  {
    if (err)
    {
      return next(err);
    }

    if (!storageAreasMap)
    {
      return res.send(404);
    }

    res.set('Content-Type', storageAreasMap.type);
    res.sendfile(storageAreasMap.thumbnailFilePath);
  });
}

function sendStorageAreasMapImage(app, req, res, next)
{
  var StorageAreasMap = app.db.model('StorageAreasMap');

  StorageAreasMap.findById(req.params.id, {file: 1, type: 1}, function(err, storageAreasMap)
  {
    if (err)
    {
      return next(err);
    }

    if (!storageAreasMap)
    {
      return res.send(404);
    }

    res.set('Content-Type', storageAreasMap.type);
    res.sendfile(storageAreasMap.imageFilePath);
  });
}

function hasImageFile(req)
{
  return _.isObject(req.files) && _.isObject(req.files.image) && req.files.image.size > 0;
}

function uploadImageAndThumbnail(StorageAreasMap, imageFile, done)
{
  if (!StorageAreasMap.isAllowedImageType(imageFile.type))
  {
    return done('Invalid file type');
  }

  var file = crypto
    .createHash('md5')
    .update(imageFile.name)
    .update(Date.now().toString())
    .digest('hex');

  file += '.' + StorageAreasMap.getExtensionByImageType(imageFile.type);

  step(
    function getImageDimensionsStep()
    {
      gm(imageFile.path).size(this);
    },
    function createThumbnailStep(err, size)
    {
      var next = this;

      if (err)
      {
        return next(err);
      }

      var w = Math.round(size.width * 200 / h);
      var h = 200;

      gm(imageFile.path)
        .resize(w, h)
        .write(StorageAreasMap.getImageThumbnailFilePath(file), function(err)
        {
          return next(err, size);
        });
    },
    function moveImageFileStep(err, size)
    {
      if (err)
      {
        return done(err);
      }

      fs.rename(imageFile.path, StorageAreasMap.getImageFilePath(file), function(err)
      {
        return done(err, file, size.width, size.height);
      });
    }
  );
}

function createStorageAreasMapMarker(app, req, res, next)
{
  var StorageAreasMapMarker = app.db.model('StorageAreasMapMarker');

  res.format({
    json: function()
    {
      var storageAreasMapMarker = new StorageAreasMapMarker(req.body);

      storageAreasMapMarker.set({
        storageAreasMapId: req.params.mapId
      });

      storageAreasMapMarker.save(function(err)
      {
        if (err)
        {
          return next(err);
        }

        res.format({
          json: function()
          {
            res.send(201, storageAreasMapMarker);
          }
        });
      });
    }
  });
}

function updateStorageAreasMapMarker(app, req, res, next)
{
  var StorageAreasMapMarker = app.db.model('StorageAreasMapMarker');

  StorageAreasMapMarker.findById(req.params.markerId, function(err, storageAreasMapMarker)
  {
    if (err)
    {
      return next(err);
    }

    if (!storageAreasMapMarker)
    {
      return res.send(404);
    }

    storageAreasMapMarker.set(req.body);
    storageAreasMapMarker.save(function(err)
    {
      if (err)
      {
        return next(err);
      }

      return res.send(storageAreasMapMarker);
    });
  });
}

function deleteStorageAreasMapMarker(app, req, res, next)
{
  var StorageAreasMapMarker = app.db.model('StorageAreasMapMarker');

  res.format({
    json: function()
    {
      StorageAreasMapMarker.findById(req.params.markerId, function(err, storageAreasMapMarker)
      {
        if (err)
        {
          return next(err);
        }

        if (storageAreasMapMarker === null)
        {
          return res.send(404);
        }

        storageAreasMapMarker.remove(function(err)
        {
          if (err)
          {
            return next(err);
          }

          return res.send(204);
        });
      });
    }
  });
}
