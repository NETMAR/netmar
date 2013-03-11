<?php
	header('Content-type: text/plain');
	if(isset($_GET['a']) && isset($_GET['b'])) {
		$file = md5('http://earthserver.pml.ac.uk/wps/semantic/main.py/compare?q1=' . $_GET['a'] . '&q2=' . $_GET['b']);
		if(file_exists('cache/wsdls/sema' . $file)) {
			echo file_get_contents('cache/wsdls/sema' . $file);
		} else {
			$data = strtolower(file_get_contents('http://earthserver.pml.ac.uk/wps/semantic/main.py/compare?q1=' . $_GET['a'] . '&q2=' . $_GET['b'])) == 'true' ? '1' : '0';
			file_put_contents('cache/wsdls/sema' . $file, $data);
			echo $data;
		}
	} else {
		echo '0';
	}
?>