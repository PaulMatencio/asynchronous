/* eslint-env jquery */

(function () {
    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');
    let searchedForText;
    const responseContainer = document.querySelector('#response-container');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        responseContainer.innerHTML = '';
        searchedForText = searchField.value;
        console.log("call ajax");
        $.ajax( {
          url: `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`,
          method: 'GET',
          headers: {
            Authorization: 'Client-ID 7ea30f97ca6d7ede1ff375ac191cf045dbd918f206f6cdabfcf8c214d85f993e'
          },
          "statusCode": {
            404: function() {
              alert("page not found");
            }
          }
        })
        .done(addImage)
        .fail(function(error){
          requestError(error,'Images');
        });


        const nytSearchKey = "72f579b41d55f0fac5b79ab556ba913f:1:73683129";
        $.ajax({
          url: `http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=${nytSearchKey}`
        })
        .done(addArticles)
        .fail(function(error){
          requestError(error,'Articles');
        });

    });


    function addImage(images) {
      console.log(images);
       let htmlContent = "";
       //  images.results.forEach( function(image) {
          const image = images.results[0];
          if (image) {
            htmlContent =
              `<figure> <img src="${image.urls.regular}" alt="${searchedForText}">
                  <figcaption>${searchedForText} by ${image.user.name}</figcaption>
              </figure>`;

         } else {
           htmlContent = '<div class="error-no-articles"> No image available</div>';
         }
          responseContainer.insertAdjacentHTML('beforeend',htmlContent);
     // })
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

    function requestError(error, part){
      let htmlContent = `<p class="network-earning-error">${error} ${part} </p>`
      responseContainer.insertAdjacentHTML('beforeend',htmlContent);
    }


})();
