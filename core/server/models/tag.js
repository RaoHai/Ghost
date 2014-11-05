var _              = require('lodash'),
    uuid           = require('node-uuid'),
    Promise        = require('bluebird'),
    ghostBookshelf = require('./base'),

    Tag,
    Tags;

Tag = ghostBookshelf.Model.extend({

    tableName: 'tags',

    saving: function (newPage, attr, options) {
         /*jshint unused:false*/

        var self = this;

        ghostBookshelf.Model.prototype.saving.apply(this, arguments);

        if (this.hasChanged('slug') || !this.get('slug')) {
            // Pass the new slug through the generator to strip illegal characters, detect duplicates
            return ghostBookshelf.Model.generateSlug(Tag, this.get('slug') || this.get('name'),
                {transacting: options.transacting})
                .then(function (slug) {
                    self.set({slug: slug});
                });
        }
    },

    posts: function () {
        return this.belongsToMany('Post');
    },

    toJSON: function (options) {
        var attrs = ghostBookshelf.Model.prototype.toJSON.call(this, options);

        attrs.parent = attrs.parent || attrs.parent_id;
        delete attrs.parent_id;

        return attrs;
    }
}, {
    permittedOptions: function (methodName) {
        var options = ghostBookshelf.Model.permittedOptions(),

            // whitelists for the `options` hash argument on methods, by method name.
            // these are the only options that can be passed to Bookshelf / Knex.
            validOptions = {
                findPage: ['page', 'limit']
            };

        if (validOptions[methodName]) {
            options = options.concat(validOptions[methodName]);
        }

        return options;
    },
    findPage: function (options) {

        options = options || {};

        var tagCollection = Tags.forge();

        if (options.limit) {
            options.limit = parseInt(options.limit, 10) || 15;
        }

        if (options.page) {
            options.page = parseInt(options.page, 10) || 1;
        }
        
        options = this.filterOptions(options, 'findPage');

        // Set default settings for options
        options = _.extend({
            page: 1, // pagination page
            limit: 15,
            where: {}
        }, options);

        return tagCollection
            .query('limit', options.limit)
            .query('offset', options.limit * (options.page - 1))
            .query('orderBy', 'status', 'ASC')
            .query('orderBy', 'published_at', 'DESC')
            .query('orderBy', 'updated_at', 'DESC')
            .fetch(_.omit(options, 'page', 'limit'));
    }
});

Tags = ghostBookshelf.Collection.extend({
    model: Tag
});

module.exports = {
    Tag: ghostBookshelf.model('Tag', Tag),
    Tags: ghostBookshelf.collection('Tags', Tags)
};
