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
function displayFooterURL(msg) {
    footer.innerHTML = `<a href="${msg}" style="color:lightblue;">${msg}</a>`;
}

function displayError(msg) {
    displayAlert('ERROR', msg, color = '#ed7474', 'fa fa-exclamation-circle fa-lg');
}

function displaySuccess(title, msg) {
    displayAlert(title, msg, color = '#39ba75', 'fa fa-check fa-lg');
}

function displayModalMessage(title, msg) {

    $('#modal-message').iziModal('resetContent');

    $('#modal-message').iziModal({
        // headerColor: '#26A69A',
        width: '85%',
        overlayColor: 'rgba(0, 0, 0, 0.5)',
        fullscreen: true,
        transitionIn: 'fadeInUp',
        transitionOut: 'fadeOutDown'
    });

    // $('#modal').iziModal('resetContent');
    $('#modal-message').iziModal('setTitle', `${title}`);
    $('#modal-message').iziModal('setContent', `${msg}`);

    $('#modal-message').iziModal('open');
}

function displayAlert(title, msg, color, icon) {

    $('#modal-alert').iziModal('resetContent');

    //alert
    $('#modal-alert').iziModal({
        // headerColor: '#d43838',
        width: 400,
        fullscreen: false,
        timeout: 10000,
        pauseOnHover: true,
        timeoutProgressbar: true,
        transitionIn: 'fadeInUp',
        transitionOut: 'fadeOutDown'
        // attached: 'bottom' 
    });
    
    $('#modal-alert').iziModal('setIcon', `${icon}`);

    $('#modal-alert').iziModal('setBackground', `${color}`);
    $('#modal-alert').iziModal('setHeaderColor', `${color}`);
    $('#modal-alert').iziModal('setTitle', `${title}`);
    $('#modal-alert').iziModal('setSubtitle', `${msg}`);
    // $('#modal-message').iziModal('setContent', `${msg}`);

    $('#modal-alert').iziModal('open');
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

// Hide all navcontents by default
function clearAll() {  
    let i, navcontent;

    navcontent = document.getElementsByClassName("navcontent");

    for (i = 0; i < navcontent.length; i++) {
        navcontent[i].style.display = "none";
    }
}
