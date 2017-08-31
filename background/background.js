/**
 * Created by theophile on 02/08/2017.
 */

chrome.runtime.onInstalled.addListener(function (object) {
    chrome.storage.sync.get("APIKey", function(element) {
        if (!element.hasOwnProperty("APIKey")) {
            chrome.tabs.create({url: "https://www.nameshouts.com/developer/login"}, function (tab) {
                console.log("New tab launched with http://yoursite.com/");
            });
        }
    });
});

(function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = 'https://ssl.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();


var _gaq = _gaq || [];
_gaq.push(['_setAccount', AnalyticsCode]);
_gaq.push(['_trackPageview']);


chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        _gaq.push(['_trackEvent', 'NameRequested', request.origin]);
    });

$(document).ready(function(){
    $('#NSLink').on('click', 'a', function(){
        chrome.tabs.create({url: $(this).attr('href')});
        return false;
    });
});

