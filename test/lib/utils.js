/*
    Copyright (C) 2018

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

// ---------------------------------------------------------------------------------------------
// Utility Functions 
// ---------------------------------------------------------------------------------------------
 function initModal() {
    // Get the modal
    var modal = document.getElementById('Modal');

    //Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    modal.style.display = "block";

    // When the user clicks on <span> (x), close the modal
    span.onclick = function () {
        modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}

 function displayModalMessage(title, msg, txtColor = 'lightblue') {
    initModal();
    modalresult.innerHTML = `<h2>${title}</h2><pre style="color: ${txtColor}">${msg}</pre></br>`;
}

 function displayMessage(msg, color = 'lightgreen') {
    initModal();
    modalresult.innerHTML = `</br><pre style="text-align: center; color: ${color}">` + msg + '</pre></br></br>';
}

function displayError(msg) {
    displayMessage(msg, 'red');
}

 function displayFooterURL(msg) {
    footer.innerHTML = `<a href="${msg}" style="color:lightblue;">${msg}</a>`;
}

 function outputXformsList(xformsList) {
    let txt = '';
    xformsList.forEach(value => {
        txt += `${value.name}\nID: ${value.id}\n`;
        txt += `<a href="${value.url}">Download Form</a></br></br>`;
    });

    displayModalMessage('CURRENT FORMS', txt);
}

 function getFormListObjects(xml) {
    let parser = new DOMParser();
    let xmlDoc = parser.parseFromString(xml, "text/xml");
    let x = xmlDoc.getElementsByTagName('xform');
    var xformList = [];

    for (let i = 0; i < x.length; i++) {
        let xform = {};

        //Form ID
        xform.id = x[i].children[0].textContent;

        //Form Name
        xform.name = x[i].children[1].textContent;

        //MajorMinorVersion
        xform.majminver = x[i].children[2].textContent;

        //version
        xform.version = x[i].children[3].textContent;

        //hash
        xform.hash = x[i].children[4].textContent;

        //Download URL
        xform.url = x[i].children[5].textContent;

        xformList.push(xform);
    }

    return xformList;
}

 function addFormsToDropdown(xformsList) {
    let x = document.getElementById("selForm");

    //Nuke current list
    x.options.length = 0;

    xformsList.forEach(value => {
        let option = document.createElement("option");
        option.text = value.name;
        option.value = value.id;
        x.add(option);
    });
    
}

function openPage(pageName) {
    // Hide all elements
    clearAll();

    // Show the specific nav content
    document.getElementById(pageName).style.display = "block";

    var formsMenuContents = document.getElementById("formsMenuContents");

    if (formsMenuContents.classList.contains('show')) {
        formsMenuContents.classList.remove('show');
    }
}

// When the user clicks on the button, 
// toggle between hiding and showing the forms dropdown content
function hideDropdown() {
    document.getElementById("formsMenuContents").classList.toggle("show");
}

// Close the forms dropdown if the user clicks outside of it
document.onclick = function (e) {
    if (!e.target.matches('.dropbtn')) {
        var formsMenuContents = document.getElementById("formsMenuContents");
        if (formsMenuContents.classList.contains('show')) {
            formsMenuContents.classList.remove('show');
        }
    }
}

function clearAll() {
    // Hide all navcontents by default
    let i, navcontent;

    navcontent = document.getElementsByClassName("navcontent");

    for (i = 0; i < navcontent.length; i++) {
        navcontent[i].style.display = "none";
    }

     //Clear form data
     document.getElementById("xforms-upload-id").reset();
}
