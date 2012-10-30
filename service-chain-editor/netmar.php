<?php

/* DEBUG
 */
error_reporting(E_ALL);
ini_set('display_errors', 'On');

$xmlEumisStr = $_REQUEST["xmlContent"];
$fileName = "netmar.export.xml";
$xmlEumisStr = urldecode($xmlEumisStr); //filter_var(base64_decode($xmlEumisStr), FILTER_UNSAFE_RAW);

$_REQUEST['content'] = $xmlEumisStr;
if(!isset($_REQUEST['download'])) {
	header("Content-Type: text/xml");
	header("Content-Disposition: attachment; filename=$fileName");
	header("Content-Length: " . strlen($xmlEumisStr));
	echo $_REQUEST['content'];
}
?>