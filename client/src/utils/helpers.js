export function pluralize(name, count) {
  if (count === 1) {
    return name
  }
  return name + 's'
}

export function idbPromise(storeName, method, object) {
  return new Promise((resolve, rejest) => {
    // open connection to the db'shop with version of 1
    const request = window.indexedDB.open('shop-shop', 1);

    // create variables to hold reference to the db, transaction (tx), run this method and create the 3 object stores
    let db, tx, store;
    request.onupgradeneeded = function(e) {
      const db = request.result;
      // create object store for each type of data and set 'primary' key index to be the '_id'  of the data
      db.createObjectStore('products', { keyPath: '_id' });
      db.createObjectStore('categories', { keyPath: '_id' });
      db.createObjectStore('cart', { keyPath: '_id' });
    };

    //handle any erroers with connecting
    request.onerror = function(e) {
      console.log(`There was an error: ${e}`);
    };

    // on db open success
    request.onsuccess = function(e) {
      // save a ref of the db to the `db` variable
      db = request.result;
      // open a transaction do whatever we pass into `storeName` (must match one of the object store names)
      tx = db.transaction(storeName, 'readwrite');
      // save a ref to that object store
      store = tx.objectStore(storeName);

        // if there's any errors, let us know
      db.onerror = function(e) {
        console.log('error', e);
      };

      switch (method) {
        case 'put':
          store.put(object);
          resolve(object);
          break;
        case 'get':
          const all = store.getAll();
          all.onsuccess = function() {
            resolve(all.result);
          };
          break;
        case 'delete':
          store.delete(object._id);
          break;
        default:
          console.log('No valid method');
          break;
      }

      // when the transaction is complete, close the connection
      tx.oncomplete = function() {
        db.close();
      };
   };
   });
}