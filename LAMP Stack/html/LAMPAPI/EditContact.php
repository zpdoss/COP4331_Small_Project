<?php

    $inData = getRequestInfo();

    $newName="";
    $newPhone="";
    $newEmail="";
    $ID="";

    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
    {
        
		$stmt = $conn->prepare("Update Contacts SET Name=?, Phone=?, Email=? WHERE UserID=? ");
		$stmt->bind_param("sssi", $inData["newName"], $inData["newPhone"], $inData["newEmail"], $inData["ID"]);
		$stmt->execute();
        $stmt->close();
        $conn->close();
        returnWithError("Succesfully Changed");
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
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	


?>