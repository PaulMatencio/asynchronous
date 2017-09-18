importScripts('indexeddb.js');
let self = this;
self.db = null;

this.onmessage = function(e) {
  let url  = e.data.url;
  let path = e.data.path;
  let DB_NAME  = e.data.dbname;
  let DB_VERSION = 3;
  let STORE_NAME = e.data.store;
  if (e.data.method === "get") {
    let myHeaders = new Headers();
    let myInit = { method: 'GET',
      headers: myHeaders,
      mode: 'cors',
      cache: 'default'
    };

    let result = {
      method: "get"
    };
    /* Open indexed db */
    openIndexedDB(DB_NAME,DB_VERSION,STORE_NAME)
      .then(db =>  {
          self.db = db;
          getBlob(db,STORE_NAME,path) // blob from indexed db
            .then(blob => {
                console.log(blob, " is read from indexedDB",STORE_NAME,path);
                postMain(result,blob); // post teh main task
            })
            .catch(error => {
              console.log(error) ;
               fetchBlob(url,myInit) // Fetch the image from the internet
                .then(blob => {
                    console.log(blob, "is fetched from internet");
                    postMain(result,blob); // post the main task
                    // write to indexed DB
                    var data = {};
                    data.db = db ;
                    data.store = STORE_NAME;
                    data.path = path;
                    data.blob = blob;
                    putBlob(data)
                    .then( event => console.log(event.type))
                    .catch(event => console.log(event.type))
                })
                .catch( error => requestError(error,"fetch"))
             })

      })
      .catch( error =>  {
              requestError(error,'open index DB');
              fetchBlob(url,myInit).then(blob => postMain(result, blob));
      }) ;


  } //  get

} // on message


function fetchBlob(url,myInit) {
  return fetch(url,myInit)
  .then(function(response) {
    if (response.ok) {
      return response.blob();
    } else throw new Error(response.status);
    throw new Error("Error fetching") ;
    }
  )
}

function requestError(error, part) {
    console.log(error,part);
}

function postMain(result,blob) {
  result.image = blob;
  postMessage(result);
}
