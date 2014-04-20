'use strict';
/* Controllers */

angular.module('metroHotelDemo.controllers', []).
        controller('activitiesEventCTRL', function($scope, $window, $http) {
            ga('send', 'pageview', 'activities Page');
            //This tells us that we want to access all the buttons inside the "filters" class.
            $('.filters > button').click(function() {
                //we store this in a variable just to make sure it gets a value before sending it
                var item = $(this).text();
                ga('send', 'event', 'activities', 'filter clicked', item);

            });

            $scope.items = [];
            $scope.BI = [];
            $scope.apikey = '79ae59a1e073e9b6b9ac862c3be5caaa';
            $scope.call = 'http://api.v1.trippinin.com/GeoSearch/';

            $scope.tab = 'insight';

            var m = new mandrill.Mandrill('C7LDjR0CdMlYzu12b4zGEg');

// create a variable for the API call parameters
            $scope.params = {
                "message": {
                    "from_email": "Sales@metroclick.com",
                    "to": [{"email": $scope.userEmail}],
                    "subject": "Mobile Directions",
                    "text": "I'm learning the Mandrill API at Codecademy."
                }
            };
            $scope.sendTheMail = function() {
// Send the email!
                $scope.params.message.to = [{"email": $('#usermail').val()}];
                $scope.params.message.text = "Thank you for registering with us the link to the map for your mobile phone is " + $scope.maplink;
                $scope.params.message.autotext = true;


                m.messages.send($scope.params, function(res) {
                    console.log(res);
                    $scope.mailSent = true;
                }, function(err) {
                    console.log(err);
                    $scope.mailSent = true;
                });
            };

            $window.navigator.geolocation.getCurrentPosition(function(position) {

                $scope.cord = position.coords;
                var cord = position.coords;

                $scope.surroundings = $scope.call + cord.latitude + ',' + cord.longitude + '/outdoor/saturday/evening?KEY=' + $scope.apikey;

                $scope.realCall = $scope.surroundings + '&radius=5000&limit=20';

                $scope.makeCall($scope.realCall);
                $scope.makeCall($scope.realCall + '&offset=20');
                $scope.makeCall($scope.realCall + '&offset=40');

            });

            $scope.makeCall = function(call) {
                $.ajax({
                    type: 'GET',
                    url: call,
                    success: function(result) {
                        // display some textual details about the flight.


                        result.response.data.forEach(function(element) {
                            console.log(element);
                            $scope.$apply(function() {
                                $scope.items.push(element);

                            });

                        });
                    },
                    dataType: 'json'
                });

            };

            $scope.getSocialInfo = function(POI) {
                $scope.apicall = 'http://api.v1.trippinin.com/resolve/' + POI.title + '?coordinates=' + POI.latitude + ',' + POI.longitude + '&KEY=' + $scope.apikey;
                $scope.max = 10;
                var query = $scope.cord.latitude + ',' + $scope.cord.longitude + '+to+' + POI.latitude + ',' + POI.longitude;

                $scope.qrcode = 'https://maps.google.com/maps?q=' + encodeURIComponent(query);
                $scope.maplink = 'https://maps.google.com/maps?q=' + query;

                $http.get($scope.apicall).success(function(data) {

                    $scope.siteTarget = data.response.data;
                    console.log($scope.siteTarget);
                    $scope.barStats = data.response.data.dailyrating;

                    angular.forEach($scope.barStats, function(value, index) {
                        var temp = 0;

                        value.dailyRanking.forEach(function(element) {

                            temp += element.Level;

                        });
                        $scope.BI.push(temp / 5);
                    });


                });

            };


            $scope.open = function(tar) {

                ga('send', 'event', 'activities', 'activity clicked', tar.title);
                ga('send', 'pageview', 'activity modal');

                $scope.tab = 'insight';
                $scope.getSocialInfo(tar);
                //console.log(tar.title);

                $scope.shouldBeOpen = true;
                $scope.options = {
                    scaleFontStyle: "normal",
                    scaleOverlay: false,
                    scaleShowLabels: false,
                    scaleShowGridLines: false,
                    barDatasetSpacing: 1,
                    scaleFontFamily: "'tahoma'"
                };
                $scope.chart = {
                    labels: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                    datasets: [
                        {
                            fillColor: '#200fe2',
                            strokeColor: "Black",
                            data: $scope.BI
                        }
                    ]
                };


                $scope.dir = function() {

                    navigator.geolocation.getCurrentPosition(findLocation);


                    function findLocation(position)
                    {
                        $scope.$apply(function() {
                            $scope.cord = position.coords;
                        });
                        $scope.getDirection();
                    }
                    ;

                    $scope.getDirection = function() {
                        $("#map-canvas").gmap3();
                        $("#map-canvas").gmap3('clear');
                        $scope.panel = "directions";


                        $("#map-canvas").gmap3(
                                {
                                    getroute: {
                                        options: {
                                            origin: [$scope.cord.latitude, $scope.cord.longitude],
                                            destination: [$scope.siteTarget.latitude, $scope.siteTarget.longitude],
                                            travelMode: google.maps.DirectionsTravelMode.TRANSIT
                                        },
                                        callback: function(results) {
                                            if (!results)
                                                return;
                                            $(this).gmap3({
                                                directionsrenderer: {
                                                    container: $('#directionsHolder'),
                                                    options: {
                                                        directions: results
                                                    }
                                                }
                                            });
                                        }
                                    },
                                    autofit: {}
                                }

                        );

                    };


                };


            };




            $scope.close = function() {
                ga('send', 'pageview', 'activities Page');
                $scope.shouldBeOpen = false;

                $scope.BI = [];
            };
            $scope.opts = {
                backdropFade: true,
                dialogFade: true
            };
        }).controller('couponsEventsCTRL', function($scope) {
    //ga('send', 'pageview', 'couponsEvents');

    $scope.open = function(tar) {

        $scope.siteTarget = tar;
        $scope.shouldBeOpen = true;
    };
    $scope.close = function() {

        $scope.shouldBeOpen = false;
    };
    $scope.opts = {
        backdropFade: true,
        dialogFade: true
    };
}).controller('newsCTRL', function($scope, newsFeed) {
    ga('send', 'pageview', 'news Page');
    $scope.feedSrc = 'http://rss.cnn.com/rss/cnn_topstories.rss';
    newsFeed.parseFeed($scope.feedSrc).then(function(res) {
        console.log(res);
        $scope.feeds = res.data.responseData.feed.entries;
    });
    $scope.open = function(tar) {

        ga('send', 'event', 'news', 'news article clicked', tar.title);

        $scope.siteTarget = tar;
        $scope.shouldBeOpen = true;
    };
    $scope.close = function() {
        ga('send', 'pageview', 'news Page');
        $scope.shouldBeOpen = false;
    };
    $scope.opts = {
        backdropFade: true,
        dialogFade: true
    };
}).controller("weather", function($scope, $window) {
    ga('send', 'pageview', 'weather Page');
    $scope.url = "http://api.wunderground.com/api/80cc3c5c83621a9a/forecast/q/New_York/New_York.json";

    $scope.forecasts = "";
    $.ajax({
        url: $scope.url,
        dataType: "jsonp",
        success: function(parsed_json) {
            $scope.weather = parsed_json;
            $scope.$apply(function() {
                $scope.forecasts = $scope.weather.forecast.simpleforecast.forecastday;
                $scope.textforcasts = $scope.weather.forecast.txt_forecast.forecastday;
            });
        }
    });

}).controller('flightsCTRL', function($scope, $http) {
    ga('send', 'pageview', 'flights Page');
    $scope.flightControl = "arriving";
    var fxml_url = 'http://danadadush:607b262a53cf87a774e09402a2e9d0cc0cc5cbbc@flightxml.flightaware.com/json/FlightXML2/';

    $.ajax({
        type: 'GET',
        url: fxml_url + 'Scheduled',
        data: {'airport': 'JFK', 'howMany': 14, 'offset': 0},
        success: function(result) {
            // display some textual details about the flight.
            $scope.departing = result.ScheduledResult.scheduled;
        },
        error: function(data, text) {
            console.log(data, text);
        },
        dataType: 'jsonp',
        jsonp: 'jsonp_callback',
        xhrFields: {withCredentials: true}
    });

    $.ajax({
        type: 'GET',
        url: fxml_url + 'Enroute',
        data: {'airport': 'JFK', 'howMany': 14, 'offset': 0},
        success: function(result) {
            // display some textual details about the flight.

            $scope.$apply(function() {
                $scope.arriving = result.EnrouteResult.enroute;
            });
            console.log(result.EnrouteResult.enroute);
        },
        error: function(data, text) {
            console.log(data, text);
        },
        dataType: 'jsonp',
        jsonp: 'jsonp_callback',
        xhrFields: {withCredentials: true}
    });


    $('#flightsearch').on('change keypress paste focus textInput input', function() {
        $scope.$apply(function() {

            $scope.search = $('#flightsearch').val();

        })
        console.log($('#flightsearch').val())
    })

}).controller('dinningCTRL', function($scope, $http, $window) {

    ga('send', 'pageview', 'dining Page');
    //This tells us that we want to access all the buttons inside the "filters" class.
    $('.filters > button').click(function() {
        //we store this in a variable just to make sure it gets a value before sending it
        var item = $(this).text();
        ga('send', 'event', 'dining', 'filter clicked', item);

    });

    $scope.items = [];
    $scope.BI = [];
    $scope.apikey = '79ae59a1e073e9b6b9ac862c3be5caaa';
    $scope.call = 'http://api.v1.trippinin.com/GeoSearch/';

    $scope.tab = 'insight';



    var m = new mandrill.Mandrill('C7LDjR0CdMlYzu12b4zGEg');

// create a variable for the API call parameters
    $scope.params = {
        "message": {
            "from_email": "Sales@metroclick.com",
            "to": [{"email": $scope.userEmail}],
            "subject": "Mobile Directions",
            "text": "I'm learning the Mandrill API at Codecademy."
        }
    };
    $scope.sendTheMail = function() {
// Send the email!
        $scope.params.message.to = [{"email": $('#usermail').val()}];
        $scope.params.message.text = "Thank you for registering with us the link to the map for your mobile phone is " + $scope.maplink;
        $scope.params.message.autotext = true;


        m.messages.send($scope.params, function(res) {
            console.log(res);
            $scope.mailSent = true;
        }, function(err) {
            console.log(err);
            $scope.mailSent = true;
        });
    }


    $window.navigator.geolocation.getCurrentPosition(function(position) {
        $scope.cord = position.coords;

        var cord = position.coords;

        $scope.surroundings = $scope.call + cord.latitude + ',' + cord.longitude + '/eat/saturday/evening?KEY=' + $scope.apikey;

        $scope.realCall = $scope.surroundings + '&radius=1000&limit=20';
        $scope.makeCall($scope.realCall);
        $scope.makeCall($scope.realCall + '&offset=20');
        $scope.makeCall($scope.realCall + '&offset=40');




    });


    $scope.makeCall = function(call) {
        $.ajax({
            type: 'GET',
            url: call,
            success: function(result) {
                // display some textual details about the flight.


                result.response.data.forEach(function(element) {
                    console.log(element);
                    $scope.$apply(function() {
                        $scope.items.push(element);

                    });

                });

                console.log($scope.items)
            },
            dataType: 'json'
        });

    };
    $scope.getSocialInfo = function(POI) {
        $scope.apicall = 'http://api.v1.trippinin.com/resolve/' + POI.title + '?coordinates=' + POI.latitude + ',' + POI.longitude + '&KEY=' + $scope.apikey;
        $scope.max = 10;
        var query = $scope.cord.latitude + ',' + $scope.cord.longitude + '+to+' + POI.latitude + ',' + POI.longitude;

        $scope.qrcode = 'https://maps.google.com/maps?q=' + encodeURIComponent(query);
        $scope.maplink = 'https://maps.google.com/maps?q=' + query;

        $http.get($scope.apicall).success(function(data) {

            $scope.siteTarget = data.response.data;
            console.log($scope.siteTarget);
            $scope.barStats = data.response.data.dailyrating;

            angular.forEach($scope.barStats, function(value, index) {
                var temp = 0;

                value.dailyRanking.forEach(function(element) {

                    temp += element.Level;

                });
                $scope.BI.push(temp / 5);
            });

            console.log($scope.BI);

        });

    };


    $scope.open = function(tar) {
        ga('send', 'event', 'dining', 'dining location clicked', tar.title);
        ga('send', 'pageview', 'dining modal');

        $scope.tab = 'insight';
        $scope.getSocialInfo(tar);


        $scope.shouldBeOpen = true;
        $scope.options = {
            scaleFontStyle: "normal",
            scaleOverlay: false,
            scaleShowLabels: false,
            scaleShowGridLines: false,
            barValueSpacing: 50,
            barDatasetSpacing: 1,
            scaleFontFamily: "'tahoma'"
        };
        $scope.chart = {
            labels: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            datasets: [
                {
                    fillColor: "#200fe2",
                    strokeColor: "Black",
                    data: $scope.BI
                }
            ]
        };


        $scope.dir = function() {
            navigator.geolocation.getCurrentPosition(findLocation);


            function findLocation(position)
            {
                $scope.$apply(function() {
                    $scope.cord = position.coords;
                });
                $scope.getDirection();
            }
            ;

            $scope.getDirection = function() {
                $("#map-canvas").gmap3();
                $("#map-canvas").gmap3('clear');
                $scope.panel = "directions";


                $("#map-canvas").gmap3(
                        {
                            getroute: {
                                options: {
                                    origin: [$scope.cord.latitude, $scope.cord.longitude],
                                    destination: [$scope.siteTarget.latitude, $scope.siteTarget.longitude],
                                    travelMode: google.maps.DirectionsTravelMode.TRANSIT
                                },
                                callback: function(results) {
                                    if (!results)
                                        return;
                                    $(this).gmap3({
                                        directionsrenderer: {
                                            container: $('#directionsHolder'),
                                            options: {
                                                directions: results
                                            }
                                        }
                                    });
                                }
                            },
                            autofit: {}
                        }

                );

            };


        };


    };
    $scope.close = function() {
        ga('send', 'pageview', 'dining Page');
        $scope.shouldBeOpen = false;

        $scope.BI = [];
    };
    $scope.opts = {
        backdropFade: true,
        dialogFade: true
    };
}).controller('transportation', function($scope, $window, $http) {
    ga('send', 'pageview', 'transportation Page');
    var map;

    $scope.panel = '';
    $scope.mapcan = 'searching';

    $scope.qrcode;
    $scope.open = function() {
        $scope.shouldBeOpen = true;
    }
    $scope.close = function() {
        $scope.shouldBeOpen = false;
        $scope.mailSent = false;
    }
    $scope.opts = {
        backdropFade: true,
        dialogFade: true
    };

    $(function() {
        navigator.geolocation.getCurrentPosition(findLocation);
    })

    var m = new mandrill.Mandrill('C7LDjR0CdMlYzu12b4zGEg');

// create a variable for the API call parameters
    $scope.params = {
        "message": {
            "from_email": "Sales@metroclick.com",
            "to": [{"email": $scope.userEmail}],
            "subject": "Mobile Directions",
            "text": "I'm learning the Mandrill API at Codecademy."
        }
    };
    $scope.sendTheMail = function() {
// Send the email!
        $scope.params.message.to = [{"email": $('#usermail').val()}];
        $scope.params.message.text = "Thank you for registering with us the link to the map for your mobile phone is " + $scope.maplink;
        $scope.params.message.autotext = true;


        m.messages.send($scope.params, function(res) {
            console.log(res);
            $scope.mailSent = true;
        }, function(err) {
            console.log(err);
            $scope.mailSent = true;
        });
    }



    function findLocation(position)
    {
        $scope.$apply(function() {
            $scope.cord = position.coords;
        });
        mapInit();

    }
    ;



    function mapInit() {

        $("#map-canvas").gmap3({
            map: {
                options: {
                    center: new google.maps.LatLng($scope.cord.latitude, $scope.cord.longitude),
                    zoom: 14,
                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                    mapTypeControl: false,
                    streetViewControl: false,
                    zoomControlOptions: {
                        style: google.maps.ZoomControlStyle.DEFAULT
                    }

                }
            },
            marker: {
                latLng: [$scope.cord.latitude, $scope.cord.longitude],
                options: {animation: google.maps.Animation.DROP,
                    icon: new google.maps.MarkerImage(
                            "img/home-2.png",
                            new google.maps.Size(32, 37, "px", "px")
                            )
                }
            }

        });
    }
    ;





    $scope.makeCall = function(call) {

        $scope.items = [];
        $.ajax({
            type: 'GET',
            url: call,
            success: function(result) {
                // display some textual details about the flight.


                result.response.data.forEach(function(element) {

                    $scope.$apply(function() {
                        $scope.items.push(element);

                    });

                });

                angular.forEach($scope.items, function(value, index) {

                    addMarker([value.latitude, value.longitude]);

                });

            },
            dataType: 'json'
        });

    };


    $scope.getLocations = function(locType) {

        $scope.apikey = '79ae59a1e073e9b6b9ac862c3be5caaa';
        $scope.call = 'http://api.v1.trippinin.com/GeoSearch/';
        $window.navigator.geolocation.getCurrentPosition(function(position) {


            var cord = position.coords;

            $scope.surroundings = $scope.call + cord.latitude + ',' + cord.longitude + '/' + locType + '/saturday/evening?KEY=' + $scope.apikey;

            $scope.realCall = $scope.surroundings + '&radius=1200&limit=20';

            $scope.makeCall($scope.realCall);
            $scope.makeCall($scope.realCall + '&offset=20');

        });

    }

    $scope.changePanel = function(newPanel) {
        console.log(newPanel);
        if (newPanel == 'back') {
            $scope.panel = "selectionPanel";
        }
        else if (newPanel == 'backDir') {
            $scope.panel = "infoPanel";

        }
        else {
            $("#map-canvas").gmap3('clear');
            mapInit();


            switch (newPanel) {
                case 'food':
                    $scope.getLocations('eat');
                    $scope.panel = "selectionPanel";
                    break;
                case 'sites':
                    $scope.getLocations('outdoor');
                    $scope.panel = "selectionPanel";
                    break;

                case 'night':
                    $scope.getLocations('drink');
                    $scope.panel = "selectionPanel";
                    break;
                default:
                    console.log('here');

                    $scope.panel = "";
                    break;
            }

        }
    };

    $scope.getDirection = function() {
        $("#map-canvas").gmap3();
        $("#map-canvas").gmap3('clear');
        $scope.panel = "directions";

        var query = $scope.cord.latitude + ',' + $scope.cord.longitude + '+to+' + $scope.poi.latitude + ',' + $scope.poi.longitude;

        $scope.qrcode = 'https://maps.google.com/maps?q=' + encodeURIComponent(query);
        $scope.maplink = 'https://maps.google.com/maps?q=' + query;


        $("#map-canvas").gmap3(
                {
                    getroute: {
                        options: {
                            origin: [$scope.cord.latitude, $scope.cord.longitude],
                            destination: [$scope.poi.latitude, $scope.poi.longitude],
                            travelMode: google.maps.DirectionsTravelMode.TRANSIT
                        },
                        callback: function(results) {
                            if (!results)
                                return;
                            $(this).gmap3({
                                directionsrenderer: {
                                    container: $('#directionsHolder'),
                                    options: {
                                        directions: results
                                    }
                                }
                            });
                        }
                    },
                    autofit: {}
                }

        );

    };
    function addMarker(latLong) {

        $("#map-canvas").gmap3({
            marker: {
                latLng: latLong,
                icon: "http://maps.google.com/mapfiles/marker_green.png",
                options: {animation: google.maps.Animation.DROP,
                }
            }
            ,
            autofit: {}
        });

    }
    ;

    $scope.infoPanel = function(POI) {
        $scope.panel = "infoPanel";
        $scope.getSocialInfo(POI);

    };

    $scope.apikey = '79ae59a1e073e9b6b9ac862c3be5caaa';
    $scope.getSocialInfo = function(POI) {
        $scope.apicall = 'http://api.v1.trippinin.com/resolve/' + POI.title + '?coordinates=' + POI.latitude + ',' + POI.longitude + '&KEY=' + $scope.apikey;
        $scope.max = 10;
        $http.get($scope.apicall).success(function(data) {

            $scope.poi = data.response.data;
            console.log($scope.poi);



        });

    };



}).controller('directions', function($scope, $window) {

    var directionsDisplay;
    var directionsService = new google.maps.DirectionsService();
    var map;
    $scope.qrcode;
    $scope.open = function() {
        $scope.shouldBeOpen = true;
    }
    $scope.close = function() {

        $scope.shouldBeOpen = false;
    };
    $scope.opts = {
        backdropFade: true,
        dialogFade: true
    };


    var m = new mandrill.Mandrill('C7LDjR0CdMlYzu12b4zGEg');

// create a variable for the API call parameters
    $scope.params = {
        "message": {
            "from_email": "Sales@metroclick.com",
            "to": [{"email": $scope.userEmail}],
            "subject": "Mobile Directions",
            "text": "I'm learning the Mandrill API at Codecademy."
        }
    };
    $scope.sendTheMail = function() {
// Send the email!
        $scope.params.message.to = [{"email": $('#usermail').val()}];
        $scope.params.message.text = "Thank you for registering with us the link to the map for your mobile phone is " + $scope.maplink;
        $scope.params.message.autotext = true;


        m.messages.send($scope.params, function(res) {
            console.log(res);
            $scope.mailSent = true;
        }, function(err) {
            console.log(err);
            $scope.mailSent = true;
        });
    }



    function calcRoute(start, finish) {
        var request = {
            origin: start,
            destination: finish,
            travelMode: google.maps.DirectionsTravelMode.TRANSIT
        };

        directionsService.route(request, function(response, status) {
            if (status == google.maps.DirectionsStatus.OK) {

                directionsDisplay.setDirections(response);
            }
        });
    }






    $window.navigator.geolocation.getCurrentPosition(function(position) {
        directionsDisplay = new google.maps.DirectionsRenderer();
        var cord = position.coords;
        var mapOptions = {
            center: new google.maps.LatLng(cord.latitude, cord.longitude),
            zoom: 14,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            draggable: true
        };

        map = new google.maps.Map(document.getElementById('map'), mapOptions);
        directionsDisplay.setMap(map);

        directionsDisplay.setPanel(document.getElementById('directions-panel'));

        var acOptions = {
            types: []
        };
        var autocomplete = new google.maps.places.Autocomplete(document.getElementById('autocomplete'), acOptions);
        autocomplete.bindTo('bounds', map);

        var infoWindow = new google.maps.InfoWindow();

        var markerOptions = {
            position: new google.maps.LatLng(cord.latitude, cord.longitude),
            animation: google.maps.Animation.DROP,
            icon: new google.maps.MarkerImage(
                    "img/home-2.png",
                    new google.maps.Size(32, 37, "px", "px")
                    )
        };
        var marker = new google.maps.Marker(markerOptions);
        marker.setMap(map);

        google.maps.event.addListener(autocomplete, 'place_changed', function() {
            infoWindow.close();


            var place = autocomplete.getPlace();
            if (place.geometry.viewport) {
                map.fitBounds(place.geometry.viewport);


            } else {

                map.setCenter(place.geometry.location);
                map.setZoom(14);
            }

            calcRoute(new google.maps.LatLng(cord.latitude, cord.longitude), place.geometry.location);
            var query = cord.latitude + ',' + cord.longitude + '+to+' + place.geometry.location.pb + ',' + place.geometry.location.qb;

            $scope.$apply(function() {
                $scope.qrcode = 'https://maps.google.com/maps?q=' + encodeURIComponent(query);
                $scope.maplink = 'https://maps.google.com/maps?q=' + query;
            });
            console.log($scope.qrcode);

            google.maps.event.addListener(marker, 'click', function(e) {

                infoWindow.open(map, marker);

            });
        });


    });

}).controller('mainPage', function($scope) {
    ga('send', 'pageview', 'main Page');
    $('#advertisement').click(function() {
        //we store this in a variable just to make sure it gets a value before sending it
        var item = $(this).text();
        ga('send', 'event', 'ads', 'ad clicked', item);
        ga('send', 'pageview', 'ad Page');
    });

    $scope.myInterval = 5000;
    $scope.slides = [
        {img: "img/budgetInnAssets/1.png"},
        {img: "img/budgetInnAssets/2.png"},
        {img: "img/budgetInnAssets/3.png"},
        {img: "img/budgetInnAssets/4.png"},
        {img: "img/budgetInnAssets/5.png"} ,
        {img: "img/budgetInnAssets/6.png"} 
    ];

}).controller('mainCtrl', function($scope, $location) {
    $(document).idle({
        onIdle: function() {
            $location.path('/home');
        },
        idle: 300000
    });
 
});