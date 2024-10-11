# Location Based File Sharing System
GeoShare is a web application that allows users to share files based on 
their physical location within the specified radius. GPS or Wi-Fi of the user's device is used to 
get the users' location for uploading and other users within the specified radius could access the 
shared files. Facilitates the communication and collaboration between people for sharing files 
across specified locations. Social media, Business collaborations, public events, Campus-wide 
information sharing, Classroom collaborations are some of its applications.

AWS Deployment : https://location-based-file-share.s3.us-east-2.amazonaws.com/index.html



Project GeoShare : User Interface


<img width="948" alt="image" src="https://github.com/sarutlaa/Project-GeoShare/assets/141533429/f0d1bb47-cd8d-475e-aa31-988203907fbf">


## Phase 1: Running System ( Frontend , Backend , Datastorage ) Locally with the upload/delete files Running on a Local Server.

Tech Stack Used: 
- Frontend: HTML/CSS
- Backend: PHP ( Connecting using XAMPP )
- Database: MySQL

<img width="502" alt="image" src="https://github.com/user-attachments/assets/f3415fd0-faef-4190-a35e-ca94eba5838e">

## Phase 2: Running system in local server. 

Tech Stack Used: 
- Frontend: HTML/CSS, JS
- Backend: JS
- Database: MySQL
- Tools/Frameworks: Node.js/Express.js

### Changes Made in phase 2
1. Remove PHP in backend dependecny an opting for JS for more user friendly interaction. 
2. Use Javascript for frontend and backend both
3. Directly store the results in MySLQ as a BLOB

<img width="484" alt="image" src="https://github.com/user-attachments/assets/acbe3ad2-d081-4c12-a5b0-b3eef5b2bca4">

## Phase 3: AWS Deployment

Tech Stack used: 
- Frontend: HTML/CSS, JS
- Backend: JS in Node.js in AWS Lambda
- Database/Datastore: S3
- Amazon API: Acts like Express.js for connectivity.

<img width="473" alt="image" src="https://github.com/user-attachments/assets/2a751214-2ef2-46f0-af1f-36c694990339">

Lambda Functions have been written for:
Libraries used: Open Street Maps and the Leaflet JavaScript library, AWS-SDK 

1. Scanning Files
2. Uploading Files
3. Showing circle
4. Download
5. Delete

  




