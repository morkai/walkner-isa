// Copyright (c) 2014, Łukasz Walukiewicz <lukasz@walukiewicz.eu>. Some Rights Reserved.
// Licensed under CC BY-NC-SA 4.0 <http://creativecommons.org/licenses/by-nc-sa/4.0/>.
// Part of the walkner-isa project <http://lukasz.walukiewicz.eu/p/walkner-isa>

var util = require('util');

module.exports = WorkingStorageArea;

/**
 * @constructor
 * @param {StorageArea} storageArea
 */
function WorkingStorageArea(storageArea)
{
  /**
   * @readonly
   * @type {StorageArea}
   */
  this.storageArea = storageArea;

  /**
   * @readonly
   * @type {String}
   */
  this.state = WorkingStorageArea.STATE_UNLOADED;

  /**
   * @readonly
   * @type {?Forklift}
   */
  this.unloadingForklift = null;

  /**
   * @readonly
   * @type {Number}
   */
  this.loadTime = 0;

  /**
   * @readonly
   * @type {Number}
   */
  this.unloadingTime = 0;
}

WorkingStorageArea.STATE_UNLOADED = 'unloaded';
WorkingStorageArea.STATE_LOADED = 'loaded';
WorkingStorageArea.STATE_UNLOADING = 'unloading';

/**
 * @return {Object}
 */
WorkingStorageArea.prototype.toJSON = function()
{
  var storageArea;
  var unloadingForklift;

  storageArea = this.storageArea.toJSON();
  storageArea.id = storageArea._id.toString();
  delete storageArea._id;

  if (this.unloadingForklift !== null)
  {
    unloadingForklift = this.unloadingForklift.toJSON();
    unloadingForklift.id = unloadingForklift._id.toString();
    delete unloadingForklift._id;
  }

  return {
    state: this.state,
    storageArea: storageArea,
    unloadingForklift: unloadingForklift,
    loadTime: Date.now() - this.loadTime,
    unloadingTime: Date.now() - this.unloadingTime
  };
};

/**
 * @param {Function} done
 */
WorkingStorageArea.prototype.loaded = function(done)
{
  if (this.state !== WorkingStorageArea.STATE_UNLOADED)
  {
    return done(util.format(
      "Expected the working storage area %s to be in the %s state. Actual state: %s",
      this.storageArea.name,
      WorkingStorageArea.STATE_UNLOADED,
      this.state
    ));
  }

  this.state = WorkingStorageArea.STATE_LOADED;
  this.loadTime = Date.now();

  return done();
};

/**
 * @param {Forklift} forklift
 * @param {Function} done
 */
WorkingStorageArea.prototype.unloading = function(forklift, done)
{
  if (this.state !== WorkingStorageArea.STATE_LOADED)
  {
    return done(util.format(
      "Expected the working storage area %s to be in the %s state. Actual state: %s",
      this.storageArea.name,
      WorkingStorageArea.STATE_LOADED,
      this.state
    ));
  }

  this.state = WorkingStorageArea.STATE_UNLOADING;
  this.unloadingForklift = forklift;
  this.unloadingTime = Date.now();

  return done();
};

/**
 * @param {Function} done
 */
WorkingStorageArea.prototype.unloaded = function(done)
{
  if (this.state !== WorkingStorageArea.STATE_UNLOADING)
  {
    return done(util.format(
      "Expected the working storage area %s to be in the %s state. Actual state: %s",
      this.storageArea.name,
      WorkingStorageArea.STATE_UNLOADING,
      this.state
    ));
  }

  this.state = WorkingStorageArea.STATE_UNLOADED;
  this.unloadingForklift = null;
  this.loadTime = 0;
  this.unloadingTime = 0;

  return done();
};
