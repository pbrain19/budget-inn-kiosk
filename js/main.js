/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

function clock() {
    var now = new Date();
    var outStr = now.toString("hh:mm tt");
    document.getElementById('timeclock').innerHTML = outStr;
    setTimeout('clock()', 21000);
}

clock();

$(".modern-ticker").modernTicker(
        {
            effect: "scroll",
            scrollInterval: 20,
            transitionTime: 500,
            autoplay: true,
            feedType: "rss-atom",
            feedUrl: "http://rss.cnn.com/rss/cnn_topstories.rss",
            feedCount: 10,
            refresh: "10:00"
        }
);

var redirAchors = function() {

    $('.mt-news a').each(function(index, listItem) {


        $(this).attr('href', '#/news');

        $(this).removeAttr('target');


    });

    setTimeout(function() {
        redirAchors();
    }, 10000);
};

$('#weatherdiv').weatherfeed(['USNY0996'],
        {
            unit: 'f',
            image: true

        }
);

function goBack()
{
    window.history.back();
}
;


setTimeout(function() {
    redirAchors();
}, 2000);

var translate = function(){
    
    var requestUrl= 'https://www.googleapis.com/language/translate/v2?key=AIzaSyAqLx4skhsKnyzazGRCShKgYcmnqmmppGE&q=hello%20world&source=en&target=de';
    
}

