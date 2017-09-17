(function () {
    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');
    let searchedForText;
    const responseContainer = document.querySelector('#response-container');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        responseContainer.innerHTML = '';
        searchedForText = searchField.value;

        /* unsplash API */
        const unsplashRequest = new XMLHttpRequest();
        unsplashRequest.open('GET', `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`);
        // 'https://api.unsplash.com/search/photos?page=1&query=flower'
        unsplashRequest.onload = addImage;
        unsplashRequest.onerror = function(err) {
          requestError(err,"image");
        }
        unsplashRequest.setRequestHeader('Authorization', 'Client-ID 7ea30f97ca6d7ede1ff375ac191cf045dbd918f206f6cdabfcf8c214d85f993e');
        unsplashRequest.send();

        /* new york time API */
        const nytRequest = new XMLHttpRequest();
        // const nytSearchKey = "befcd9ed183aa5edba4a379ed537e27f:10:73683129";
        const nytSearchKey = "72f579b41d55f0fac5b79ab556ba913f:1:73683129";
        nytRequest.open('GET', `http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=${nytSearchKey}`);
        nytRequest.onload = addArticles;

        nytRequest.onerror = function(err) {
          requestError(err,"nyt");
        }

        nytRequest.send();

    });

    function addImage() {
       let htmlContent = "";
       const data = JSON.parse(this.responseText);
       // data.results.forEach( function(image) {
           const image = data.results[0];
           htmlContent =
            `<figure> <img src="${image.urls.regular}" alt="${searchedForText}">
                <figcaption>${searchedForText} by ${image.user.name}</figcaption>
            </figure>`;
           responseContainer.insertAdjacentHTML('beforeend',htmlContent);
      //  })
    }

    function addArticles() {
      let htmlContent = "";
      let data = JSON.parse(this.responseText);
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
       console.log(error,part);
       let htmlContent = `<p class="network-earning-error">${error} ${part} </p>`
       responseContainer.insertAdjacentHTML('beforeend',htmlContent);
    }

})();
