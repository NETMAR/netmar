<?php

/* DEBUG */
set_time_limit(5);
error_reporting(E_ALL);
ini_set('display_errors', 'On');
function authurl($url = '', $user = 'taverna', $pass = 'taverna') {
	$url = explode("://", trim($url));
	$url[] = $url[1];
	$url[1] = '://' . $user . ':' . $pass . '@';
	return implode('', $url);
}

if($_GET['type'] == 'run') {
	if(!isset($_GET['obj']) || $_GET['obj'] == '') {
		include('taverna.php');
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, authurl('http://vostok:8080/taverna-server/rest/runs'));
		curl_setopt($ch, CURLOPT_RETURNTRANSFER,1);
		curl_setopt($ch, CURLOPT_POST, 1);
		curl_setopt($ch, CURLOPT_POSTFIELDS, $_REQUEST['content']);
		curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/vnd.taverna.t2flow+xml'));
		curl_setopt($ch, CURLOPT_VERBOSE, 1);
		curl_setopt($ch, CURLOPT_HEADER, 1);
		$result = curl_exec($ch);
		$header_size = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
		$header = substr($result, 0, $header_size);
		$header = explode("\n", $header);

		$location = '';
		for($i = 0; $i < count($header); $i++) {
			if(substr($header[$i], 0, 10) == 'Location: ') {
				$location = authurl(substr($header[$i], 10));
			}
		}
		if($location !== '') {
	        $ch = curl_init();
			curl_setopt($ch, CURLOPT_URL, $location . '/status');
	        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		    curl_setopt($ch, CURLOPT_PUT, 1);
			curl_setopt($ch, CURLOPT_VERBOSE, 1);
			curl_setopt($ch, CURLOPT_HEADER, 1);
			$handler = fopen('O', 'r');
		    curl_setopt($ch, CURLOPT_INFILE, $handler);
		    curl_setopt($ch, CURLOPT_INFILESIZE, 9);
	 
	        $response = curl_exec($ch);
	        if(!$response) {
	            return false;
	        }
			$id = explode('/', $location);
			$id = $id[count($id) - 1];
			file_put_contents('cache/exports/r' . $uid, $id);
			echo $uid;
		}
	} else {
		if(isset($_GET['out']) && $_GET['out'] == 'wd') {
			if(file_exists('cache/exports/r' . $_GET['obj'])) {
				$ch = curl_init(authurl('http://vostok:8080/taverna-server/rest/runs/') . file_get_contents('cache/exports/r' . $_GET['obj']) . '/wd/out');
				curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
				echo str_replace('vostok:8080/taverna-server/rest/runs/', 'earthserver.pml.ac.uk/taverna-server/rest/runs/', curl_exec($ch));
				curl_close($ch);
			}
		} else {
			if(file_exists('cache/exports/r' . $_GET['obj'])) {
				$ch = curl_init(authurl('http://vostok:8080/taverna-server/rest/runs/') . file_get_contents('cache/exports/r' . $_GET['obj']) . '/status');
				curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
				echo curl_exec($ch);
				curl_close($ch);
			}
		}
	}
}

?>