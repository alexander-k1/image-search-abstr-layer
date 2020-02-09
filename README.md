Image search abstraction layer
=================

The app allows you to search for images on Pixabay on the route "/api/imagesearch/:term". The app returns an array of objects with the following properties: largeImageURL, pageURL and tags.

You can add "?offset=" parameter for pagination.

A request on the route "/api/latest/imagesearch/" returns the latest ten search requests.


Example usage:
------------

`/api/imagesearch/apples`


`/api/imagesearch/pears?offset=2`


`/api/latest/imagesearch/`


Example returns:
-------------------

`[{"largeImageURL":"https://pixabay.com/get/54e5d3414c53b108f5d084609629327f123adeec554c704c7d2e79d7934acc59_1280.jpg","pageURL":"https://pixabay.com/photos/apple-red-delicious-fruit-apple-256261/","tags":"apple, red, delicious"},...]`


`[{"largeImageURL":"https://pixabay.com/get/57e2d4404a56ad14f6da8c7dda79367b1438dbe55a576c4870277ad69448c75dba_1280.jpg","pageURL":"https://pixabay.com/photos/fruit-vitamins-health-sweet-1213041/","tags":"fruit, vitamins, health"},...]`


`[{"term":"pears","date":"2020-02-09T08:00:52.394Z"},{"term":"apples","date":"2020-02-09T07:53:11.639Z"},...]`
