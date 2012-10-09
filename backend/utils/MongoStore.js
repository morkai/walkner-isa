/**
 * @param {Store} Store
 * @return {function(new:MongoStore,Db,MongoStore.Options)}
 */
module.exports = function(Store)
{
  if (typeof Store === 'undefined')
  {
    Store = require('connect').session.Store;
  }

  /**
   * @constructor
   * @param {Db} db
   * @param {MongoStore.Options=} options
   */
  function MongoStore(db, options)
  {
    options = options || {};

    Store.call(this, options);

    /**
     * @private
     * @type {String}
     */
    this.collectionName = options.collectionName || 'sessions';

    /**
     * @private
     * @type {Boolean}
     */
    this.safe = options.safe === true;

    /**
     * @private
     * @type {Number}
     */
    this.gcInterval = (options.gcInterval || 600) * 1000;

    /**
     * @private
     * @type {?Number}
     */
    this.gcTimer = null;

    /**
     * @private
     * @type {Db}
     */
    this.db = db;

    /**
     * @private
     * @type {Function}
     */
    this.onOpen = this.onOpen.bind(this);

    /**
     * @private
     * @type {Function}
     */
    this.onClose = this.onClose.bind(this);

    this.db.on('open', this.onOpen);
    this.db.on('close', this.onClose);

    if (this.db.state === 'connected')
    {
      this.scheduleGc();
    }
  }

  /**
   * @type {Object}
   */
  MongoStore.Options = {
    /**
     * @type {String}
     */
    collectionName: 'sessions',

    /**
     * @type {Boolean}
     */
    safe: false,

    /**
     * @type {Number}
     */
    gcInterval: 600
  };

  MongoStore.prototype.__proto__ = Store.prototype;

  /**
   * @param {String} sid
   * @param {Function} done
   */
  MongoStore.prototype.get = function(sid, done)
  {
    var store = this;

    this.collection(function(err, sessions)
    {
      if (err)
      {
        return done(err);
      }

      sessions.findOne({_id: sid}, {data: 1}, function(err, doc)
      {
        if (err)
        {
          return done(err);
        }

        if (doc !== null)
        {
          var session = JSON.parse(doc.data);
          var expires = typeof session.cookie.expires === 'string'
            ? new Date(session.cookie.expires)
            : session.cookie.expires;

          if (!expires || new Date() < expires)
          {
            return done(null, session);
          }

          return store.destroy(sid, done);
        }

        return done();
      });
    });
  };

  /**
   * @param {String} sid
   * @param {Session} session
   * @param {Function=} done
   */
  MongoStore.prototype.set = function(sid, session, done)
  {
    var store = this;

    this.collection(function(err, sessions)
    {
      if (err)
      {
        return done && done(err);
      }

      var doc = {
        _id: sid,
        expires: Date.parse(session.cookie.expires),
        data: JSON.stringify(session)
      };

      var opts = {
        upsert: true,
        safe: store.safe
      };

      sessions.update({_id: sid}, doc, opts, function(err)
      {
        return done && done(err);
      });
    });
  };

  /**
   * @param {String} sid
   * @param {Function=} done
   */
  MongoStore.prototype.destroy = function(sid, done)
  {
    var store = this;

    this.collection(function(err, sessions)
    {
      if (err)
      {
        return done && done(err);
      }

      sessions.remove({_id: sid}, {safe: store.safe}, function(err)
      {
        return done && done(err);
      });
    });
  };

  /**
   * @param {Function=} done
   */
  MongoStore.prototype.clear = function(done)
  {
    var store = this;

    this.collection(function(err, sessions)
    {
      if (err)
      {
        return done && done(err);
      }

      sessions.drop(done);
    });
  };

  /**
   * @param {Function} done
   */
  MongoStore.prototype.length = function(done)
  {
    this.collection(function(err, sessions)
    {
      if (err)
      {
        return done(err);
      }

      sessions.count(done);
    });
  };

  /**
   * @param {Function=} done
   */
  MongoStore.prototype.gc = function(done)
  {
    this.collection(function(err, sessions)
    {
      if (err)
      {
        return done && done(err);
      }

      sessions.remove({expires: {$lte: Date.now()}}, done);
    });
  };

  MongoStore.prototype.destruct = function()
  {
    this.clearGcTimer();

    this.db.removeListener('open', this.onOpen);
    this.db.removeListener('close', this.onClose);
    this.db = null;
  };

  /**
   * @private
   * @param {Function} done
   */
  MongoStore.prototype.collection = function(done)
  {
    this.db.collection(this.collectionName, done);
  };

  /**
   * @private
   */
  MongoStore.prototype.onOpen = function()
  {
    this.scheduleGc();
  };

  /**
   * @private
   */
  MongoStore.prototype.onClose = function()
  {
    this.clearGcTimer();
  };

  /**
   * @private
   */
  MongoStore.prototype.clearGcTimer = function()
  {
    if (this.gcTimer !== null)
    {
      clearTimeout(this.gcTimer);
      this.gcTimer = null;
    }
  };

  /**
   * @private
   */
  MongoStore.prototype.scheduleGc = function()
  {
    var store = this;

    this.gcTimer = setTimeout(
      function()
      {
        store.gcTimer = null;
        store.gc(function() { store.scheduleGc(); });
      },
      this.gcInterval
    );
  };

  return MongoStore;
};
