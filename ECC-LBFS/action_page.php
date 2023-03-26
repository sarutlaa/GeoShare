<?php

// Database Connection
include "db_conn.php";

if (isset($_POST['submit']))
    {       
        $file = $_FILES['file'];

        // echo <pre>;
        // print_r(_FILES['file']);
        // </pre>;

        $fileName = $_FILES['file']['name'];
        $fileTmpName = $_FILES['file']['tmp_name'];
        $fileSize = $_FILES['file']['size'];
        $fileError = $_FILES['file']['error'];
        $fileType = $_FILES['file']['type'];
    
        // Separating Filenames and its extensions
        $fileExt= explode('.',$fileName);
        // Conerting all the extensions to the lower case
        $fileActualExt = strtolower(end($fileExt));
    
        // Allowing only below extensions for now to upload in database
        $allowedExt = array('jpg','jpeg','png','pdf','docx', 'mov', 'mpv4');

        if(in_array($fileActualExt,$allowedExt))
            {   
                // Checking for file errors
                if ($fileError === 0)
                    {   
                        // Checking the File Size upto 5MB
                        if ($fileSize <= 5242880) 
                            {  
                                // Uploading the files with unique ids (Timeformat in microseconds)
                                $fileNameNew = uniqid('',true).".".$fileActualExt;

                                // Locally these are stored in uploads folder
                                $fileDestination = 'uploads/'.$fileNameNew;
                
                                // copying uploaded files locally
                                move_uploaded_file($fileTmpName, $fileDestination);


                                // INSERTING INTO MYSQL DATABASE
                                $sql = "INSERT INTO shared(name,location)
                                VALUES ('".$fileNameNew."', '".$fileDestination."')";
                
                                mysqli_query($conn, $sql);
    
                                echo "File Uploaded Successfully";
                                // header("Location: action_page.php?uploadsuccess");
                            } 
                        else { echo "Your file is too big!"; }
                    }
                else { echo "There was an error in uploading your file"; }
            } 
        else { echo "You cannot upload files of this type"; }
    }
    
?>