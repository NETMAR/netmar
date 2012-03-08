<?php
// example:  http://localhost/v1/proxy.php?url=http://wps.nersc.no/cgi-bin/iceclass.cgi?WSDL

if ($_SERVER['REQUEST_METHOD']=='HEAD'){
	//echo($_SERVER['REQUEST_URI']);
	try {
		$uri=filter_var($_SERVER['REQUEST_URI'],FILTER_SANITIZE_STRING,FILTER_SANITIZE_URL);
		$query=parse_url($uri,PHP_URL_QUERY);
		parse_str($query);
		if (!(isset($url))){
			throw new Exception('NO URL REQUEST');
		} else {
			//NOTE: The following curl code only makes an HEAD request 
			//but it takes the same amount of time as fopen since the server has always
			//to generate the file if since it is ?WSDL
			/*
			$ch = curl_init();
			curl_setopt ($ch, CURLOPT_RETURNTRANSFER, 1);
			curl_setopt ($ch, CURLOPT_URL, $url);
			curl_setopt ($ch, CURLOPT_CONNECTTIMEOUT, 20);
			curl_setopt ($ch, CURLOPT_USERAGENT, $_SERVER['HTTP_USER_AGENT']);

			// Only calling the head
			curl_setopt($ch, CURLOPT_HEADER, true); // header will be at output
			curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'HEAD'); // HTTP request is 'HEAD'
			curl_setopt($ch, CURLOPT_HTTP_VERSION, CURL_HTTP_VERSION_1_1); // ADD THIS

			$content = curl_exec ($ch);
			curl_close ($ch);
			echo($content);
			exit(0);
			*/
			
			if (@fopen($url,"r")){ 
				header("HTTP/1.0 200 OK");
				echo($url);
				exit(0);
			} else {
				throw new Exception('NO FILE');
			}
			
		}; //end if !(isset($url))

		} catch (Exception $e) {
			header("HTTP/1.0 404 Not Found");
			exit(0);
		};
	};//end of if $_SERVER
//No file 404 Not found
// 200 OK

//IF THE REQUEST IS GET OR POST
if ($_SERVER['REQUEST_METHOD']!='HEAD'){	
$parser=xml_parser_create();


$q = filter_var($_GET['url'],FILTER_SANITIZE_STRING,FILTER_SANITIZE_URL); // or $REQUEST would suffice?


$fp=fopen($q,"r");
if (!($fp)){
	header("HTTP/1.0 404 Not Found");
	exit(0);
};
//really checks that we have an XML content !!! Otherwise crash everything
while ($data=fread($fp,4096))
  {
  xml_parse($parser,$data,feof($fp)) or
  die (sprintf("XML Error: %s at line %d",
  xml_error_string(xml_get_error_code($parser)),
  xml_get_current_line_number($parser)));
  }

xml_parser_free($parser);
// Set your return content type
header('Content-type: application/xml');
$fp=fopen($q,"r");
while ($data=fread($fp,4096)){
echo $data;
};

} //end of REQUEST_METHOD !="HEAD


?>
