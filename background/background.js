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

$(document).ready(function(){
    $('#NSLink').on('click', 'a', function(){
        chrome.tabs.create({url: $(this).attr('href')});
        return false;
    });
});