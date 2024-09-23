<?php

$inData = getRequestInfo();
	
$id = 0;
$firstName = "";
$lastName = "";
$username = "";
$password = "";

$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331"); 
if( $conn->connect_error )
 {
   
 	returnWithError("faulty connection");
 }
 else
 {
    $stmt = $conn->prepare("SELECT ID,firstName,lastName FROM Users WHERE Login=?");
 	$stmt->bind_param("s",$inData["login"]);
	$stmt->execute();
 	$result = $stmt->get_result();

     if( $row = $result->fetch_assoc())
     {
        returnWithError("duplicate login");
     }
     else
     {
         $stmt = $conn->prepare("INSERT INTO Users (firstName, lastName, login, password) VALUES (?,?,?,?)");
         $stmt->bind_param("ssss",$inData["firstName"], $inData["lastName"],$inData["login"], $inData["password"]);
         $stmt->execute();
         $stmt->close();
	     
         

         $stmt = $conn->prepare("SELECT ID,firstName,lastName FROM Users WHERE FirstName=? AND LastName=? AND Login=? AND Password=?");
         $stmt->bind_param("ssss",$inData["firstName"], $inData["lastName"],$inData["login"], $inData["password"]);
         $stmt->execute();
         $result = $stmt->get_result();
         $row = $result->fetch_assoc();
         returnWithInfo( $row["firstName"], $row["lastName"], $row["ID"]);
     }
    $stmt->close();
	$conn->close();
 }

function getRequestInfo()
{
	return json_decode(file_get_contents('php://input'), true);
}

function sendResultInfoAsJson( $obj )
{
	header('Content-type: application/json');
	echo $obj;
}
	
function returnWithError( $err )
{
	$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
	sendResultInfoAsJson( $retValue );
}
	
function returnWithInfo( $firstName, $lastName, $id )
{
	$retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
	sendResultInfoAsJson( $retValue );
}
?>