/*
*          wrap XMLHttpRequest in a promise function
*
* var promise = new Promise(function(resolve, reject) {
*
*   if ( ) {
*    resolve("Stuff worked!");
*  }
*  else {
*    reject(Error("It broke"));
*  }
*  });
*/

(function () {
    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');
    let searchedForText;
    const responseContainer = document.querySelector('#response-container');
    let reqHeaders =  new Map();
    reqHeaders.set('Authorization','Client-ID 7ea30f97ca6d7ede1ff375ac191cf045dbd918f206f6cdabfcf8c214d85f993e');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        responseContainer.innerHTML = '';
        searchedForText = searchField.value;

        /*
        * req unplash images
        */
        let url = `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`;
        get(url,reqHeaders)
          .then(response => JSON.parse(response))
          .then(json => addImage(json))
          .catch(err => requestError(err,'Image'));

        /*
        *   new york time API
        *   Chaining promise getSon -> get 
        */
        const nytRequest = new XMLHttpRequest();
        const nytSearchKey = "72f579b41d55f0fac5b79ab556ba913f:1:73683129";
        url = `http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=${nytSearchKey}`;
        reqHeaders.clear();
        getJson(url,reqHeaders)
          .then(json => addArticles(json))
          .catch(err => requestError(err,'Articles'))

    });

    function get(url,reqHeaders) {
        return new Promise(function(resolve, reject) {
          var req = new XMLHttpRequest();
          req.open('GET', url);
          reqHeaders.forEach(function(value,key) {
            console.log(key,value);
            req.setRequestHeader(key,value);
          });
          req.onload = function() {
            if (req.status === 200) {
              resolve(req.response);
            } else {
              reject(Error(req.statusText));
            }
          };
          req.onerror = function() {
            reject(Error('Network Error'));
          };
          req.send();
        });
    }

    /* function returning a promise is a promise */

    function getJson( url, reqHeaders) {
      return get(url,reqHeaders)
      .then( response => JSON.parse(response))
    }

    function addImage(data) {
       let htmlContent = "";
       const image = data.results[0];
       htmlContent =
        `<figure> <img src="${image.urls.regular}" alt="${searchedForText}">
          <figcaption>${searchedForText} by ${image.user.name}</figcaption>
        </figure>`;
       responseContainer.insertAdjacentHTML('beforeend',htmlContent);
    }

    function addArticles(data) {
      let htmlContent = "";
      if ( data.response && data.response.docs && data.response.docs.length > 1) {
            htmlContent = '<ul>' + data.response.docs.map(article =>
              `<li class="article">
                  <h2> <a href="${article.web_url}"> ${article.headline.main}</a></h2>
                  <p> ${article.snippet}</p>
              </li>`).join('') + '</ul>';

      } else {
              htmlContent = '<div class="error-no-articles"> No articles available</div>';
      }
      responseContainer.insertAdjacentHTML('afterbegin',htmlContent);
    }

   function requestError(error, part) {
      let htmlContent = `<p class="network-earning-error">${error} ${part} </p>`
      responseContainer.insertAdjacentHTML('beforeend',htmlContent);
   }


})();
