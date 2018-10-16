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
// Upload an xForm file (http://odk.netvote.io/formUpload)
// ODK Endpoint - formUpload
// ---------------------------------------------------------------------------------------------
function initFormUpload() {
    $('#modal-uploadForm').iziModal('resetContent');

    $('#modal-uploadForm').iziModal({
        // headerColor: '#26A69A',
        // width: '85%',
        overlayColor: 'rgba(0, 0, 0, 0.5)',
        fullscreen: false,
        transitionIn: 'flipInX',
        transitionOut: 'flipOutX'
    });

    $('#modal-uploadForm').iziModal('setTitle', "Upload Blank XForm");
    $('#modal-uploadForm').iziModal('setIcon', 'fa fa-cloud-upload fa-lg');

    $("#modal-uploadForm").on('click', '.submit', function (event) {
        event.preventDefault();
        uploadFormAction();
    });
}

function uploadFormAction() {
    $('#modal-uploadForm').iziModal('open');

    var fileInput = document.getElementById('file-id');
    var file = fileInput.files[0];

    odk.uploadForm(file)
        .then(data => {
            displaySuccess("XForm Upload", data);
        }).catch(reason => {
            displayError('ERROR: Fetch Failed - ' + reason.message);
            console.log('Fetch Failed: ' + reason.message);
        });
}

// ---------------------------------------------------------------------------------------------
// Get list of xForms (http://odk.netvote.io/formList)
// ODK Endpoint - formlist
// ---------------------------------------------------------------------------------------------
function getFormList() {
    let xformList = [{}];

    clearAll();

    odk.getFormsList()
        .then(data => {
            //Raw XML
            // alert('Response data: ' + data);

            //Convert to Array for easy manipulation
            xformList = getFormListObjects(data);

            //Raw results
            // displayMessage(`<pre><xmp>${data}</xmp></pre>`);

            //Generate Download Icon
            var downloadIcon = function (cell, formatterParams) { //plain text value
                return "<i class='fa fa-download'></i>";
            };

            var table = new Tabulator("#xforms-table", {
                height: "100%",
                // layout: "fitDataFill",
                layout: "fitColumns",
                pagination: "local",
                paginationSize: 10,
                tooltipsHeader: false,
                placeholder: "No Forms Available", //display message to user on empty table
                initialSort: [
                    { column: "name", dir: "asc" },
                ],
                columns: [
                    { formatter: downloadIcon, width: 10, align: "center", cellClick: function (e, cell) { downloadXForm(cell.getRow().getData().id); } },
                    { title: "Name", field: "name", sorter: "string", headerFilter: "input" },
                    { title: "Form Id", field: "id", sorter: "string", align: "left", headerFilter: "input" },
                    { title: "Version", field: "version", sorter: "number", headerFilter: "input" },
                ],
                rowClick: function (e, id, data, row) {
                    // alert("Row " + id + " Clicked!!!!")
                },
                rowContext: function (e, id, data, row) {
                    // alert("Row " + id + " Context Clicked!!!!")
                },
            });

            //load sample data into the table
            table.setData(xformList);

        }).catch(reason => {
            displayError('ERROR: Fetch Failed - ' + reason.message);
            console.log('Fetch Failed: ' + reason.message);
        });
}

// ---------------------------------------------------------------------------------------------
// Get an xForm by form Id (https://odk.netvote.io/formXml?formId=${formId})
// ODK Endpoint - formId
// ---------------------------------------------------------------------------------------------
function downloadXForm(xFormId) {

    odk.getFormById(xFormId)
        .then(data => {
            let url = odk.serverName + `/formXml?formId=${xFormId}`;
            let downloadLink = `<h><a href="${url}" style="color:white;"><i class="fa fa-file-code-o fa-lg" aria-hidden="true" style="color: blue"></i></a> ${xFormId}</h>`;

            displayModalMessage(downloadLink, `<xmp>${data}</xmp>`);
        }).catch(reason => {
            displayError('ERROR: Fetch Failed - ' + reason.message);
            console.log('Fetch Failed: ' + reason.message);
        });
}

// ---------------------------------------------------------------------------------------------
// Generic ODK GET
// ---------------------------------------------------------------------------------------------
// odk.get('formXml?formId=mysurvey')
//     .then(data => {
//         //Raw XML
//         document.write(`<h2>netRosa xForm</h2>`);
//         document.write(`<pre><xmp>${data}</xmp></pre>`);
//     }).catch(reason => {
//         displayError('ERROR: Fetch Failed - ' + reason.message);
//         console.log('Fetch Failed: ' + reason.message);
//     });

// ---------------------------------------------------------------------------------------------
// Get Submissions List for a form (http://odk.netvote.io/view/submissionList)
// ODK Endpoint - /view/submissionList
// ---------------------------------------------------------------------------------------------
// function initGetSubFormList() {
//     var subsListBtn = document.getElementById('sublist-button-id');

//     subsListBtn.onclick = function () {
//         let submissionList = [{}];

//         odk.getSubmissionListById('mysurvey')
//             .then(data => {
//                 //Raw XML
//                 alert('Response data: ' + data);

//                 // displayModalMessage('SUBMISSIONS', `<xmp>${data}</xmp>`);
//                 displayModalMessage('SUBMISSIONS', `<xmp>${data}</xmp>`);

//                 //TODO
//                 //Convert to Array for easy manipulation 
//                 //submissionList = getFormListObjects(data);

//                 //TODO:
//                 // 1 - Convert to list
//                 // 2 - Add list to dropdown
//                 // 3 - choose one, download/display submission data (api - downloadSubmission)

//                 //Raw results
//                 //displayMessage(`<pre><xmp>${data}</xmp></pre>`);
//                 //  result.innerHTML = `<pre>${data}</pre>`;


//             }).catch(reason => {
//                 displayError('ERROR:' + reason.message);
//                 console.log('Fetch Failed: ' + reason.message);
//             });

//         // Avoid normal form submission
//         return false;
//     }
// }

// ---------------------------------------------------------------------------------------------
// Save/Update Aggregate Server Settings
// ---------------------------------------------------------------------------------------------
function initSaveSettings() {
    $('#modal-settings').iziModal('resetContent');

    $('#modal-settings').iziModal({
        // headerColor: '#26A69A',
        overlayColor: 'rgba(0, 0, 0, 0.5)',
        fullscreen: false,
        transitionIn: 'flipInX',
        transitionOut: 'flipOutX'
    });

    $('#modal-settings').iziModal('setTitle', "Server Settings");
    $('#modal-settings').iziModal('setIcon', 'fa fa-cogs fa-lg');

    $("#modal-settings").on('click', '.submit', function (event) {
        event.preventDefault();
        saveServerSettings();
    });
}

function saveServerSettings() {
    $('#modal-settings').iziModal('open');

    let serverSettings = {
        username: document.getElementById("username").value,
        password: document.getElementById("password").value,
        server: document.getElementById("server").value
    };

    //Display Aggregate Server - footer
    displayFooterURL(`${serverSettings.username} - ${serverSettings.password} - ${serverSettings.server}`);

    //Reconfigure NetRosa API 
    odk = new NetRosa(serverSettings);

    //TODO: Save to session data
    displaySuccess("Settings", 'Server settings saved');
}

// ---------------------------------------------------------------------------------------------
// Tabulator Table Filtering
// ---------------------------------------------------------------------------------------------
//custom max min header filter
var minMaxFilterEditor = function (cell, onRendered, success, cancel, editorParams) {

    var end;

    var container = document.createElement("span");

    //create and style inputs
    var start = document.createElement("input");
    start.setAttribute("type", "number");
    start.setAttribute("placeholder", "Min");
    start.setAttribute("min", 0);
    start.setAttribute("max", 100);
    start.style.padding = "4px";
    start.style.width = "50%";
    start.style.boxSizing = "border-box";

    start.value = cell.getValue();

    function buildValues() {
        success({
            start: start.value,
            end: end.value,
        });
    }

    function keypress(e) {
        if (e.keyCode == 13) {
            buildValues();
        }

        if (e.keyCode == 27) {
            cancel();
        }
    }

    end = start.cloneNode();

    start.addEventListener("change", buildValues);
    start.addEventListener("blur", buildValues);
    start.addEventListener("keydown", keypress);

    end.addEventListener("change", buildValues);
    end.addEventListener("blur", buildValues);
    end.addEventListener("keydown", keypress);


    container.appendChild(start);
    container.appendChild(end);

    return container;
}

//custom max min filter function
function minMaxFilterFunction(headerValue, rowValue, rowData, filterParams) {
    //headerValue - the value of the header filter element
    //rowValue - the value of the column in this row
    //rowData - the data for the row being filtered
    //filterParams - params object passed to the headerFilterFuncParams property

    if (rowValue) {
        if (headerValue.start != "") {
            if (headerValue.end != "") {
                return rowValue >= headerValue.start && rowValue <= headerValue.end;
            } else {
                return rowValue >= headerValue.start;
            }
        } else {
            if (headerValue.end != "") {
                return rowValue <= headerValue.end;
            }
        }
    }

    return false; //must return a boolean, true if it passes the filter.
}