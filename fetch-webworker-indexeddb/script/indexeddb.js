 // function to open indexdb
function openIndexedDB(dbname, store) {
    return new Promise (
      function(resolve,reject) {
        var dbRequest = indexedDB.open(dbname,3) ;
        dbRequest.onerror = function(e) {
          reject(Error("error Opening indexedDB"));
        };
        dbRequest.onsuccess = function(e) {
          db =  this.result;
          console.log("Open and connected");
          resolve(db);
        };
        dbRequest.onupgradeneeded = function(e) {
          console.log("create store");
          var objectStore =  createStore(this.result, store);
          if (!objectStore) {
            reject(Error("Can't create Object store"));
          }
        };
     }
  );
}

// function to put blob
function putBlob(data) {
   var  transaction = data.db.transaction([data.store], "readwrite");
   var object =
   {
     path : data.path,
     image : data.blob
   }
   return new Promise(function(resolve,reject) {
       var putRequest = transaction.objectStore(data.store).put(object);
       putRequest.onsuccess = function(event) {
          resolve(event);
       }
       putRequest.onerror = function(event) {
          reject(event);
       }
   })
}

// function to get blob
function getBlob(db, store, path) {
      return new Promise(function(resolve,reject) {
        var  transaction = db.transaction([store], "readonly");
        var  getRequest = transaction.objectStore(store).get(path);
        getRequest.onsuccess = function(event) {
             if (event.target.result == undefined) reject(undefined)
             else  resolve(event.target.result.image);
        }
        getRequest.onerror = function(event) {
          reject(undefined);
        }
      })
}

function createStore(db,storeName) {
     var  objectStore = db.createObjectStore(storeName, { keyPath: "path" });
     return objectStore;
}
