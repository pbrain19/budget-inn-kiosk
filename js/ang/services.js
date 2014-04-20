'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('metroHotelDemo.services', []).
        factory('newsFeed', function($http) {
    return{
        parseFeed: function(url) {
            return $http.jsonp('//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=50&callback=JSON_CALLBACK&q=' + encodeURIComponent(url));
        }

    };



});