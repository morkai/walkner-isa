// Copyright (c) 2014, Łukasz Walukiewicz <lukasz@walukiewicz.eu>. Some Rights Reserved.
// Licensed under CC BY-NC-SA 4.0 <http://creativecommons.org/licenses/by-nc-sa/4.0/>.
// Part of the walkner-isa project <http://lukasz.walukiewicz.eu/p/walkner-isa>

var util = require('util');
var _ = require('underscore');
var WorkingStorageArea = require('./WorkingStorageArea');

module.exports = function(app, done)
{
  var StorageArea = app.db.model('StorageArea');

  /**
   * @type {Object.<String,WorkingStorageArea>}
   */
  var workingStorageAreas = {};

  app.dashboard = {

    /**
     * @param {Function=} filter
     * @return {Array.<Object>}
     */
    getWorkingStorageAreas: function(filter)
    {
      var wsa = _.values(workingStorageAreas);

      if (_.isFunction(filter))
      {
        wsa = _.filter(workingStorageAreas, filter);
      }

      return _.invoke(wsa, 'toJSON');
    },

    /**
     * @return {Array.<Object>}
     */
    getLoadedStorageAreas: function()
    {
      var loadedStorageAreas = this.getWorkingStorageAreas(function(workingStorageArea)
      {
        return workingStorageArea.state === WorkingStorageArea.STATE_LOADED;
      });

      loadedStorageAreas.sort(function(a, b)
      {
        return b.loadTime - a.loadTime;
      });

      return loadedStorageAreas;
    },

    /**
     * @param {String} forkliftId
     * @return {WorkingStorageArea}
     */
    getUnloadingStorageArea: function(forkliftId)
    {
      return _.find(workingStorageAreas, function(workingStorageArea)
      {
        return workingStorageArea.state === WorkingStorageArea.STATE_UNLOADING
          && workingStorageArea.unloadingForklift.id === forkliftId;
      });
    },

    /**
     * @param {String} forkliftId
     * @return {Boolean}
     */
    isUnloadingForklift: function(forkliftId)
    {
      return _.isObject(this.getUnloadingStorageArea(forkliftId));
    },

    /**
     * @param {String} storageAreaId
     * @param {Function} done
     */
    markAsLoaded: function(storageAreaId, done)
    {
      var workingStorageArea = workingStorageAreas[storageAreaId];

      if (_.isUndefined(workingStorageArea))
      {
        return done(util.format("Storage area does not exist: %s", storageAreaId));
      }

      workingStorageArea.loaded(done);
    },

    /**
     * @param {String} storageAreaId
     * @param {Forklift} forklift
     * @param {Function} done
     */
    markAsUnloading: function(storageAreaId, forklift, done)
    {
      var workingStorageArea = workingStorageAreas[storageAreaId];

      if (_.isUndefined(workingStorageArea))
      {
        return done(util.format("Storage area does not exist: %s", storageAreaId));
      }

      var unloadingStorageArea = app.dashboard.getUnloadingStorageArea(forklift.id);

      if (_.isObject(unloadingStorageArea))
      {
        return done(util.format(
          "Forklift %s is already unloading the %s storage area",
          forklift.name,
          unloadingStorageArea.storageArea.name
        ));
      }

      workingStorageArea.unloading(forklift, done);
    },

    /**
     * @param {String} storageAreaId
     * @param {Function} done
     */
    markAsUnloaded: function(storageAreaId, done)
    {
      var workingStorageArea = workingStorageAreas[storageAreaId];

      if (_.isUndefined(workingStorageArea))
      {
        return done(util.format("Storage area does not exist: %s", storageAreaId));
      }

      workingStorageArea.unloaded(done);
    }

  };

  StorageArea.find().select('name').exec(function(err, storageAreas)
  {
    if (err) return done(err);

    storageAreas.forEach(function(storageArea)
    {
      workingStorageAreas[storageArea.id] = new WorkingStorageArea(storageArea);
    });

    return done();
  });
};
