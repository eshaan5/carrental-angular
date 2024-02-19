app.service("indexedDBService", function ($q) {
  this.checkObject = function () {
    var deferred = $q.defer();
    const request = indexedDB.open("carRental", 1);

    request.onerror = function (event) {
      deferred.reject(event.target.error);
    };

    request.onsuccess = function (event) {
      const db = event.target.result;
      console.log("Database opened successfully");
      deferred.resolve(db);
    };

    request.onupgradeneeded = function (event) {
      const db = event.target.result;
      console.log("upgrading database");
      createObjectStores(db)
        .then(() => deferred.resolve(db))
        .catch((error) => deferred.reject(error));
    };

    return deferred.promise;
  };

  function createObjectStores(db) {
    var deferred = $q.defer();
    var promises = [];

    // Checking and creating objectStore for users
    if (!db.objectStoreNames.contains("users")) {
      const userStore = db.createObjectStore("users", { keyPath: "username" });
      promises.push(createIndexes(userStore, ["id", "email"]));
    }

    // Checking and creating objectStore for cars
    if (!db.objectStoreNames.contains("cars")) {
      const carStore = db.createObjectStore("cars", { keyPath: "number" });
      promises.push(createIndexes(carStore, ["id"]));
    }

    // Checking and creating objectStore for bookings
    if (!db.objectStoreNames.contains("bookings")) {
      const bookingStore = db.createObjectStore("bookings", {
        keyPath: "id",
      });
      promises.push(createIndexes(bookingStore, ["id", "uid", "cid"]));
    }

    $q.all(promises)
      .then(() => deferred.resolve())
      .catch((error) => deferred.reject(error));

    return deferred.promise;
  }

  function createIndexes(store, indexNames) {
    var deferred = $q.defer();
    var createIndexPromises = indexNames.map(function (indexName) {
      return $q(function (resolve, reject) {
        const index = store.createIndex(indexName, indexName, { unique: false });
        index.onsuccess = function (event) {
          resolve();
        };
        index.onerror = function (event) {
          reject(event.target.error);
        };
      });
    });

    $q.all(createIndexPromises)
      .then(() => deferred.resolve())
      .catch((error) => deferred.reject(error));

    return deferred.promise;
  }

  this.getByKey = function (key, objectStore, indexName = null) {
    var deferred = $q.defer();
    const request = indexedDB.open("carRental", 1);

    request.onsuccess = function (event) {
      const db = event.target.result;

      if (!db.objectStoreNames.contains(objectStore)) {
        deferred.resolve({ email: "", username: "" });
        return;
      }

      const transaction = db.transaction(objectStore, "readonly");
      const data = transaction.objectStore(objectStore);

      let getRequest;
      if (indexName) {
        const index = data.index(indexName);
        getRequest = index.get(key);
      } else {
        getRequest = data.get(key);
      }

      getRequest.onsuccess = function (event) {
        deferred.resolve(event.target.result);
      };

      getRequest.onerror = function (event) {
        deferred.reject(event.target.error);
      };
    };

    request.onerror = function (event) {
      deferred.reject(event.target.error);
    };

    return deferred.promise;
  };

  this.getAllDocumentsByIndex = function (indexName, indexValue, objectStoreName) {
    const deferred = $q.defer();

    const request = indexedDB.open("carRental", 1);

    request.onsuccess = (event) => {
      const db = event.target.result;

      if (!db.objectStoreNames.contains(objectStoreName)) {
        deferred.reject(new Error(`Object store '${objectStoreName}' not found.`));
        return;
      }

      const transaction = db.transaction(objectStoreName, "readonly");
      const objectStore = transaction.objectStore(objectStoreName);
      const index = objectStore.index(indexName);
      const getAllRequest = index.getAll(indexValue);

      getAllRequest.onsuccess = (event) => {
        const documents = event.target.result;
        deferred.resolve(documents);
      };

      getAllRequest.onerror = (event) => {
        deferred.reject(event.target.error);
      };
    };

    request.onerror = (event) => {
      deferred.reject(event.target.error);
    };

    return deferred.promise;
  };

  this.addToDB = function (data, objectStore, key, operation = "add") {
    var deferred = $q.defer();
    const request = indexedDB.open("carRental", 1);

    request.onsuccess = function (event) {
      const db = event.target.result;
      const transaction = db.transaction(objectStore, "readwrite");
      const store = transaction.objectStore(objectStore);

      let addRequest;
      if (operation === "put") {
        addRequest = store.put(data);
      } else {
        addRequest = store.add(data);
      }

      transaction.oncomplete = function () {
        deferred.resolve(data);
      };

      transaction.onerror = function (event) {
        deferred.reject(event.target.error);
      };

      addRequest.onerror = function (event) {
        console.error("Error adding:", event.target.error);
      };
    };

    request.onerror = function (event) {
      deferred.reject(event.target.error);
    };

    return deferred.promise;
  };

  this.getAllDocuments = function (objectStoreName) {
    var deferred = $q.defer();
    const request = indexedDB.open("carRental", 1);

    request.onsuccess = function (event) {
      const db = event.target.result;

      if (!db.objectStoreNames.contains(objectStoreName)) {
        deferred.reject(new Error(`Object store '${objectStoreName}' not found.`));
        return;
      }

      const transaction = db.transaction(objectStoreName, "readonly");
      const objectStore = transaction.objectStore(objectStoreName);
      const getAllRequest = objectStore.getAll();

      getAllRequest.onsuccess = function (event) {
        const documents = event.target.result;
        deferred.resolve(documents);
      };

      getAllRequest.onerror = function (event) {
        deferred.reject(event.target.error);
      };
    };

    request.onerror = function (event) {
      deferred.reject(event.target.error);
    };

    return deferred.promise;
  };
});
