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

import * as Utils from '../lib/utils.js';

// ---------------------------------------------------------------------------------------------
// Upload an xForm file (http://odk.netvote.io/formUpload)
// ODK Endpoint - formUpload
// ---------------------------------------------------------------------------------------------
export function initFormUpload(odk) {
    var uploadBtn = document.getElementById('upload-button-id');

    uploadBtn.onclick = function () {
        var fileInput = document.getElementById('file-id');
        var file = fileInput.files[0];

        odk.uploadForm(file)
            .then(data => {
                //Raw XML
                alert('Response data: ' + data);
                Utils.displayMessage(data);

            }).catch(reason => {
                alert('Fetch Failed: ' + reason.message);
                console.log('Fetch Failed: ' + reason.message);
            });

        // Avoid normal form submission
        return false;
    }
}

// ---------------------------------------------------------------------------------------------
// Get list of xForms (http://odk.netvote.io/formList)
// ODK Endpoint - formlist
// ---------------------------------------------------------------------------------------------
export function initGetFormList(odk) {
    var formListBtn = document.getElementById('flist-button-id');

    formListBtn.onclick = function () {
        let xformList = [{}];

        odk.getFormsList()
            .then(data => {
                //Raw XML
                alert('Response data: ' + data);

                //Convert to Array for easy manipulation
                xformList = Utils.getFormListObjects(data);

                //Add list of forms to dropdown
                Utils.addFormsToDropdown(xformList);

                //Raw results
                // Utils.displayMessage(`<pre><xmp>${data}</xmp></pre>`);

                //Formatted w/ Download URLs
                Utils.outputXformsList(xformList);
            }).catch(reason => {
                alert('Fetch Failed: ' + reason.message);
                console.log('Fetch Failed: ' + reason.message);
            });

        // Avoid normal form submission
        return false;
    }
}

// ---------------------------------------------------------------------------------------------
// Get Submissions List for a form (http://odk.netvote.io/view/submissionList)
// ODK Endpoint - /view/submissionList
// ---------------------------------------------------------------------------------------------
export function initGetSubFormList(odk) {
    var subsListBtn = document.getElementById('sublist-button-id');

    subsListBtn.onclick = function () {
        let submissionList = [{}];

        odk.getSubmissionListById('mysurvey')
            .then(data => {
                //Raw XML
                alert('Response data: ' + data);

                Utils.displayModalMessage('SUBMISSIONS', `<xmp>${data}</xmp>`);

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

                //Formatted w/ Download URLs
                //outputXformsList(xformList);
            }).catch(reason => {
                alert('Fetch Failed: ' + reason.message);
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
export function initGetForm(odk) {

    var getFormBtn = document.getElementById('getform-button-id');

    getFormBtn.onclick = function () {

        var selForm = document.getElementById("selForm");
        var xFormId = selForm.value;

        if (xFormId == "") {
            //Load Forms List
            odk.getFormsList()
                .then(data => {
                    //Convert to Array for easy manipulation
                    let xformList = Utils.getFormListObjects(data);

                    //Add list of forms to dropdown
                    Utils.addFormsToDropdown(xformList);

                    return;
                }).catch(reason => { 
                    alert('ERROR: Unable to load list of forms: ' + reason.message);
                });
        } else {
            //Get xForm by Id
            odk.getFormById(xFormId)
                .then(data => {
                    let url = odk.serverName + `/formXml?formId=${xFormId}`;
                    let downloadLink = `<a href="${url}" style="color:lightblue;">${xFormId}</a>`;
                    Utils.displayModalMessage(downloadLink, `<xmp>${data}</xmp>`);
                }).catch(reason => {
                    alert('Fetch Failed: ' + reason.message);
                    console.log('Fetch Failed: ' + reason.message);
                });
        }
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
//         alert('Fetch Failed: ' + reason.message);
//         console.log('Fetch Failed: ' + reason.message);
//     });