'use strict';


// Declare app level module which depends on filters, and services
angular.module('metroHotelDemo', ['metroHotelDemo.filters',
    'metroHotelDemo.controllers', 'metroHotelDemo.services',
    'metroHotelDemo.directives', 'ui.bootstrap', 'ngResource', 'angles']).
        config(function($routeProvider, $httpProvider) {


    //top level root partials
    $routeProvider.when('/home', {templateUrl: 'partials/home.html'});
    $routeProvider.when('/activities', {templateUrl: 'partials/activities.html'});
    $routeProvider.when('/dinning', {templateUrl: 'partials/dinning.html'});
    $routeProvider.when('/flights', {templateUrl: 'partials/flights.html'});
    $routeProvider.when('/news', {templateUrl: 'partials/news.html'});
    $routeProvider.when('/coupons', {templateUrl: 'partials/coupons.html'});
    $routeProvider.when('/weather', {templateUrl: 'partials/weather.html'});
    $routeProvider.when('/transportation', {templateUrl: 'partials/transportation.html'});
 
    $routeProvider.when('/ads', {templateUrl: 'partials/anmas.html' });

    //transportation partials 
    $routeProvider.when('/directions', {templateUrl: 'partials/transport/directions.html'});

    $routeProvider.otherwise({redirectTo: '/home'});

});

