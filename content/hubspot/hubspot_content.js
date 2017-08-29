/**
 * Created by theophile on 02/08/2017.
 */


var hubspotNameAdded = false;
var oldname = "null";

function hubspotGraber() {
    document.addEventListener("DOMSubtreeModified", function(event){
        var names = document.getElementsByTagName("h2");
        for (var i = 0, l = names.length; i < l; i++) {
            if (names[i].hasAttribute("data-onboarding") && names[i].attributes["data-onboarding"].value === "contact-profile-module-title") {

                if (oldname !== names[i].innerText) {
                    console.log(names[i].innerText + " vs " + oldname);
                    oldname = names[i].innerText;
                    if (($('#NSWraper').length)) {
                        $('#NSWraper').remove();
                    }
                    hubspotNameAdded = false
                }

                if (!hubspotNameAdded) {

                    var name = names[i].innerText;
                    name = name.split('\n')[0];

                    name = removeDiacritics(name);
                    name = name.replace(/-/g, '_');
                    name = name.replace(/ /g, '_');
                    name = name.replace(/\W/g, '');
                    name = name.replace(/_/g, '-');

                    hubspotNameAdded = true;

                    var wraper = hubspotDisplayer(names[i]);

                    if (wraper !== undefined) {
                        fetchNSData(name, 'default', addInformation(wraper));
                    }
                }
            }
        }
    });
}

function hubspotDisplayer(el) {


    if (el.parentElement.parentElement.childNodes[el.parentNode.parentNode.childNodes.length - 1].id !== "NSWraper") {
        var wraper = document.createElement('div');
        wraper.id = "NSWraper";
        wraper.classList = "NS Wraper";
        el.parentElement.parentElement.appendChild(wraper);
        $(wraper).hide();

        $(el.childNodes[3]).click(function () {
            wraper.parentNode.removeChild(wraper);
        });

        return wraper
    }

    return undefined;
}




hubspotGraber();