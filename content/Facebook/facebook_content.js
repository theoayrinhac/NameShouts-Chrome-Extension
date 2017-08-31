/**
 * Created by theophile on 02/08/2017.
 */

console.log('loaded');

var faceboookNameAdded = false;
var name = "";

function linkedInGraber() {
    document.addEventListener("DOMSubtreeModified", function(event){
        var element = $('#fb-timeline-cover-name');

        if (element.length) {

            var text = element.text();
            if (text === "") {
                return;
            }

            if (name !== text) {
                name = text;
                faceboookNameAdded = false;
            }

            if (!faceboookNameAdded || name !== text) {

                name = text;

                text = removeDiacritics(text);
                text = text.replace(/-/g, '_');
                text = text.replace(/ /g, '_');
                text = text.replace(/\W/g,'');
                text = text.replace(/_/g, '-');

                faceboookNameAdded = true;

                var wraper = linkedInDisplayer();

                if (wraper !== undefined) {
                    trackOrigin('Facebook');
                    fetchNSData(text, 'default', addInformation(wraper));

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

    var div = $('#fb-timeline-cover-name').parent().parent();
    $(wraper).insertAfter(div);
    div.parent().css("display", "flex");

    $(wraper).hide();



    return wraper;
}

function linkedInModificationHandler() {
    window.addEventListener('popstate', function (event) {
        faceboookNameAdded = false;
    });
}

linkedInGraber();