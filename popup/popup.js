$(document).ready(function() {
    $("#error").hide();
});


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
         }
     });
 }

 function saveAPIKey(key) {
     // Save it using the Chrome extension storage API.
     chrome.storage.sync.set({'APIKey': key}, function () {
         document.form["form"]["api-key"].value = key;
     });
 }

 document.getElementById('submitkey').onclick =  validateForm;

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

 chrome.storage.sync.get("APIKey", function(element) {
     document.getElementById("api-key").value = element["APIKey"] || "none";
 });

