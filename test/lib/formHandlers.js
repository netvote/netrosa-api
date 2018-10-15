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
    var uploadBtn = document.getElementById('upload-button-id');

    uploadBtn.onclick = function () {
        var fileInput = document.getElementById('file-id');
        var file = fileInput.files[0];

        odk.uploadForm(file)
            .then(data => {
                //Raw XML
                displayMessage(data);

            }).catch(reason => {
                displayError('ERROR: Fetch Failed - ' + reason.message);
                console.log('Fetch Failed: ' + reason.message);
            }).finally(() => {
                //Clear form data
                document.getElementById("xforms-upload-id").reset();
            });

        // Avoid normal form submission
        return false;
    }
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
                // height:"331px",
                layout: "fitDataFill",
                // layout: "fitColumns",
                pagination: "local",
                paginationSize: 10,
                tooltipsHeader: false,
                columns: [
                    { formatter: downloadIcon, width: 40, align: "center", cellClick: function (e, cell) {downloadXForm(cell.getRow().getData().id);} },
                    { title: "Name", field: "name", sorter: "string", width: 150 },
                    { title: "Form Id", field: "id", sorter: "string", align: "left" },
                    { title: "Version", field: "version", sorter: "number", width: 150 },
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
// Get Submissions List for a form (http://odk.netvote.io/view/submissionList)
// ODK Endpoint - /view/submissionList
// ---------------------------------------------------------------------------------------------
function initGetSubFormList() {
    var subsListBtn = document.getElementById('sublist-button-id');

    subsListBtn.onclick = function () {
        let submissionList = [{}];

        odk.getSubmissionListById('mysurvey')
            .then(data => {
                //Raw XML
                alert('Response data: ' + data);

                displayModalMessage('SUBMISSIONS', `<xmp>${data}</xmp>`);

                //TODO
                //Convert to Array for easy manipulation 
                //submissionList = getFormListObjects(data);

                //TODO:
                // 1 - Convert to list
                // 2 - Add list to dropdown
                // 3 - choose one, download/display submission data (api - downloadSubmission)

                //Raw results
                //displayMessage(`<pre><xmp>${data}</xmp></pre>`);
                //  result.innerHTML = `<pre>${data}</pre>`;

                
            }).catch(reason => {
                displayError('ERROR:' + reason.message);
                console.log('Fetch Failed: ' + reason.message);
            });

        // Avoid normal form submission
        return false;
    }
}

// ---------------------------------------------------------------------------------------------
// Get an xForm by form Id (https://odk.netvote.io/formXml?formId=${formId})
// ODK Endpoint - formId
// ---------------------------------------------------------------------------------------------
function downloadXForm(xFormId) {

    odk.getFormById(xFormId)
    .then(data => {
        let url = odk.serverName + `/formXml?formId=${xFormId}`;
        let downloadLink = `<a href="${url}" style="color:white;">${xFormId}</a>`;
        displayModalMessage(downloadLink, `<xmp>${data}</xmp>`);
    }).catch(reason => {
        displayError('ERROR: Fetch Failed - ' + reason.message);
        console.log('Fetch Failed: ' + reason.message);
    });
}

// ---------------------------------------------------------------------------------------------
// Save/Update Aggregate Server Settings
// ---------------------------------------------------------------------------------------------
function initSaveSettings() {
    var saveButton = document.getElementById("save-button-id");

    saveButton.onclick = function () {
        saveServerSettings();

        // Avoid normal form submission
        return false;
    }
}

function saveServerSettings() {

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
    displayMessage('Settings saved');
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