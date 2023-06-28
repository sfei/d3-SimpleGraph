window.onload = function() {
    // hide dialog
    $("#help-dialog code.block").addClass("prettyprint lang-js");
    $("#help-dialog-container").hide();
    // dialog click to close
    $("#help-dialog-container").click(function(evt) {
        if(evt.target !== this) return;
        $("#help-dialog-container").hide();
    });
};
// dynamically stringify scores to show on page
function displayScores(scores) {
    var indent = "    ", 
        scoresHtml = "var scores = [<br />";
    for(var i = 0; i < scores.length; i++) {
        scoresHtml += indent + "{ ";
        var j = 0;
        for(var k in scores[i]) {
            scoresHtml += k + ": ";
            if(typeof scores[i][k] === "string") {
                scoresHtml += "'" + scores[i][k] + "'";
            } else {
                scoresHtml += scores[i][k];
            }
            scoresHtml += (j < 3 ? ", " : "");
            j++;
        }
        scoresHtml += " }" + (i+1 < scores.length ? "," : "") + "<br />"
    }
    scoresHtml += "];";
    $("#show-data").html(scoresHtml).addClass("prettyprint lang-js");
    if(PR) PR.prettyPrint();
}
// dialog functionality
function openHelp(elem) {
    $("#help-dialog-title").html(elem.getAttribute("helptitle"));
    $("#help-dialog-content").html(elem.getAttribute("helptext"));
    $("#help-dialog code.block")
        .removeClass("prettyprinted")
        .html(elem.getAttribute("sampleCode"));
    $("#help-dialog-container").show();
    if(PR) PR.prettyPrint();
    var hdElem = $("#help-dialog");
    var hdOffset = hdElem.css("top", (0.5*($(window).height() - $("#help-dialog").height()) - 20)).offset();
    hdElem.css("top", 40);
}
// copy code snippet to clipboard functionality
function copyToClipboard() {
    var copyDiv = $("#help-dialog code.block");
    if(document.body.createTextRange) {
        var range = document.body.createTextRange();
        range.moveToElementText(copyDiv[0]);
        range.select();
    } else if(window.getSelection) {
        var selection = window.getSelection();
        var range = document.createRange();
        range.selectNodeContents(copyDiv[0]);
        selection.removeAllRanges();
        selection.addRange(range);
    }
    try { document.execCommand('copy'); } catch(e) { }
}