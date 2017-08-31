/**
 * Created by theophile on 02/08/2017.
 */


var linkedinNameAdded = false;
var name = "";

function linkedInGraber() {
    document.addEventListener("DOMSubtreeModified", function(event){
        if ($('.pv-top-card-section__name').length) {

            var text = $('.pv-top-card-section__name').text();
            if (text === "") {
                return;
            }

            if (name !== text) {
                name = text;
                linkedinNameAdded = false;
            }

            if (!linkedinNameAdded || name !== text) {

                name = text;

                text = removeDiacritics(text);
                text = text.replace(/-/g, '_');
                text = text.replace(/ /g, '_');
                text = text.replace(/\W/g,'');
                text = text.replace(/_/g, '-');

                linkedinNameAdded = true;

                var wraper = linkedInDisplayer();

                if (wraper !== undefined) {
                    fetchNSData(text, 'default', addInformation(wraper));
                    trackOrigin('LinkedIn');
                }
            }
        }
    });
}

function linkedInDisplayer() {

    if (($('#NSWraper').length)) {
        $('#NSWraper').remove();
    }

    linkedInModificationHandler();
    var wraper = document.createElement('div');
    wraper.id = "NSWraper";
    wraper.classList = "NS Wraper";
    $(wraper).insertAfter('.pv-top-card-section__name');
    $(wraper).hide();

    $('.pv-top-card-section__name').css("display", "inline-block");
    $('.pv-top-card-section__name').css("margin-left", "2.5em");
    $('.pv-top-card-section__name').css("line-height", "2em");

    return wraper

    return undefined;
}

function linkedInModificationHandler() {
    window.addEventListener('popstate', function (event) {
        linkedinNameAdded = false;
    });
}

linkedInGraber();