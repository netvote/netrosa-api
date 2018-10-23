# netrosa-api
[Work in Progress] - NetRosa is an SDK which allows the development of modern OpenRosa compliant ODK clients and servers.

### NetRosa ODK Aggregate Test Application
An OpenRosa 1.0 Compliant web client which can:

* Download blank form definitions 
* Upload blank form definitions
* View blank form definitions
* Export blank form definitions to XML files
* Download finalized form submissions
* Upload finalized form submissions
* Export form submissions to CSV files

### Specification Details:
* OpenRosa - APIs for communicating with ODK servers (https://docs.opendatakit.org/openrosa/)
* ODK XForms - a subset of the W3C XForms specification, for use in the ODK ecosystem (https://opendatakit.github.io/xforms-spec/)
communication standards for moving blank forms and completed form instances between server applications 

### Test Application Usage
```
cd test
npm install
npm start
```
