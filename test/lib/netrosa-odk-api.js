
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
const SUBMISSION_DOWNLOAD_PATH = "view/downloadSubmission";
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

            let reqHeaders = new Headers();
            reqHeaders.append('X-OpenRosa-Version', '1.0');
            reqHeaders.append('Date', new Date().toUTCString());

            //Add Authorization
            if (this.username.length > 0 && this.password.length > 0) {
                console.log('NOTICE: Adding Encoded Authorization to request...');

                let encodedAuth = window.btoa(this.username + ":" + this.password); //base64
                reqHeaders.append('Authorization', ("Basic " + encodedAuth));
            } else {
                console.log('NOTICE: Using Anonymous user for request...');
            }

            if (method == 'GET') {
                reqHeaders.append('Content-Type', 'text/xml; charset=utf-8');
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
            } else {
                console.log('ODK ERROR: Fetch Failed - ' + response.status);
                throw new Error('ODK ERROR: Fetch Failed - ' + response.status);
            }
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

        this.getSubmissionDataById = (formId, key) => {
            //TODO: FIX HARDCODED OPTIONS
            let formQuery = `${SUBMISSION_DOWNLOAD_PATH}?formId=${formId}[@version=null and @uiVersion=null]/data[@key=${key}]`;
            return this.odkRequest(formQuery, 'GET', null);
        };

        this.uploadSubmissionForm = (xmlFile) => {
            var formData = new FormData();
            formData.append('form_def_file', xmlFile);
            return this.odkRequest(SUBMISSION_PATH, 'POST', formData);
        };

        this.getFormListObjects = (xml) => {

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

        this.getSubsIdsList = (xml) => {

            let parser = new DOMParser();
            let xmlDoc = parser.parseFromString(xml, "text/xml");
            let x = xmlDoc.getElementsByTagName('id');
            var subIdsList = [];

            for (let i = 0; i < x.length; i++) {
                subIdsList.push(x[i].textContent);
            }

            return subIdsList;
        }

        this.getFormsData = async () => {
            let data = await this.getFormsList()
                .then(data => {
                    return data;
                }).catch(reason => {
                    console.log('ODK Fetch Failed: ' + reason.message);
                    throw new Error('ODK ERROR: Fetch Failed - ' + reason.message);
                })

            return this.getFormListObjects(data);
        }

        this.getSubmissionDataObject = (xml) => {
            let parser = new DOMParser();
            let xmlDoc = parser.parseFromString(xml, "text/xml");
            let x = xmlDoc.getElementsByTagName("data")[1].childNodes;
            let subData = {};

            //Submission Data
            for (let i = 0; i < x.length; i++) {
                subData[x[i].tagName] = x[i].textContent;
            }

            //Metadata Attributes
            x = xmlDoc.getElementsByTagName("data");
            let attributes = x[1].attributes;

            for (let i=0; i< attributes.length; i++)
            {
                subData[attributes[i].nodeName] = attributes[i].textContent;
            }

            //Remove unnecessary attributes (eg: id, instanceid)
            delete subData['id'];
            delete subData['orx:meta'];
            
            return subData;
        }

        this.getSubmissionData = async (formId, subId) => {

            let data = await this.getSubmissionDataById(formId, subId).then(data => {
                return data;
            }).catch(reason => {
                console.log('ODK Fetch Failed: ' + reason.message);
                throw new Error('ODK ERROR: Fetch Failed - ' + reason.message);
            });

            return this.getSubmissionDataObject(data);
        }
    }

    get serverName() {
        return this.server;
    }
}

// export { NetRosa };