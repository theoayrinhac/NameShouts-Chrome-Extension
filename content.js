/**
 * Created by theophile on 06/06/2017.
 */

window.onload = function() {
    alert('loaded window.onload');
    console.log("loaded window.onload");
};


$(window).load(function() {
    alert('loed');
    var html_doc = document.getElementsByTagName('head')[0];
    var _js = document.createElement('script');
    _js.setAttribute('type', 'text/javascript');
    _js.setAttribute('src', 'vocalizer/vocalizer.min.js');
    if(!document.getElementById('chr_js')) {
        html_doc.appendChild(_js);
    }

    var names = document.getElementsByTagName("h2");

    console.log(names);
    var attempt = ["a", "b", 3];
    console.log(attempt);
    console.log(document.getElementsByTagName("h2")[0]);

    for (var i = 0, l = names.length; i < l; i++) {
        console.log(names[i].innerText);
        if (names[i].data("data-onboarding") === "contact-profile-module-title") {
            var name = names[i].innerText;
            console.log(name);
            names[i].innerText = '<span class="vocalizer" data-source="auto">' + name + '</span>';
        }
    }
});