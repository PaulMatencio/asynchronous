(function(){

    var myWorker = new Worker("script/worker.js");
    var URL = window.URL || window.webkitURL;
    var images = document.getElementsByTagName("img");
    var dbName = "myIndexedDB";
    var storeName ="images";
    var index = 0;
    var img = images[index];
    let db = null;

    myWorker.onmessage = function(e) {
      if (e.data.image !== undefined)  {
          if (e.data.method == "get") {
            var objectURL = URL.createObjectURL(e.data.image);
            img.setAttribute('src', objectURL );
            img.onload = function() {
                window.URL.revokeObjectURL(this.src);
            }
            index++;
            img = images[index];
          }
      }
    }


    function postMessage(img) {
      var data   = {};
      var url    = img.dataset.src;
      var origin = new URL(url).origin;
      data.url   = url;
      data.path  = url.substr(origin.length);
      data.dbname    = dbName;
      data.store = storeName;
      data.method = "get";
      myWorker.postMessage(data);
    }

    for (i = 0; i < images.length; i++) {
      postMessage(images[i]);
    };


})();
