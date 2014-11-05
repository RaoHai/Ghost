// # Tag API
// RESTful API for the Tag resource
var Promise    = require('bluebird'),
    canThis    = require('../permissions').canThis,
    dataProvider = require('../models'),
    errors     = require('../errors'),
    tags;

/**
 * ## Tags API Methods
 *
 * **See:** [API Methods](index.js.html#api%20methods)
 */
tags = {
    /**
     * ### Browse
     * @param {{context}} options
     * @returns {Promise(Tags)}
     */
    browse: function browse(options) {
        return canThis(options.context).browse.tag().then(function () {
            return dataProvider.Tag.findPage(options).then(function (result) {
                return {tags: result.toJSON()};
            });
        }, function () {
            return Promise.reject(new errors.NoPermissionError('You do not have permission to browse tags.'));
        });
    },
    read: function read(options) {
        var attrs = ['id', 'slug'],
        data = _.pick(options, attrs);

        return dataProvider.Tag.findOne(data, options).then(function (result) {
            if (result) {
                return {tags: [result.toJSON()]};
            }

            return Promise.reject(new errors.NotFoundError('Tag not found.'));
        });
    }
};

module.exports = tags;
