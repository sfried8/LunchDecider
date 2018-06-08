import { getOrCreateDatabase, getOrCreateCollection } from "./docdbUtils";

function TaskDao(documentDBClient, databaseId, collectionId) {
    this.client = documentDBClient;
    this.databaseId = databaseId;
    this.collectionId = collectionId;

    this.database = null;
    this.collection = null;
}

export default TaskDao;

TaskDao.prototype = {
    init: function(callback) {
        var self = this;

        getOrCreateDatabase(self.client, self.databaseId, function(
            err,
            db
        ) {
            if (err) {
                callback(err);
            } else {
                self.database = db;
                getOrCreateCollection(
                    self.client,
                    self.database._self,
                    self.collectionId,
                    function(err, coll) {
                        if (err) {
                            callback(err);
                        } else {
                            self.collection = coll;
                        }
                    }
                );
            }
        });
    },

    find: function(querySpec, callback) {
        var self = this;

        self.client
            .queryDocuments(self.collection._self, querySpec)
            .toArray(function(err, results) {
                if (err) {
                    callback(err);
                } else {
                    callback(null, results);
                }
            });
    },

    addItem: function(item, callback) {
        var self = this;

        item.added = Date.now();
        item.lastVisited = new Date(0);
        self.client.createDocument(self.collection._self, item, function(
            err,
            doc
        ) {
            if (err) {
                callback(err);
            } else {
                callback(null, doc);
            }
        });
    },

    updateItem: function(itemId, item, callback) {
        var self = this;

        self.getItem(itemId, function(err, doc) {
            if (err) {
                callback(err);
            } else {
                doc = { ...doc, ...item };

                self.client.replaceDocument(doc._self, doc, function(
                    err,
                    replaced
                ) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, replaced);
                    }
                });
            }
        });
    },

    getItem: function(itemId, callback) {
        var self = this;

        var querySpec = {
            query: "SELECT * FROM root r WHERE r.id = @id",
            parameters: [
                {
                    name: "@id",
                    value: itemId
                }
            ]
        };

        self.client
            .queryDocuments(self.collection._self, querySpec)
            .toArray(function(err, results) {
                if (err) {
                    callback(err);
                } else {
                    callback(null, results[0]);
                }
            });
    }
};
