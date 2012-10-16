// TODO: Move to config file
var PATH_TO_MAP_IMAGES = __dirname + '/../../var/uploads/maps';
var ALLOWED_IMAGE_TYPES = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/gif': 'gif'
};

var fs = require('fs');
var path = require('path');
var mongoose = require('mongoose');

module.exports = function setupStorageAreaModel(app, done)
{
  var storageAreasMapSchema = mongoose.Schema({
    name: {
      type: String,
      trim: true,
      required: true
    },
    file: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: Object.keys(ALLOWED_IMAGE_TYPES),
      required: true
    },
    width: {
      type: Number
    },
    height: {
      type: Number
    }
  });

  storageAreasMapSchema.virtual('imageFilePath').get(function()
  {
    return app.db.model('StorageAreasMap').getImageFilePath(this.file);
  });

  storageAreasMapSchema.virtual('thumbnailFilePath').get(function()
  {
    return app.db.model('StorageAreasMap').getImageThumbnailFilePath(this.file);
  });

  storageAreasMapSchema.post('remove', function()
  {
    app.db.model('StorageAreasMap').removeImageAndThumbnail(this.file);

    app.db.model('StorageAreasMapMarker').remove({storageAreaId: this._id})
  });

  /**
   * @param {String} type
   * @return {Boolean}
   */
  storageAreasMapSchema.statics.isAllowedImageType = function(type)
  {
    return typeof type === 'string' && type in ALLOWED_IMAGE_TYPES;
  };

  /**
   * @param {String} type
   * @return {String|undefined}
   */
  storageAreasMapSchema.statics.getExtensionByImageType = function(type)
  {
    return ALLOWED_IMAGE_TYPES[type];
  };

  /**
   * @param {String} file
   * @return {String}
   */
  storageAreasMapSchema.statics.getImageFilePath = function(file)
  {
    return path.resolve(PATH_TO_MAP_IMAGES, file);
  };

  /**
   * @param {String} file
   * @return {String}
   */
  storageAreasMapSchema.statics.getImageThumbnailFilePath = function(file)
  {
    var dotPos = file.lastIndexOf('.');

    if (dotPos === -1)
    {
      file += '.min';
    }
    else
    {
      file = file.substr(0, dotPos) + '.min' + file.substr(dotPos);
    }

    return this.getImageFilePath(file);
  };

  /**
   * @param {String} storageAreasMapId
   * @param {Function} done
   */
  storageAreasMapSchema.statics.fetchByIdWithMarkers = function(storageAreasMapId, done)
  {
    var StorageAreasMap = this;
    var StorageAreasMapMarker = app.db.model('StorageAreasMapMarker');

    StorageAreasMap.findById(storageAreasMapId, function(err, map)
    {
      if (err) return done(err);

      if (!map) return done(null, null);

      StorageAreasMapMarker.fetchByMapId(storageAreasMapId, function(err, markers)
      {
        if (err) return done(err);

        map = map.toObject();
        map.id = map._id.toString();
        map.markers = markers;

        delete map._id;

        return done(null, map);
      });
    });
  };

  /**
   * @param {String} file
   */
  storageAreasMapSchema.statics.removeImageAndThumbnail = function(file)
  {
    fs.unlink(this.getImageFilePath(file), function(err)
    {
      if (err)
      {
        console.error('Failed to remove the image file %s: %s', file, err.stack);
      }
    });

    fs.unlink(this.getImageThumbnailFilePath(file), function(err)
    {
      if (err)
      {
        console.error('Failed to remove the image thumbnail file %s: %s', file, err.stack);
      }
    });
  };

  app.db.model('StorageAreasMap', storageAreasMapSchema);

  return done();
};
