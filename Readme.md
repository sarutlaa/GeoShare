Location based file sharing system Enineering Cloud Computing

testing UI
https://pages.github.iu.edu/samuch/ECC-LBFS/


If trying to run this node migration this is backend to upload file on mongodb server.
using mongodb online. 


First make and mongodb account on atlas. make a database cluster after coming in the database section. 
once cluster is made click on the connect button and scroll down a link would be generated. copy that link 

now come to index.js in main 
in the mongoose where you can see. my mongodb link put ur link and save it 
mongodb+srv://sanketmuchhala:sanket123456@cluster0.z9jvuuo.mongodb.net/test in this sanketmuchhala is username and sanket123456 is password put yours in your link accordingly.


start with installing node modules using 
npm i 

once the modules are installed try running the app 
npm start 

the app is running on localhost:3000 
front end is not written as of now. only backend is written. 

To check this download postman and make account on postman 
<img width="1440" alt="Screenshot 2023-04-22 at 5 37 01 PM" src="https://media.github.iu.edu/user/21696/files/95e2e611-9117-4ea9-adc6-b8bb1b8adf8d">

in postman next to overview click the + button and paste 
[http://localhost:3000/files/upload](http://localhost:3000/files/upload)

url in it 

now enter key and value according to the above image. try to add an image. and hit send. 

Is everything is succesfull youll be able to see the data in mongodb cluster
