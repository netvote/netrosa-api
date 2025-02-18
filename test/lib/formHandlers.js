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
// Upload Submission (http://odk.netvote.io/submission)
// ODK Endpoint - submission
// ---------------------------------------------------------------------------------------------
function uploadSubmissionAction() {
    $('#modal-uploadSubmission').iziModal('open');

    var fileInput = document.getElementById('sub-file-id');
    var file = fileInput.files[0];

    odk.uploadSubmissionForm(file)
        .then(data => {
            displaySuccess("Form Submission", data);
        }).catch(reason => {
            displayError('ERROR: Fetch Failed - ' + reason.message);
            console.log('Fetch Failed: ' + reason.message);
        });
}

// ---------------------------------------------------------------------------------------------
// Get list of xForms (http://odk.netvote.io/formList)
// ODK Endpoint - formlist
// ---------------------------------------------------------------------------------------------
function getFormListTable() {
    let xformList = [{}];

    //Retrieve Forms as JSON Array
    odk.getFormsData().then(xformList => {

        // console.log('XFORM DATA: ' + JSON.stringify(xformList));

        //Generate Forms Table
        generateFormsTable(xformList);

    }).catch(reason => {
        displayError(reason.message);
        console.log(reason.message);
    });

}

function generateFormsTable(xformList) {
    if (xformList.length > 0) {
        //Generate Download Icon
        var downloadIcon = function (cell, formatterParams) {
            return "<i class='fa fa-download'></i>";
        };

        var table = new Tabulator("#xforms-table", {
            height: "100%",
            // layout: "fitDataFill",
            layout: "fitColumns",
            pagination: "local",
            paginationSize: 10,
            tooltipsHeader: false,
            placeholder: "No Forms Available",
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

        //load xforms data into the table
        table.setData(xformList);
    } else {
        displayError(`No forms currently available`);
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
            let downloadLink = `<h><a href="${url}" style="color:white;"><i class="fa fa-file-code-o fa-lg" aria-hidden="true" style="color: blue"></i></a> ${xFormId}</h>`;

            displayModalMessage(downloadLink, `<xmp>${data}</xmp>`);
        }).catch(reason => {
            displayError('ERROR: Fetch Failed - ' + reason.message);
            console.log('Fetch Failed: ' + reason.message);
        });
}


// ---------------------------------------------------------------------------------------------
// Get Submissions List for a form (http://odk.netvote.io/view/submissionList)
// ODK Endpoint - /view/submissionList
// ---------------------------------------------------------------------------------------------
//ON LOAD
function loadSubsForm() {
    let xformList = [{}];

    //Retrieve Forms as JSON Array
    odk.getFormsData().then(xformList => {

        if (xformList.length > 0) {
            let formsDropdownList = document.getElementById("xforms");

            //Clear options
            formsDropdownList.options.length = 0;

            //Add Forms w/ id to Forms Dropdown
            xformList.forEach(value => {
                let option = document.createElement("option");
                option.value = value.id;
                option.text = value.name;
                formsDropdownList.add(option);
            });

            $('#modal-viewSubmissions').iziModal('open');
        } else {
            throw new Error('ERROR: No XForms available');
            console.log('NOTICE: No XForms available');
        }
    }).catch(reason => {
        displayError(reason.message);
        console.log(reason.message);
    });
}

//ON SUBMIT
function viewSubsAction() {

    $('#modal-viewSubmissions').iziModal('close');

    let formsDropdownList = document.getElementById("xforms");
    var selFormName = formsDropdownList.options[formsDropdownList.selectedIndex].text;
    var selFormId = formsDropdownList.options[formsDropdownList.selectedIndex].value;

    let submissionsList = [];
    var promises = [];

    //Get list of submission keys
    odk.getSubmissionListById(selFormId).then(data => {
        //Raw XML
        // displayModalMessage('SUBMISSIONS', `<xmp>${data}</xmp>`);

        //Transform List of Submission Ids to array
        let subIdList = odk.getSubsIdsList(data);

        subIdList.forEach((subId) => {
            //Fire off Submission Data Retrievals for each submission id
            promises.push(odk.getSubmissionData(selFormId, subId).then(data => {

                // console.log('SUBMISSION DATA: ' + JSON.stringify(data));

                //Add submission object to array
                submissionsList.push(data);
            }));
        });

        //All submission data aggregated...
        Promise.all(promises)
            .then(data => {
                // console.log('AGGREGATED SUBMISSION DATA: ' + JSON.stringify(submissionsList));

                //Generate Submissions Table
                generateSubmissionTable(selFormName, submissionsList);

            }).catch(reason => {
                displayError('SUBMISSON DATA ERROR:' + reason.message);
                console.log('Submission Data Fetch Failed: ' + reason.message);
            });

    }).catch(reason => {
        displayError('ERROR:' + reason.message);
        console.log('Fetch Failed: ' + reason.message);
    });
}

function generateSubmissionTable(selFormName, submissionsList) {
    if (submissionsList.length > 0) {
        //Generate Export Icon
        var exportIcon = function (cell, formatterParams) {
            return "<i class='fa fa-file-excel-o'></i>";
        };

        var table = new Tabulator("#xforms-table", {
            height: "100%",
            // layout: "fitDataFill",
            layout: "fitColumns",
            pagination: "local",
            paginationSize: 15,
            tooltipsHeader: false,
            placeholder: "No Submissions Available",
            rowClick: function (e, id, data, row) {
                // alert("Row " + id + " Clicked!!!!")
            },
            rowContext: function (e, id, data, row) {
                // alert("Row " + id + " Context Clicked!!!!")
            },
            downloadComplete: function () {
                displaySuccess("Export Submissions", `Form submissions exported to ${selFormName}.csv`);
            },
        });


        //Add Export column
        table.addColumn({
            formatter: exportIcon, width: 10, align: "center", cellClick: function (e, cell) {
                table.download("csv", `${selFormName}.csv`, { delimiter: "," });
            }
        });

        //Add Columns to table based on submission data
        let subsObj = submissionsList.values().next().value;

        Object.keys(subsObj).forEach(key => {
            // console.log(`Adding Column ${key}`);
            table.addColumn({ title: `${key}`, field: `${key}`, sorter: "string", headerFilter: "input" });
        });

        //Initial Sort
        table.setSort("submissionDate", "asc");

        //load submission data into the table
        table.setData(submissionsList);
    } else {
        displayError(`No Submissions available for ${selFormName}`);
    }
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
    
    $('#modal-settings').iziModal('setSubtitle', 'You may leave these blank if your ODK server allows anonymous form management.');

    $("#modal-settings").on('click', '.submit', function (event) {
        event.preventDefault();
        saveServerSettings();
    });

    //init values from session
    document.getElementById("username").value = sessionStorage.getItem("server_username") || '';
    document.getElementById("password").value = sessionStorage.getItem("server_password") || '';
    document.getElementById("server").value = sessionStorage.getItem("server_url") || DEFAULT_ODK_SERVER;
}

function saveServerSettings() {
    $('#modal-settings').iziModal('open');

    let serverSettings = {
        username: document.getElementById("username").value,
        password: document.getElementById("password").value,
        server: document.getElementById("server").value
    };

    configureNetRosa(serverSettings);

    displaySuccess("Settings", 'Server settings saved');
}

function outputXformsList(xformsList) {
    let txt = '';
    xformsList.forEach(value => {
        txt += `${value.name}\nID: ${value.id}\n`;
        txt += `<a href="${value.url}">Download Form</a></br></br>`;
    });

    displayModalMessage('CURRENT FORMS', txt);
}

function configureNetRosa(serverSettings) {

    // Store session data
    sessionStorage.clear();
    sessionStorage.setItem("server_username", serverSettings.username || '');
    sessionStorage.setItem("server_password", serverSettings.password || '');
    sessionStorage.setItem("server_url", serverSettings.server || DEFAULT_ODK_SERVER);

    //Display Aggregate Server - footer
    displayFooterURL(`${sessionStorage.getItem("server_username")} @ ${sessionStorage.getItem("server_url")}`);

    //Reconfigure NetRosa API 
    odk = new NetRosa(serverSettings);
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