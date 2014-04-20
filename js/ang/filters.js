'use strict';

/* Filters */

angular.module('metroHotelDemo.filters', []).
        filter('encodeURIComponent', function() {
    return window.encodeURIComponent;
})
        .filter('decodeURIComponent', function() {
    return window.decodeURIComponent;
});;