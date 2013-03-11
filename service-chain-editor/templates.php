<?php
	header('Content-type: text/html');
	function getTemplate($name) {
		echo "<" . $name . "late>\n" . file_get_contents("templates/" . $name . '.xhtml') . "</" . $name . "late>\n\n";
	}
	echo '<templates>';
	getTemplate('importdialog_async');
	getTemplate('importdialog');
	getTemplate('layerwindow_sync');
	getTemplate('layerwindow_async');
	getTemplate('layerhelp');
	getTemplate('menu');
	getTemplate('savedialog');
	getTemplate('saveoverdialog');
	getTemplate('deletedialog');
	getTemplate('serviceList-syncItem');
	getTemplate('serviceList-aSyncItem');
	getTemplate('serviceList-aSyncItem');
	getTemplate('serviceList-LI-Services');
	getTemplate('serviceList-WSDLItem');
	getTemplate('serviceWindow-IO-Input');
	getTemplate('serviceWindow-IO-Output');
	getTemplate('serviceWindow-Link');
	getTemplate('loadWSDL-Dialog');
	getTemplate('workspacePanel');
	getTemplate('settingsPanel');
	getTemplate('servicePanel');
	getTemplate('dialogBox');
	getTemplate('dialogProcess');
	echo '</templates>';
?>