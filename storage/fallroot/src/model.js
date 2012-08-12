function Database(options) {
    if (!options) {
        throw 'Options is required';
    }

    var name = options.name;

    if (!name) {
        throw 'Database name is required';
    }

    this.name = options.name;
    this.storage = new window[options.storage];
}

Database.prototype.model = function(options) {
    $.extend(options, {
        database: this
    });

    var model = new Model(options);

    return model;
};

function Model(options) {
    this.database = options.database;
    this.name     = options.name;
}

Model.prototype.save = function(data) {
    this.database.storage.save(this.name, data);
};

Model.prototype.all = function() {
    return this.database.storage.all();
};

function LocalStorage() {

}

LocalStorage.prototype.save = function(model, data) {
    localStorage.setItem(model, JSON.stringify(data));
}

LocalStorage.prototype.all = function(model) {
    var data = localStorage.getItem(model);
    console.log(data);
}

function IndexedDB() {
    this.initialized = false;
};

IndexedDB.prototype.init = function(model, callback) {
    var self = this,
        request = webkitIndexedDB.open(model);

    request.onsuccess = function(event) {
        self.db = event.target.result;
        self.db.createObjectStore(model, {keyPath: 'id', autoIncrement: true});
    }

    this.initialized = true;
};

IndexedDB.prototype.save = function(model, data) {
    if (!this.initialized) {
        this.init(model);
    }

    setTimeout(function() {
        var trans = this.db.transaction([model], webkitIDBTransaction.READ_WRITE, 0);
        var store = trans.objectStore(model);
        var request = store.put(data);

        request.onsuccess = function(event) {
            console.log(event);
        };

        request.onerror = function(event) {
            console.log(event);
        };
    }.bind(this), 100);
};
