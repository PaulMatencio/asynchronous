
/*

    https://davidwalsh.name/fetch

*/

(function () {
    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');
    let searchedForText;
    const responseContainer = document.querySelector('#response-container');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        responseContainer.innerHTML = '';
        searchedForText = searchField.value;
        let requestHeaders = new Headers();
        //  request for images
        requestHeaders.append('Authorization','Client-ID 7ea30f97ca6d7ede1ff375ac191cf045dbd918f206f6cdabfcf8c214d85f993e');
        let url = `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`;

        fetch(url,{
          headers: requestHeaders
        }).then( response => response.json())
          .then(addImage)
          .catch( error => requestError(error,'images'))


        // request for artickles

        const nytSearchKey = "72f579b41d55f0fac5b79ab556ba913f:1:73683129";
        url = `http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=${nytSearchKey}`  ;
        fetch(url ,{
          headers :  new Headers()
        }).then(response => response.json())
          .then (addArticles)
          .catch( error => requestError(error,'articles'))
    });

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
      console.log(error,part);
      let htmlContent = `<p class="network-earning-error">${error} ${part} </p>`
      responseContainer.insertAdjacentHTML('beforeend',htmlContent);
   }

})();
