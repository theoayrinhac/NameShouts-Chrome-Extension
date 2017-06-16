/*
 * Created by theophile on 06/06/2017.
 */

//Vocalizer

var websites = ["https://app.hubspot.com/contacts/*"]
var nameGraber = [hubspotGraber];
var elementDisplayer = [hubspotDisplayer]

var config = {
    className: 'vocalizer',
    classNameIO: /vocalizer-(.+)/,
    nameshouts: {
        queryBase: 'https://www.nameshouts.com/api/names/',
        mediaBase: 'https://www.nameshouts.com/libs/media/',
    },
    vocalizerIO: {
        queryBase: 'https://www.vocalizer.io/audio-url/'
    }
};

chrome.storage.onChanged.addListener(function(changes, namespace) {
    for (key in changes) {
        if(key === "APIKey") {
            config.nameshouts.token = chrome.storage.sync.get("APIKey");
        }
    }
});

function loadCss() {
    var style = document.createElement('link');
    style.type = 'text/css';
    style.rel = 'stylesheet';
    style.href = "vocalizer/vocalizer.min.css";
    document.head.appendChild(style);
}

loadCss();

function getURL(request, headers, cb) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', request, true);
    Object.keys(headers).forEach(function(header) {
        xhr.setRequestHeader(header, headers[header]);
    });
    xhr.onload = function (e) {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                cb(null, xhr.responseText);
            } else {
                cb(xhr.statusText);
            }
        }
    };
    xhr.onerror = function (e) {
        cb(xhr.statusText);
    };
    xhr.send(null);
}

function fetchAudio(name, language, cb) {
    var url = config.nameshouts.queryBase + name;
    chrome.storage.sync.get("APIKey", function(element) {
        getURL(url, {'NS-API-KEY': element["APIKey"]}, function(err, data) {
            if (err) return cb(err);

            language = language.toLowerCase();

            var complete = true;
            var sounds = JSON.parse(data).message;

            console.log(sounds);

            var names = name.split('-');
            var audioPath = [];
            for (var i = 0; i < names.length; i++) {
                if (sounds[names[i]] !== null) {
                    var languages = JSON.parse(data).message[names[i]].map(function (el) {
                        return el.lang_name.toLowerCase();
                    });

                    if (language !== 'default' && languages.includes(language)) {
                        var audioPathRel = JSON.parse(data).message[names[i]][languages.indexOf(language)]["path"];
                    }
                    else {
                        var audioPathRel = JSON.parse(data).message[names[i]][0]["path"];
                    }

                    audioPath.push(config.nameshouts.mediaBase + audioPathRel + '.mp3')
                }
                else {
                    complete = false;
                }
            }
            cb(null, audioPath, complete);
        })});

}

function addAudioForName(el, audioPath, complete) {
    if (audioPath.length === 0) {
        $(el).addClass('vocalizer-off');
        return;
    }

    var audioList = audioPath.map(function(el) {
        var audio = new Audio(el);
        audio.playbackRate = 0.75;
        return audio;
    });

    console.log(complete);

    el.addEventListener('click', function() {
        playAudioList(audioList)
    }, false);

    if (complete) {
        $(el).addClass('vocalizer-complete');
    }
    else {
        $(el).addClass('vocalizer-partial');
    }
}

function playAudioList(audioList) {
    audioList[0].play();
    if (audioList.length > 1) {
        audioList[0].addEventListener("ended", function () {
            playAudioList(audioList.slice(1));
        });
    }
}

function addSound(el) {
    return function (err, audioPath, complete) {
        if (err) {
            return;
        }
        addAudioForName(el, audioPath, complete);
    };
}


//Specific Functions

//HubSpot
var hubspotNameAdded = false;

function hubspotGraber() {
    var names = document.getElementsByTagName("h2");

    document.addEventListener("DOMSubtreeModified", function(event){
        for (var i = 0, l = names.length; i < l; i++) {
            if (names[i].hasAttribute("data-onboarding") && names[i].attributes["data-onboarding"].value === "contact-profile-module-title") {
                if (!hubspotNameAdded) {

                    var name = names[i].innerText;
                    name = name.replace(/-/g, '_');
                    name = name.replace(/ /g, '_');
                    name = name.replace(/\W/g,'');
                    name = name.replace(/_/g, '-');

                    hubspotNameAdded = true;
                    fetchAudio(name, 'default', addSound(hubspotDisplayer(names[i])));

                }
            }
        }
    });
}

function hubspotDisplayer(el) {
    var icon = document.createElement('span');
    icon.id = "playButtonVocalizer"
    console.log(icon);
    el.insertBefore(icon, el.children[0]);
    return icon;
}

hubspotGraber();



$(document).ready(function(){

    $.fn.listHandlers = function(events) {
        this.each(function(i){
            var elem = this,
                // dEvents = $(this).data('events');
                dEvents = $._data($(this).get(0), "events");
            if (!dEvents) {return;}
            $.each(dEvents, function(name, handler){
                if((new RegExp('^(' + (events === '*' ? '.+' : events.replace(',','|').replace(/^on/i,'')) + ')$' ,'i')).test(name)) {
                    $.each(handler,
                        function(i,handler){
                            //console.info(elem);
                            console.info(elem, '\n' + i + ': [' + name + '] : ' + handler.handler );
                        });
                }
            });
        });
    };


    $.fn.hasHandlers = function(events,selector) {
        var result=false;

        this.each(function(i){
            var elem = this;
            dEvents = $._data($(this).get(0), "events");
            if (!dEvents) {return false;}
            $.each(dEvents, function(name, handler){
                if((new RegExp('^(' + (events === '*' ? '.+' : events.replace(',','|').replace(/^on/i,'')) + ')$' ,'i')).test(name)) {
                    $.each(handler,
                        function(i,handler){
                            if (handler.selector===selector)
                                result=true;
                        });
                }
            });
        });
        return result;
    };


});