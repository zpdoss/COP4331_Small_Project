<?php
	$inData = getRequestInfo();
	
	$userID=$inData["userID"];
	$name = $inData["name"];
	$phone = $inData["phone"];
	$email = $inData["email"];


	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare("SELECT ID FROM Users WHERE ID=?");
		$stmt->bind_param("i",$userID);
		$stmt->execute();
		$id_result=$stmt->get_result();
		$stmt->close();

		$stmt = $conn->prepare("SELECT Phone FROM Contacts WHERE Phone=? AND UserID=?");
		$stmt->bind_param("si",$phone,$userID);
		$stmt->execute();
		$number_result=$stmt->get_result();
		$stmt->close();
		
		if($id_result->num_rows == 1 && $number_result->num_rows != 1)
		{
			$stmt = $conn->prepare("INSERT into Contacts (UserID,Name,Phone,Email) VALUES(?,?,?,?)");
			$stmt->bind_param("isss", $userID, $name, $phone, $email);
			$stmt->execute();
			$stmt->close();


			$stmt = $conn->prepare("SELECT UserID,Name,Phone,Email FROM Contacts WHERE UserID=? AND Name=? AND Phone=? AND Email=?");
			$stmt->bind_param("isss",$userID, $name, $phone, $email);
			$stmt->execute();
			$result = $stmt->get_result();
			if($row = $result->fetch_assoc())
			{
				returnWithInfo( $row['UserID'], $row['Name'], $row['Phone'], $row['Email']);
			}
			else
			{
			returnWithError("Unkown Error");
			}
			
			
			$stmt->close();
	    }
		else
		{
			returnWithError("Not valid UserID and/or Repeated Phone Number");
		}
	
	}
	
	$conn->close();

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
	function returnWithInfo( $UserID, $Name, $Phone, $Email )
	{
		$retValue = '{"UserID":' . $UserID . ',"Name":"' . $Name . '","Phone":"' . $Phone .'","Email":"' . $Email . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>