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
export function initModal() {
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

export function displayModalMessage(title, msg, txtColor = 'light blue') {
    initModal();
    modalresult.innerHTML = `<h2 style="color: grey">${title}</h2><pre style="color: ${txtColor}">${msg}</pre></br>`;
}

export function displayMessage(msg) {
    initModal();
    modalresult.innerHTML = '</br><pre style="text-align: center; color: lightgreen">' + msg + '</pre></br></br>';
}

export function displayFooterURL(msg) {
    footer.innerHTML = `<a href="${msg}" style="color:lightblue;">${msg}</a>`;
}

export function outputXformsList(xformsList) {
    let txt = '';
    xformsList.forEach(value => {
        txt += `${value.name}\nID: ${value.id}\n`;
        txt += `<a href="${value.url}">Download Form</a></br></br>`;
    });

    displayModalMessage('CURRENT FORMS', txt);
}

export function getFormListObjects(xml) {
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

export function addFormsToDropdown(xformsList) {
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