var CACHE_VERSION = 2; // Increased version
var CURRENT_CACHES = {
  'offline-analytics': 'offline-analytics-v' + CACHE_VERSION
};

var IDB_DATABASE_NAME = 'offline-analytics'; // Name of the IndexedDB database
var IDB_STORE_NAME = 'put-requests'; // Name of the object store for PUT requests
var STOP_RETRYING_AFTER = 86400000; // One day, in milliseconds

// Function to open the IndexedDB database
function openIDBDatabase() {
  return new Promise(function(resolve, reject) {
    // Open the database
    var indexedDBOpenRequest = indexedDB.open(IDB_DATABASE_NAME, CACHE_VERSION);

    indexedDBOpenRequest.onerror = function(error) {
      reject(error);
    };

    indexedDBOpenRequest.onupgradeneeded = function(event) {
      var db = event.target.result;
      if (!db.objectStoreNames.contains(IDB_STORE_NAME)) {
        db.createObjectStore(IDB_STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    };

    indexedDBOpenRequest.onsuccess = function(event) {
      resolve(event.target.result);
    };
  });
}

self.addEventListener('sync', function(event) {
  if (event.tag === 'sync-put-requests') {
    event.waitUntil(replayPutRequests());
  }
});

self.addEventListener('fetch', function(event) {
  console.log('Handling fetch event for', event.request.url);

  event.respondWith(
    caches.open(CURRENT_CACHES['offline-analytics']).then(function(cache) {
      if (navigator.onLine) {
        // If the user is online, fetch directly from the network
        return fetch(event.request.clone())
          .then(function(response) {
            console.log('Response for %s from the network is: %O', event.request.url, response);
            if (response.status < 400) {
              cache.put(event.request, response.clone());
            }
            return response;
          })
          .catch(function(error) {
            console.error('Fetch failed:', error);
            // Log the error and handle it gracefully.
            // You can consider retrying the request or showing an error message to the user.
          });
      } else {
        // If the user is offline, store PUT requests in IndexedDB for later replay
        if (event.request.method === 'PUT') {
          console.log('Storing PUT request in IndexedDB to be replayed later.');
          savePutRequest(event.request);

          // Return a response indicating that the request has been stored for later replay
          return new Response(null, {
            status: 202,
            statusText: 'Accepted'
          });
        } else {
          // If not a PUT request and offline, try to serve from the cache
          return cache.match(event.request);
        }
      }
    })
  );
});

// Function to save a PUT request in IndexedDB
function savePutRequest(request) {
  // Clone the request to ensure it's safe to read when adding to the Queue.
  var clonedRequest = request.clone();
  return clonedRequest.text().then(function(body) {
    openIDBDatabase().then(function(db) {
      var transaction = db.transaction([IDB_STORE_NAME], 'readwrite');
      var objectStore = transaction.objectStore(IDB_STORE_NAME);
      var putRequest = objectStore.put({
        url: request.url,
        method: request.method,
        headers: Array.from(request.headers.entries()),
        body: body,
        timestamp: Date.now()
      });

      putRequest.onsuccess = function() {
        console.log('PUT request saved in IndexedDB.');
      };

      putRequest.onerror = function(error) {
        console.error('Failed to save PUT request in IndexedDB:', error);
      };
    });
  });
}

// Function to replay PUT requests
function replayPutRequests() {
  return openIDBDatabase().then(function(db) {
    var transaction = db.transaction([IDB_STORE_NAME], 'readonly');
    var objectStore = transaction.objectStore(IDB_STORE_NAME);
    return objectStore.getAll();
  }).then(function(storedRequests) {
    var storedRequestPromises = storedRequests.map(function(storedRequest) {
      var request = new Request(storedRequest.url, {
        method: storedRequest.method,
        headers: new Headers(storedRequest.headers),
        body: storedRequest.body,
        mode: 'no-cors'
      });

      console.log('Sending PUT request:', request); // Log when a request is being sent

      return fetch(request).then(function(response) {
        console.log('Received response for PUT request:', response); // Log when a response is received

        if (response.status < 400) {
          // If sending the PUT request was successful, then remove it from the IndexedDB.
          openIDBDatabase().then(function(db) {
            var transaction = db.transaction([IDB_STORE_NAME], 'readwrite');
            var objectStore = transaction.objectStore(IDB_STORE_NAME);
            objectStore.delete(storedRequest.id);
          });
        }
      });
    });

    return Promise.all(storedRequestPromises).catch(function(error) {
      console.error('Failed to send PUT:', error);
      throw error;
    });
  });
}

self.addEventListener('online', function(event) {
  self.registration.sync.register('sync-put-requests');
});


// var CACHE = {
// 	name: 'Application Cache',
// 	version: '1'
// };

// // Install service worker, adding all our cache entries
// self.addEventListener('install', function (event) {
// 	console.info('Event: Install');
// 	event.waitUntil(
// 		//precaching static resources without any plugin
// 		precacheAssets()
// 	);
// 	/*
// 	** check network state after certain time interval
// 	** If online for the first time, create an indexed db and a table
// 	** If online after going offline, hit all requests saved in indexed table to server and empty the table
// 	*/
// 	checkNetworkState();
// });

// self.addEventListener('fetch', function(event) {
//   if (event.request.cache === 'only-if-cached' && event.request.mode !== 'same-origin') {
//       return;
//   }
//   if (event.request.method === 'GET') {
//       if (event.request.url.includes('/prod') || event.request.mode !== 'cors') {
//           event.respondWith(fetchResponseFromCache(event.request));
//           return;
//       }
//       if (navigator.onLine) {
//           event.respondWith(cacheRequest(event.request));
//           console.log("caching request", event.request.url)
//       } else {
//           event.respondWith(
//               fetchResponseFromCache(event.request).catch(function() {
//                   return new Response(null, { status: 504, statusText: 'Gateway Timeout' });
//               })
//           );
//       }
//   }else {
// 		if (!navigator.onLine) {
//       var authHeader = event.request.headers.get('Authorization');
//       var reqUrl = event.request.url;
//       event.respondWith(
//           (async function () {
//               const payload = await event.request.text();
//               // Save offline requests to indexed db with the payload
//               console.log(payload);
//               saveIntoIndexedDb(reqUrl, authHeader, payload);
//               return new Response(null, { status: 504, statusText: 'Gateway Timeout' });
//           })()
//       );
//   }
// 	}
// });

// // Activate service worker
// self.addEventListener('activate', (event) => {
// 	console.info('Event: Activate');
// 	event.waitUntil(
// 		self.clients.claim(),
// 		caches.keys().then((cacheNames) => {
// 			return Promise.all(
// 				cacheNames.map((cache) => {
// 					if (cache !== CACHE.name + CACHE.version) {
// 						//delete all old caches or else new version of service worker won't get installed
// 						return caches.delete(cache);
// 					}
// 				})
// 			);
// 		})
// 	);
// });

// function checkNetworkState() {
// 	setInterval(function () {
// 		if (navigator.onLine) {
// 			sendOfflinePutRequestsToServer()
// 		}
// 	}, 3000);
// }

// function precacheAssets() {
//   // Define an array of assets to be precached
//   var assets = [
//       '/',
//       '/index.html',
//       // Add other static assets here
//       '/static/css/*.css',
//       '/static/js/*.js'

//   ];
//   event.waitUntil(
//       caches.open(CACHE.name + CACHE.version)
//           .then(function (cache) {
//               return cache.addAll(assets);
//           })
//   );
// }

// async function cacheResponse(cache, request, response, data) {
// 	var responseToCache;
// 	try {
// 		if (!request.url.includes('/static/') && request.mode === 'cors') {

// 			var responseData = await getResponseData(data)

// 			responseToCache = new Response(btoa(responseData), {
// 				headers: response.clone().headers
// 			})
// 		} else {
// 			responseToCache = response.clone()
// 		}
// 		cache.put(request, responseToCache);
// 	} catch (err) {
// 	}
// 	return response;
// }


// const cacheRequest = request => caches.open(CACHE.name + CACHE.version).then(cache =>

// 	fetch(request.clone(), {
// 		credentials: 'same-origin'
// 	})
// 		.then(response =>
// 			cacheResponse(cache, request.clone(), response, response.clone().text()))
// );

// const fetchResponseFromCache = (request, returnResponseData) =>
// 	caches.open(CACHE.name + CACHE.version).then(cache =>
// 		cache.match(request, { ignoreVary: true }).then(response => returnResponseFromCache(request, response, returnResponseData, cache))
// 	);

// async function returnResponseFromCache(request, response, returnResponseData, cache) {
//   console.log("request.url", request.url)
// 	if (response && request.mode === 'cors') {
// 		var responseData = await getResponseData(response.text())
//     console.log('returning response from cache')
// 		if (returnResponseData)
// 			return responseData
// 		response = new Response(atob(responseData), {
// 			headers: response.headers
// 		})
// 	}

// 	if (!!response) {
// 		return response;
// 	} else {
// 		console.log(request.url + ' not yet cached!')
// 		return fetch(request, { credentials: 'same-origin' }).then(response => cacheResponse(cache, request, response))
// 	}
// }

// async function getResponseData(data) {
// 	let promise = Promise.resolve(data).then((text) => {
// 		return text
// 	})
// 	let result = await promise;
// 	return result
// }

// async function sendOfflinePutRequestsToServer() {
// 	var request = indexedDB.open("TrayTrackingPutDB");
// 	request.onsuccess = function (event) {
// 		var db = event.target.result;
// 		var tx = db.transaction('putrequest', 'readwrite');
// 		var store = tx.objectStore('putrequest');
// 		var allRecords = store.getAll();
// 		allRecords.onsuccess = function () {

// 			if (allRecords.result && allRecords.result.length > 0) {

// 				var records = allRecords.result
// 				//make recursive call to hit fetch requests to server in a serial manner
// 				var resp = sendFetchRequestsToServer(
// 					fetch(records[0].url, {
// 						method: "put",
// 						headers: {
// 							'Accept': 'application/json',
// 							'Content-Type': 'application/json',
// 							'Authorization': records[0].authHeader
// 						},
// 						body: records[0].payload
// 					}), records[0].url, records[0].authHeader, records[0].payload, records.slice(1))

// 				for (var i = 0; i < allRecords.result.length; i++)
// 					store.delete(allRecords.result[i].id)
// 			}
// 		};
// 	}
// 	request.onupgradeneeded = function (event) {
// 		var db = event.target.result;
// 		db.onerror = function (event) {
// 			console.log("Why didn't you allow my web app to use IndexedDB?!");
// 		};

// 		var objectStore;
// 		if (!db.objectStoreNames.contains('putrequest')) {
// 			objectStore = db.createObjectStore("putrequest", { keyPath: 'id', autoIncrement: true });
// 		}
// 		else {
// 			objectStore = db.objectStoreNames.get('putrequest');
// 		}
// 	}
// }

// function saveIntoIndexedDb(url, authHeader, payload) {
//   console.log(payload);
//   var myRequest = {
//       url: url,
//       authHeader: authHeader,
//       payload: payload
//   };

//   // Check if payload is a valid JSON string before storing it
//   try {
//       JSON.parse(payload);
//   } catch (error) {
//       console.error("Invalid JSON payload:", error);
//       return; // Do not proceed if the payload is not valid JSON
//   }

//   var request = indexedDB.open("TrayTrackingPutDB");
//   request.onsuccess = function (event) {
//       var db = event.target.result;
//       var tx = db.transaction('putrequest', 'readwrite');
//       var store = tx.objectStore('putrequest');
//       store.add(myRequest);
//   }
// }


// async function sendFetchRequestsToServer(data, reqUrl, authHeader, payload, records) {

// 	let promise = Promise.resolve(data).then((response) => {

// 		console.log('Successfully sent request to server')
// 		if (records.length != 0) {

// 			sendFetchRequestsToServer(
// 				fetch(records[0].url, {
// 					method: "put",
// 					headers: {
// 						'Accept': 'application/json',
// 						'Content-Type': 'application/json',
// 						'Authorization': records[0].authHeader
// 					},
// 					body: records[0].payload
// 				}), records[0].url, records[0].authHeader, records[0].payload, records.slice(1))
// 		}
// 		return true
// 	}).catch((e) => {
// 		//fetch fails only in case of network error. Fetch is successful in case of any response code
// 		console.log('Exception while sending put request to server' + e)
// 		saveIntoIndexedDb(reqUrl, authHeader, payload)
// 	})
// }

// async function updateCacheForAParticularRequest(authHeader) {
//   var myRequest = new Request('request url whose cache needs to be updated');
//   myRequest.mode = 'cors';
//   myRequest.headers = new Headers({ 'Authorization': authHeader });

//   try {
//       const response = await fetch(myRequest);
//       const responseData = await response.text();

//       // Make updates to responseData if needed
//       const updatedResponse = new Response(btoa(responseData), {
//           headers: response.headers
//       });

//       caches.open(CACHE.name + CACHE.version)
//           .then(function (cache) {
//               cache.put(myRequest, updatedResponse);
//           });
//   } catch (error) {
//       console.error("Error updating cache for a particular request:", error);
//   }
// }
