function validateForm() {
     var key = document.getElementById("api-key").value;

     validAPIKey(key, function (err) {
         console.log(err);
         if (err) {
             $("#error").show();
         }
         else {
             $("#error").hide();
             saveAPIKey(key);
             console.log('success');
             $('.forblur').toggleClass("blurry");
             $('.success').fadeIn();
             setTimeout(function(){
                 $('.success').hide();
                 $('.forblur').removeClass("blurry");
                 window.close();
             }, 1100);
         }
     });
 }

 function saveAPIKey(key) {
     // Save it using the Chrome extension storage API.
     chrome.storage.sync.set({'APIKey': key}, function () {
         document.form["form"]["api-key"].value = key;
         apiKey = true;
         showInfo();
     });
 }

document.getElementById('settingsLink').onclick = function () {
    $('#main').fadeOut(function(){ $('#settings').fadeIn();});
};

document.getElementById('mainLink').onclick = function () {
    $('#settings').fadeOut(function(){ $('#main').fadeIn();});
};

document.getElementById('submitkey').onclick = validateForm;

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

$('#savesettings').click(function() {
    var SupportedWebsites = {
        facebook: document.getElementById("facebook-selector").checked,
        hubspot: document.getElementById("hubspot-selector").checked,
        linkedin: document.getElementById("linkedin-selector").checked,
        angellist: document.getElementById("angellist-selector").checked
    };
    console.log(SupportedWebsites)
    chrome.storage.sync.set({'SupportedWebsites': SupportedWebsites}, function () {
        showInfo();
    });
});


function showInfo() {
    console.log("essai");
    chrome.storage.sync.get("APIKey", function(element) {
        console.log(element);

        if (!element.hasOwnProperty("APIKey")) {
            $('#title').hide();
            $('#first-usage').show();
            document.getElementById("api-key").value = "";
        }
        else {
            $('#title').show();
            $('#first-usage').hide();
            document.getElementById("api-key").value = element["APIKey"];
        }
    });
    chrome.storage.sync.get("SupportedWebsites", function(element) {
        console.log(element);
        if (!element.hasOwnProperty("SupportedWebsites")) {
            chrome.storage.sync.set({'SupportedWebsites': {
                facebook: true,
                hubspot: true,
                linkedin: true,
                angellist: true
            }}, function () {
                showInfo();
            });
        }
        else {
            var SupportedWebsites = element["SupportedWebsites"];
            Object.keys(SupportedWebsites).forEach(function(key,index) {
                document.getElementById(key + "-selector").checked = SupportedWebsites[key];
            })
        }
    })
}

showInfo();

