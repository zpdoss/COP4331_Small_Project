<?php
	

	$inData = getRequestInfo();

	$userID=$inData["userID"];
	$name=$inData["name"];



	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else{
	
		$stmt = $conn->prepare("DELETE FROM Contacts WHERE Name=? AND ID=?");
		$stmt->bind_param("si", $name, $userID);
		$stmt->execute();
		$stmt->close();
		$conn->close();
		
		
	}



	function sendResultInfoAsJson( $obj )
		{
			header('Content-type: application/json');
			echo $obj;
		}



	function getRequestInfo()
		{
			return json_decode(file_get_contents('php://input'), true);
		}
	
	
	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}




?>