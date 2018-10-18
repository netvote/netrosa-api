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

function displayContainer() {
    $(window).on("load", function () {
        //Eliminate DOM Flicker
        document.getElementById("container").style.display = "block";
    });
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
        transitionIn: 'bounceInDown',
        transitionOut: 'bounceOutDown'
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

    hideDropdownElement("subsMenuContents");
}

// When the user clicks on the button, 
// toggle between hiding and showing the forms dropdown content
function hideSubsDropdown() {
    document.getElementById("subsMenuContents").classList.toggle("show");

    hideDropdownElement("formsMenuContents");
}

// Close the forms dropdown if the user clicks outside of it
document.onclick = function (e) {
    if (!e.target.matches('.dropbtn')) {
        hideDropdownElement("formsMenuContents");
        hideDropdownElement("subsMenuContents");
        // hideDropdown("subsMenuContents");
    }
}

function hideDropdownElement(elementId) {
    //Hide Submissions Dropdown
    let menuContents = document.getElementById(elementId);

    if (menuContents != null) {
        if (menuContents.classList.contains('show')) {
            menuContents.classList.remove('show');
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

function initModal(modalName, modalTitle, modalIcon, actionCallback) {
    $(`#${modalName}`).iziModal('resetContent');

    $(`#${modalName}`).iziModal({
        // headerColor: '#26A69A',
        // width: '85%',
        overlayColor: 'rgba(0, 0, 0, 0.5)',
        fullscreen: false,
        transitionIn: 'flipInX',
        transitionOut: 'flipOutX'
    });

    $(`#${modalName}`).iziModal('setTitle', modalTitle);
    $(`#${modalName}`).iziModal('setIcon', modalIcon);

    $(`#${modalName}`).on('click', '.submit', function (event) {
        event.preventDefault();
        actionCallback();
    });
}