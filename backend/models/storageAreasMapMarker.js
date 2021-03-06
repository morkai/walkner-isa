// Copyright (c) 2014, Łukasz Walukiewicz <lukasz@walukiewicz.eu>. Some Rights Reserved.
// Licensed under CC BY-NC-SA 4.0 <http://creativecommons.org/licenses/by-nc-sa/4.0/>.
// Part of the walkner-isa project <http://lukasz.walukiewicz.eu/p/walkner-isa>

var step = require('step');
var mongoose = require('mongoose');

module.exports = function setupStorageAreaModel(app, done)
{
  var storageAreasMapMarkerSchema = mongoose.Schema({
    storageAreasMapId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    type: {
      type: String,
      enum: ['text', 'storageArea']
    },
    value: {},
    x: {
      type: Number,
      required: true
    },
    y: {
      type: Number,
      required: true
    }
  });

  /**
   * @param {String} storageAreasMapId
   * @param {Function} done
   */
  storageAreasMapMarkerSchema.statics.fetchByMapId = function(storageAreasMapId, done)
  {
    var StorageArea = app.db.model('StorageArea');
    var StorageAreasMapMarker = this;

    StorageAreasMapMarker.find(
      {storageAreasMapId: mongoose.Types.ObjectId(storageAreasMapId)},
      {storageAreasMapId: 0},
      function(err, storageAreasMapMarkers)
      {
        if (err)
        {
          return done(err);
        }

        if (storageAreasMapMarkers.length === 0)
        {
          return done(null, []);
        }

        var parsedMarkers = parseFindMapMarkersResults(storageAreasMapMarkers);

        if (parsedMarkers.storageAreaMarkersIds.length === 0)
        {
          return done(null, parsedMarkers.textMarkers);
        }

        return findRelatedStorageAreasMapMarkers(parsedMarkers);
      }
    );

    function findRelatedStorageAreasMapMarkers(parsedMarkers)
    {
      StorageArea.find(
        {_id: {$in: parsedMarkers.storageAreaMarkersIds}},
        {name: 1},
        function(err, storageAreas)
        {
          if (err) return done(err);

          var markers = parsedMarkers.textMarkers;

          storageAreas.forEach(function(storageArea)
          {
            var marker = parsedMarkers.storageAreaMarkers[storageArea.id];
            marker.storageAreaName = storageArea.name;

            delete parsedMarkers.storageAreaMarkers[storageArea.id];

            markers.push(marker);
          });

          var markersIdsToDelete = Object.keys(parsedMarkers.storageAreaMarkers);

          process.nextTick(function()
          {
            deleteUnrelatedStorageAreaMarkers(storageAreasMapId, markersIdsToDelete);
          });

          return done(null, markers);
        }
      );
    }

    function parseFindMapMarkersResults(storageAreasMapMarkers)
    {
      var textMarkers = [];
      var storageAreaMarkers = {};
      var storageAreaMarkersIds = [];

      storageAreasMapMarkers.forEach(function(storageAreasMapMarker)
      {
        var marker = {
          id: storageAreasMapMarker.id,
          type: storageAreasMapMarker.type,
          x: storageAreasMapMarker.x,
          y: storageAreasMapMarker.y
        };

        if (marker.type === 'text')
        {
          marker.text = storageAreasMapMarker.value;

          textMarkers.push(marker);
        }
        else
        {
          marker.storageAreaId = storageAreasMapMarker.value.toString();
          marker.storageAreaName = null;

          storageAreaMarkersIds.push(marker.storageAreaId);
          storageAreaMarkers[marker.storageAreaId] = marker;
        }
      });

      return {
        textMarkers: textMarkers,
        storageAreaMarkers: storageAreaMarkers,
        storageAreaMarkersIds: storageAreaMarkersIds
      };
    }
  };

  /**
   * @param {String} mapId
   * @param {Array.<String>} markersIds
   */
  function deleteUnrelatedStorageAreaMarkers(mapId, markersIds)
  {
    var length = markersIds.length;

    if (length === 0)
    {
      return;
    }

    app.db.model('StorageAreaMapMarker').remove({_id: {$in: markersIds}}, function(err)
    {
      if (err)
      {
        console.error("Failed deleting %d unrelated markers from storage areas map %s: %s", length, mapId, err.stack || err);
      }
      else
      {
        console.info("Deleted %s unrelated markers from storage areas map %s", length, mapId);
      }
    });
  }

  app.db.model('StorageAreasMapMarker', storageAreasMapMarkerSchema);

  return done();
};
