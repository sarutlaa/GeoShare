<?php
include "db_conn.php";
?>
<!doctype html>
<html>
  <head>
    <title>Upload and Store video to MySQL Database with PHP</title>
  </head>
  <body>
    <div>
 
     <?php
     $fetchfiles = mysqli_query($conn, "SELECT * FROM shared ORDER BY id DESC");
     while($row = mysqli_fetch_assoc($fetchfiles)){
       $location = $row['location'];
       $name = $row['name'];
       $fileExt= explode('.',$name);
       $fileActualExt = strtolower(end($fileExt));
       
       if($fileActualExt === "pdf")
       {
        echo "<div style='float: left; margin-right: 5px;'>
          <embed src='".$location."' controls width='320px' height='320px' ></embed>     
          <br>
          <span>".$name."</span>
       </div>";
       } else if($fileActualExt === "docx")
       {
        echo "<div style='float: left; margin-right: 5px;'>
          <iframe src='".$location."' controls width='320px' height='320px' ></iframe>     
          <br>
          <span>".$name."</span>
       </div>";
       } else if($fileActualExt === "mov" or $fileActualExt === "mpv4" or  $fileActualExt === "mp4")
       {
        echo "<div style='float: left; margin-right: 5px;'>
          <video src='".$location."' controls width='320px' height='320px' ></video>     
          <br>
          <span>".$name."</span>
       </div>";
       } else if($fileActualExt === "jpg" or $fileActualExt === "jpeg" or $fileActualExt === "png" )
       {
        echo "<div style='float: left; margin-right: 5px;'>
          <img src='".$location."' controls width='320px' height='320px' ></img>     
          <br>
          <span>".$name."</span>
       </div>";
       } 
       
     }
     ?>
 
    </div>

  </body>
</html>