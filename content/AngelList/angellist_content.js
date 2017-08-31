/**
 * Created by theophile on 02/08/2017.
 */


var angelNameAdded = false;
var oldname = "null";

function angelGraber() {
    document.addEventListener("DOMSubtreeModified", function(event){
        var names = document.getElementsByTagName("h1");
        for (var i = 0, l = names.length; i < l; i++) {
            if (names[i].hasAttribute("itemprop") && names[i].attributes["itemprop"].value === "name") {

                if (!angelNameAdded) {

                    var name = names[i].innerHTML.split('\n')[1];

                    name = removeDiacritics(name);
                    name = name.replace(/-/g, '_');
                    name = name.replace(/ /g, '_');
                    name = name.replace(/\W/g, '');
                    name = name.replace(/_/g, '-');

                    angelNameAdded = true;

                    var wraper = angelDisplayer(names[i]);

                    console.log(wraper);
                    console.log(name);

                    if (wraper !== undefined) {
                        trackOrigin('AngelList');
                        fetchNSData(name, 'default', addInformation(wraper));

                    }
                }
            }
        }
    });
}

function angelDisplayer(el) {

    if (!$("#NSWraper").length) {
        var wraper = document.createElement('div');
        wraper.id = "NSWraper";
        wraper.classList = "NS Wraper";
        el.insertBefore(wraper, el.childNodes[1]);
        $(wraper).hide();
        return wraper;
    }
}




angelGraber();