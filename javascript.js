/* 
 * The search bar is using PHP AJAX which means it needs some background javascript in order to work. This file is providing
 * some of the background work on autocomplete. I learned how to do this from some of the tutorials Netbeans has online
 Author: Sarah McClain
 */

var req;
var isIE;
var completeField;
var completeTable;
var autoRow;

function init(){
    completeField = document.getElementById("complete-field");
    completeTable = document.createElement("table");
    completeTable.setAttribute("class", "popupBox");
    completeTable.setAttribute("style", "display: none");
    autoRow = document.getElementById("auto-row");
    autoRow.appendChild(completeTable);
    completeTable.style.top = getElementY(autoRow) + "px";
}

function doCompletion(){
    var url = "autocomplete.php?action=complete&id=" + escape(completeField.value);
    req = initRequest();
    req.open("GET", url, true);
    req.onreadystatechange = callback;
    req.send(null);
}

function initRequest(){
    if (window.XMLHttpRequest) {
        if (navigator.userAgent.indexOf('MSIE') !== -1){
            isIE = true;
        }
        return new XMLHttpRequest();
    } else if (window.ActiveXObject) {
        isIE = true;
        return new ActiveXObject("Microsoft.XMLHTTP");
    }
}

function callback(){
    clearTable();
    
    if(req.readyState == 4){
        if(req.status == 200){
            parseMessages(req.responseXML);
        }
    }
}

function appendProfessor(firstName,lastName,professorId){
    var row;
    var cell;
    var linkElement;

    if (isIE) {
        completeTable.style.display = 'block';
        row = completeTable.insertRow(completeTable.rows.length);
        cell = row.insertCell(0);
    } else {
        completeTable.style.display = 'table';
        row = document.createElement("tr");
        cell = document.createElement("td");
        row.appendChild(cell);
        completeTable.appendChild(row);
    }

    cell.className = "popupCell";

    linkElement = document.createElement("a");
    linkElement.className = "popupItem";
    linkElement.setAttribute("href", "autocomplete.php?action=lookup&id=" + professorId);
    linkElement.appendChild(document.createTextNode(firstName + " " + lastName));
    cell.appendChild(linkElement);
}

function clearTable() {
    if (completeTable.getElementsByTagName("tr").length > 0) {
        completeTable.style.display = 'none';
        for (loop = completeTable.childNodes.length -1; loop >= 0 ; loop--) {
            completeTable.removeChild(completeTable.childNodes[loop]);
        }
    }
}

function getElementY(element){

    var targetTop = 0;

    if (element.offsetParent) {
        while (element.offsetParent) {
            targetTop += element.offsetTop;
            element = element.offsetParent;
        }
    } else if (element.y) {
        targetTop += element.y;
    }
    return targetTop;
}

function parseMessages(responseXML) {

    // no matches returned
    if (responseXML === null) {
        return false;
    } else {

        var professors = responseXML.getElementsByTagName("professors")[0];

        if (professors.childNodes.length > 0) {
            completeTable.setAttribute("bordercolor", "black");
            completeTable.setAttribute("border", "1");

            for (loop = 0; loop < professors.childNodes.length; loop++) {
                var professor = professors.childNodes[loop];
                var firstName = professor.getElementsByTagName("firstName")[0];
                var lastName = professor.getElementsByTagName("lastName")[0];
                var professorId = professor.getElementsByTagName("id")[0];
                appendProfessor(firstName.childNodes[0].nodeValue,
                    lastName.childNodes[0].nodeValue,
                    professorId.childNodes[0].nodeValue);
            }
        }
    }
}
