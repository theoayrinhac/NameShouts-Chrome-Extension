/**
 * Created by theophile on 02/08/2017.
 */

document.addEventListener("DOMSubtreeModified", function(event) {
    chrome.storage.sync.get("APIKey", function(element) {
        if ($("#api-key-value").length) {
            if ($("#api-key-value").text() != "") {
                console.log((!element.hasOwnProperty("APIKey")) || ($("#api-key-value").text() !== element["APIKey"]))
                if (!element.hasOwnProperty("APIKey") || ($("#api-key-value").text() !== element["APIKey"])) {
                    validAPIKey($("#api-key-value").text(), function (err) {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            saveAPIKey($("#api-key-value").text());
                        }
                    });
                }
            }
        }

        if ($(".style-sign-in-box").length && !element.hasOwnProperty("APIKey")) {
            if(!($("#NSAccountPopUP").length>0)) {
                var html = '<div id="NSAccountPopUP">'
                html += "<h2>Looks like you don't have a NameShouts account yet !</h2>";
                html += "<p>Please create one to get your own API Key and start using the NameShouts extension"
                html += "</div>"

                document.body.innerHTML += html;
            }
        }
    });
});

console.log("essai");

function validAPIKey(key, cb) {
    var request = "https://www.nameshouts.com/api/names/john";
    var headers = {'NS-API-KEY': key};

    var xhr = new XMLHttpRequest();
    xhr.open('GET', request, true);
    Object.keys(headers).forEach(function (header) {
        xhr.setRequestHeader(header, headers[header]);
    });
    xhr.onload = function (e) {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                cb(false);
            } else {
                cb(true);
            }
        }
    };
    xhr.onerror = function (e) {
        cb(true);
    };
    xhr.send(null);
}

function saveAPIKey(key) {
    // Save it using the Chrome extension storage API.
    chrome.storage.sync.set({'APIKey': key}, function () {
        console.log("apiKey set");
        $.notify("API Key set", "success");
    });
}