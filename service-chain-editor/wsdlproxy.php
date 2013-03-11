<?php
	function get_data($uri) {
		$data = '';
		$tmp = '';
		$fp = fopen($uri, "r");
		while($tmp = fread($fp, 4096)){
			$data .= $tmp;
		}
		$data = explode("\n", $data);
		if(substr(trim($data[0]), 0, 5) == '<?xml') {$data[0] = '';}
		$data = implode("\n", $data);
		return	str_replace('ows:', 'ows',
				str_replace('/ows:', '/ows',
				str_replace('wps:', 'wps',
				str_replace('/wps:', '/wps',
				str_replace('xlink:href', 'href',
				str_replace('xlink:title', 'title',
				str_replace('xmlns:', 'xmlns',
				str_replace('xml:', 'xml',
				str_replace('xsi:', 'xsi',
				str_replace('<Input', '<terminalInput',
				str_replace('<input', '<terminalinput',
				str_replace('<Output', '<terminalOutput',
				str_replace('<outnput', '<terminaloutput',
				str_replace('</Input', '</terminalInput',
				str_replace('</input', '</terminalinput',
				str_replace('</Output', '</terminalOutput',
				str_replace('</outnput', '</terminaloutput',
					$data
				)))))))))))))))));
	}
	header('Content-type: text/xml');
	if(isset($_GET['uri'])) {
		if(isset($_GET['wsdl'])) {
			if(file_exists('cache/wsdls/desc' . md5($_GET['uri'] . $_GET['wsdl']))) {
				echo file_get_contents('cache/wsdls/desc' . md5($_GET['uri'] . $_GET['wsdl']));
			} else {
				$data = get_data($_GET['uri'] . (substr($_GET['uri'], -1, 1) == '?' ? '' : '?') .'service=WPS&request=DescribeProcess&version=1.0.0&identifier=' . $_GET['wsdl']);
				file_put_contents('./cache/wsdls/desc' . md5($_GET['uri'] . $_GET['wsdl']), $data);
				echo $data;
			}
		} else {
			if(file_exists('cache/wsdls/cap' . md5($_GET['uri']))) {
				echo file_get_contents('cache/wsdls/cap' . md5($_GET['uri']));
			} else {
				$data = get_data($_GET['uri'] . '?request=GetCapabilities&service=WPS');
				file_put_contents('./cache/wsdls/cap' . md5($_GET['uri']), $data);
				echo $data;
			}
		}
	}
?>