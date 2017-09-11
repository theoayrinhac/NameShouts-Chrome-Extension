/**
 * Created by theophile on 02/08/2017.
 */


var slackNameAdded = false;
var name = "";

function slackGraber() {
    document.addEventListener("DOMSubtreeModified", function(event){
        if ($(".panel.active .member_name_and_presence").length) {
            var text = $(".panel.active .member_name_and_presence .member_name").text();
            if (text === "") {
                return;
            }

            if (name !== text) {
                name = text;
                slackNameAdded = false;
            }

            if (!slackNameAdded || name !== text) {

                name = text;

                text = removeDiacritics(text);
                text = text.replace(/-/g, '_');
                text = text.replace(/ /g, '_');
                text = text.replace(/\W/g, '');
                text = text.replace(/_/g, '-');

                slackNameAdded = true;

                var wraper = slackDisplayer();

                if (wraper !== undefined) {
                    fetchNSData(text, 'default', addInformation(wraper));
                    trackOrigin('Slack');
                }
            }
        }
    });
}

function slackDisplayer() {

    if (($('#NSWraper').length)) {
        $('#NSWraper').remove();
    }

    slackModificationHandler();
    var wraper = document.createElement('div');
    wraper.id = "NSWraper";
    wraper.classList = "NS Wraper";
    $(".member_name_and_presence").prepend(wraper)
    $(wraper).hide();

    return wraper;
}

function slackModificationHandler() {
    window.addEventListener('popstate', function (event) {
        slackNameAdded = false;
    });
}

chrome.storage.sync.get("SupportedWebsites", function(element) {
    if (element.hasOwnProperty("SupportedWebsites")) {
        config.supportedwebsites = element["SupportedWebsites"];
        if (config.supportedwebsites["slack"]) {
 slackGraber();
        }
    }
});

