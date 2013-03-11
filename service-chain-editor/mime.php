<?php


function authurl($url = '', $user = 'taverna', $pass = 'taverna') {
	$url = explode("://", trim($url));
	$url[] = $url[1];
	$url[1] = '://' . $user . ':' . $pass . '@';
	return implode('', $url);
}
if(isset($_GET['obj']) && isset($_GET['out'])) {
	if(file_exists('cache/exports/r' . $_GET['obj'])) {
		$ch = curl_init(authurl('http://vostok:8080/taverna-server/rest/runs/') . file_get_contents('cache/exports/r' . $_GET['obj']) . '/wd/out/' . $_GET['out']);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		curl_exec($ch);
		echo curl_getinfo($ch, CURLINFO_CONTENT_TYPE);
	}
}



?>