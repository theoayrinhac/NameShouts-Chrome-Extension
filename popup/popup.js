websites = [
    {
        name: 'LinkedIn',
        k: 'linkedin',
        iconURL: chrome.extension.getURL("img/LinkedInColor.svg"),
        activated: true
    },
    {
        name: 'HubSpot',
        k: "hubspot",
        iconURL: chrome.extension.getURL("img/HubspotColor.svg"),
        activated: true
    },
    {
        name: "AngelList",
        k: "angellist",
        iconURL: chrome.extension.getURL("img/AngelColor.svg"),
        activated: true
    },
    {
        name: "Facebook",
        k: "facebook",
        iconURL: chrome.extension.getURL("img/FacebookColor.svg"),
        activated: true
    },
    {
        name: "Slack",
        k: "slack",
        iconURL: chrome.extension.getURL("img/SlackColor.svg"),
        activated: true
    }];


function validateForm() {
     var key = document.getElementById("api-key").value;

     validAPIKey(key, function (err) {
         if (err) {
             $("#error").show();
         }
         else {
             $("#error").hide();
             saveAPIKey(key);
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
    var supportedWebsites = {};
    for (var i=0; i < websites.length; i++) {
        supportedWebsites[websites[i].k] = websites[i].activated;
    }
    chrome.storage.sync.set({'SupportedWebsites': supportedWebsites}, function () {
        showInfo();
        $('.forblur').toggleClass("blurry");
        $('.success').fadeIn();
        setTimeout(function(){
            $('.success').hide();
            $('.forblur').removeClass("blurry");
            $('#settings').fadeOut(function(){ $('#main').fadeIn();});
            setTimeout(function(){
                window.close();
            }, 1100);
        }, 1300);
    });
});


function showInfo() {
    chrome.storage.sync.get("APIKey", function(element) {
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
        if (!element.hasOwnProperty("SupportedWebsites")) {

            var supportedWebsites = {};
            for (var i=0; i < websites.length; i++) {
                supportedWebsites[websites[i].k] = websites[i].activated;
            }

            chrome.storage.sync.set({'SupportedWebsites': supportedWebsites}, function () {
                showInfo();
            });
        }
        else {
            var SupportedWebsites = element["SupportedWebsites"];

            for (var i=0; i < websites.length; i++) {
                websites[i].activated = SupportedWebsites[websites[i].k];
            }

            renderIcons ()
        }
    })
}

function renderIcons () {
    for (var i=0; i < websites.length; i++) {
        if ($('#' + websites[i].k).length === 0) {
            var icon = document.createElement('div');

            icon.id = websites[i].k;
            icon.classList = "websiteIcon";

            html = '<img class="serviceIcon" id="' + websites[i].k + 'Icon" src="' + websites[i].iconURL + '" alt="' + websites[i].name + '"/>';
            html += '<p>' + websites[i].name + '</p>';

            icon.innerHTML = html;

            colouring(i, icon);

            icon.onclick = createClckFct(i, icon);

            $('#websites').append(icon);
        }
    }
}

function createClckFct (index, element) {
    return function () {
        websites[index].activated = !websites[index].activated;

        colouring(index, element)
    }
}

function colouring (index, element) {
    if (!websites[index].activated) {
        $(element).css("filter", "grayscale(100%)");
        if (element.id === "angellist") {
            $('#angellistIcon').attr("src", chrome.extension.getURL("img/AngelGrey.svg"));
        }
    }
    else {
        $(element).css("filter", "none");
        if (element.id === "angellist") {
            $('#angellistIcon').attr("src", chrome.extension.getURL("img/AngelColor.svg"));
        }
    }
};

showInfo();

