// indexedDBService.js

app.service("indexedDBService", function () {
  // Function to check the IndexedDB database and create object stores if needed
  this.checkObject = function () {
    // Implementation...
    const request = indexedDB.open("carRental", 1);

    request.onerror = function (event) {
      console.error("Error opening database:", event.target.error);
    };

    request.onsuccess = function (event) {
      const db = event.target.result;
      console.log("Database opened successfully");

      // Perform any other operations you need with the opened database
    };

    request.onupgradeneeded = function (event) {
      const db = event.target.result;
      console.log("upgrading database");
      // Checking and creating objectStore for users
      if (!db.objectStoreNames.contains("users")) {
        const userStore = db.createObjectStore("users", { keyPath: "username" });
        // Create indexes or additional configuration if needed
        userStore.createIndex("id", "username", { unique: true });
        userStore.createIndex("email", "email", { unique: true });
      }

      // Checking and creating objectStore for cars
      if (!db.objectStoreNames.contains("cars")) {
        const carStore = db.createObjectStore("cars", { keyPath: "number" });
        carStore.createIndex("id", "number", { unique: true });
      }

      // Checking and creating objectStore for bookings
      if (!db.objectStoreNames.contains("bookings")) {
        const bookingStore = db.createObjectStore("bookings", {
          keyPath: "id",
        });
        bookingStore.createIndex("id", "id", { unique: true });
        bookingStore.createIndex("uid", "uid", { unique: false });
        bookingStore.createIndex("cid", "cid", { unique: false });
      }
    };
  };

  // Function to retrieve data from IndexedDB by key
  this.getByKey = function (key, objectStore, indexName = null) {
    // Implementation...
    return new Promise((resolve, reject) => {
      const request = indexedDB.open("carRental", 1);

      request.onsuccess = (event) => {
        const db = event.target.result;

        if (!db.objectStoreNames.contains(objectStore)) {
          resolve({ email: "", username: "" });
          return;
        }

        const transaction = db.transaction(objectStore, "readonly");
        const data = transaction.objectStore(objectStore);

        let request;
        if (indexName) {
          // If an indexName is provided, use it to query by email
          const index = data.index(indexName);
          request = index.get(key);
        } else {
          // Otherwise, query by key
          request = data.get(key);
        }

        request.onsuccess = (event) => {
          resolve(event.target.result);
        };

        request.onerror = (event) => {
          reject(event.target.error);
        };
      };

      request.onerror = (event) => {
        reject(event.target.error);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // If you need to create or upgrade object stores, do it here
        // For example:
        if (!db.objectStoreNames.contains(objectStore)) {
          db.createObjectStore(objectStore, { keyPath: "username" });
        }
      };
    });
  };

  // Function to add or update data in IndexedDB
  this.addToDB = function (data, objectStore, key, operation = "add") {
    // Implementation...
    return new Promise((resolve, reject) => {
      const request = indexedDB.open("carRental", 1);

      request.onsuccess = (event) => {
        console.log("Success...");
        const db = event.target.result;

        const transaction = db.transaction(objectStore, "readwrite");
        const store = transaction.objectStore(objectStore);

        let addRequest;
        if (operation === "put") {
          addRequest = store.put(data);
        } else {
          addRequest = store.add(data);
        }

        transaction.oncomplete = () => {
          console.log(transaction);
          resolve(data);
        };

        transaction.onerror = (event) => {
          reject(console.error("Transaction error:", event.target.error));
        };

        addRequest.onerror = (event) => {
          // Handle addRequest errors separately if needed
          console.error("Error adding:", event.target.error);
        };
      };

      request.onerror = (event) => {
        reject(console.error("Error opening IndexedDB:", event.target.error));
      };
    });
  };

  // Function to retrieve all documents from an object store in IndexedDB
  this.getAllDocuments = function (objectStoreName) {
    // Implementation...
    return new Promise((resolve, reject) => {
      const request = indexedDB.open("carRental", 1);

      request.onsuccess = (event) => {
        const db = event.target.result;

        if (!db.objectStoreNames.contains(objectStoreName)) {
          reject(new Error(`Object store '${objectStoreName}' not found.`));
          return;
        }

        const transaction = db.transaction(objectStoreName, "readonly");
        const objectStore = transaction.objectStore(objectStoreName);
        const getAllRequest = objectStore.getAll();

        getAllRequest.onsuccess = (event) => {
          const documents = event.target.result;
          resolve(documents);
        };

        getAllRequest.onerror = (event) => {
          reject(event.target.error);
        };
      };

      request.onerror = (event) => {
        reject(event.target.error);
      };
    });
  };
});
