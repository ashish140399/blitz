<?php
	require_once("db_conn.php");
	
	switch ($_POST['button'])
	{
		case 'getUserInfo':
		
			$result = runsql("select * from user_profile where address='". $_POST['address']."';");
			if (count($result) > 0)
			{
				echo json_encode($result);
			}
			else
			{
				$result = [];
				echo json_encode($result);
			}
			break;

		default:
			break;
	}

?>