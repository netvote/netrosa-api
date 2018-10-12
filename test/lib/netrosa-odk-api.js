
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

const FORM_LIST_PATH = "formList";
const FORM_UPLOAD_PATH = "formUpload";
const SUBMISSION_LIST_PATH = "view/submissionList";
const SUBMISSION_PATH = "submission";

// ---------------------------------------------------------------------------------------------
// NetRosa - ODK Aggregate v1.0 API (OpenRosa 1.0 Compliant)
//
// Initialize a new NetRosa instance to manage XForms in aggregate server instance
// 
// @object settings (username, password, aggregateServerURI)
// @return Nothing.
// ---------------------------------------------------------------------------------------------
class NetRosa {
    constructor(settings) {
        this.username = settings.username;
        this.password = settings.password;
        this.server = settings.server;

        this.odkRequest = async (path, method, postObj) => {
            let URL = this.server + "/" + path;
            let encodedAuth = window.btoa(this.username + ":" + this.password); //base64

            let reqHeaders = new Headers();
            reqHeaders.append('X-OpenRosa-Version', '1.0');
            reqHeaders.append('Date', new Date().toUTCString());

            if (method == 'GET') {
                reqHeaders.append('Content-Type', 'text/xml; charset=utf-8');
                reqHeaders.append('Authorization', ("Basic " + encodedAuth));
                reqHeaders.append('Accept', 'application/json');
            }

            let response = await fetch(URL, {
                method,
                credentials: 'omit',
                //  mode: 'no-cors', //Returning opaque Response w/ no data!!!
                mode: 'cors',
                headers: reqHeaders,
                body: postObj
            });

            if (response.ok) {
                return await response.text();
            }

            throw new Error(response.status);
        };

        this.get = (path) => {
            return this.odkRequest(path, 'GET', null);
        };

        this.post = (path, postObj) => {
            return this.odkRequest(path, 'POST', postObj);
        };

        this.getFormsList = () => {
            return this.odkRequest(FORM_LIST_PATH, 'GET', null);
        };

        this.getFormById = (formId) => {
            let formQuery = `formXml?formId=${formId}`; //&readable=true`;
            return this.odkRequest(formQuery, 'GET', null);
        };

        this.uploadForm = (xmlFile) => {
            var formData = new FormData();
            formData.append('form_def_file', xmlFile);
            return this.odkRequest(FORM_UPLOAD_PATH, 'POST', formData);

        };

        this.getSubmissionListById = (formId) => {
            let formQuery = `${SUBMISSION_LIST_PATH}?formId=${formId}`;
            return this.odkRequest(formQuery, 'GET', null);
        };

        this.uploadSubmissionForm = (xmlFile) => {
            var formData = new FormData();
            formData.append('form_def_file', xmlFile);
            return this.odkRequest(SUBMISSION_PATH, 'POST', formData);
        };
    }
    
    get serverName() {
        return this.server;
    }
}

export { NetRosa };