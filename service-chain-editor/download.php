<?php
	$_REQUEST['download'] = true;
	$uid = uniqid();

	function diacritics() {
		return array(
			'À'=>'A','Á'=>'A','Â'=>'A','Ã'=>'A','Å'=>'A','Ä'=>'AE','Æ'=>'AE',
			'à'=>'a','á'=>'a','â'=>'a','ã'=>'a','å'=>'a','ä'=>'ae','æ'=>'ae',
			'Þ'=>'B','þ'=>'b','Č'=>'C','Ć'=>'C','Ç'=>'C','č'=>'c','ć'=>'c',
			'ç'=>'c','ð'=>'d','Đ'=>'Dj','đ'=>'dj','È'=>'E','É'=>'E','Ê'=>'E',
			'Ë'=>'E','è'=>'e','é'=>'e','ê'=>'e','ë'=>'e','Ì'=>'I','Í'=>'I',
			'Î'=>'I','Ï'=>'I','ì'=>'i','í'=>'i','î'=>'i','ï'=>'i','Ñ'=>'N',
			'ñ'=>'n','Ò'=>'O','Ó'=>'O','Ô'=>'O','Õ'=>'O','Ø'=>'O','Ö'=>'OE',
			'Œ'=>'OE','ð'=>'o','ò'=>'o','ó'=>'o','ô'=>'o','õ'=>'o','ö'=>'oe',
			'œ'=>'oe','ø'=>'o','Ŕ'=>'R','ŕ'=>'r','Š'=>'S','š'=>'s','ß'=>'ss',
			'Ù'=>'U','Ú'=>'U','Û'=>'U','Ü'=>'UE','ù'=>'u','ú'=>'u','û'=>'u',
			'ü'=>'ue','Ý'=>'Y','ý'=>'y','ý'=>'y','ÿ'=>'yu','Ž'=>'Z','ž'=>'z'
		);
	}

	function slug($string = '') {
		return preg_replace(
			'/[^\w\.!~*\'"(),]/','-',
			trim(strtr(strtolower($string), diacritics()))
		);
	}

	function mail_attachment($filename, $path, $mailto, $from_mail, $from_name, $replyto, $subject, $message) {
		$file = $path.$filename;
		$file_size = filesize($file);
		$handle = fopen($file, "r");
		$content = fread($handle, $file_size);
		fclose($handle);
		$content = chunk_split(base64_encode($content));
		$uid = md5(uniqid(time()));
		$name = basename($file);
		$header = "From: " . $from_name . " <" . $from_mail . ">\r\n";
		$header .= "Reply-To: " . $replyto . "\r\n";
		$header .= "MIME-Version: 1.0\r\n";
		$header .= "Content-Type: multipart/mixed; boundary=\"" . $uid . "\"\r\n\r\n";
		$header .= "This is a multi-part message in MIME format.\r\n";
		$header .= "--" . $uid . "\r\n";
		$header .= "Content-type:text/plain; charset=iso-8859-1\r\n";
		$header .= "Content-Transfer-Encoding: 7bit\r\n\r\n";
		$header .= $message . "\r\n\r\n";
		$header .= "--" . $uid . "\r\n";
		$header .= "Content-Type: application/octet-stream; name=\"" . (isset($_GET['name']) ? slug($_GET['name']) : 'netmar-export') . ".xml\"\r\n"; // use different content types here
		$header .= "Content-Transfer-Encoding: base64\r\n";
		$header .= "Content-Disposition: attachment; filename=\"" . (isset($_GET['name']) ? slug($_GET['name']) : 'netmar-export') . ".xml\"\r\n\r\n";
		$header .= $content . "\r\n\r\n";
		$header .= "--" . $uid . "--";
		if(mail($mailto, $subject, "", $header)) {
			echo ($_SERVER['SERVER_ADDR'] == '192.171.161.90') ? "0" : "1";
		} else {
			echo "0";
		}
	}

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
					if(isset($_GET['email'])) {
						mail_attachment('n' . $uid, 'cache/exports/', $_GET['email'], 'noreply-eumis-sce@pml.ac.uk', 'EUMIS Service Chain Editor', 'noreply-eumis-sce@pml.ac.uk', 'EUMIS Service Chain Editor - Netmar', "The attachment has been sent by a user sharing their SCE workflow " . (isset($_GET['name']) ? "(" . $_GET['name'] . ") " : "") . "with you.\n\nYou can download the flow and import it into the SCE to use/run/modify it further.");
					} else {
						echo $uid;
					}
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