<?php
	$_REQUEST['download'] = true;
	$uid = uniqid();
	if(isset($_GET['type'])) {
		if($_GET['type'] == 'taverna') {
			$data = $_POST['data'];
			$data = urlencode($data);
			$_REQUEST["xmlContent"] = $data;
			include('taverna.php');
			if(isset($_REQUEST['content']) && $_REQUEST['content'] !== '') {
				file_put_contents('cache/exports/t' . $uid, $_REQUEST['content']);
				echo $uid;
			}
		} else {
			if($_GET['type'] == 'netmar') {
				$data = $_POST['data'];
				$data = urlencode($data);
				$_REQUEST["xmlContent"] = $data;
				include('netmar.php');
				if(isset($_REQUEST['content']) && $_REQUEST['content'] !== '') {
					file_put_contents('cache/exports/n' . $uid, $_REQUEST['content']);
					echo $uid;
				}
			} else {
				if($_GET['type'] == 'get') {
					$obj = (isset($_GET['obj']) && $_GET['obj'] !== '') ? $_GET['obj'] : '';
					if(file_exists('cache/exports/n' . $obj)) {
						$data = file_get_contents('cache/exports/n' . $obj);
						$fileName = "netmar.export.xml";
						header("Content-Type: text/xml");
						header("Content-Disposition: attachment; filename=netmar.export.xml");
						header("Content-Length: " . strlen($data));
						echo($data);
					} else {
						if(file_exists('cache/exports/t' . $obj)) {
							$data = file_get_contents('cache/exports/t' . $obj);
							header("Content-Type: text/xml");
							header("Content-Disposition: attachment; filename=taverna.export.t2flow");
							header("Content-Length: " . strlen($data));
							echo $data;
						}
					}
				} else {
					if($_GET['type'] == 'run') {
						$data = isset($_POST['data']) ? $_POST['data'] : '';
						$data = urlencode($data);
						$_REQUEST["xmlContent"] = $data;
						include('run.php');
					}
				}
			}
		}
	}
?>