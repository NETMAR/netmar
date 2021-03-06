<?php

/* DEBUG
 */
error_reporting(E_ALL);
ini_set('display_errors', 'On');

/*
 * FUNCTIONS
 */
function transform($xml, $xsl, $doc = false, $parameters = null) {

	$xslt = new XSLTProcessor();

	//setting parameters if existing
	if(!(is_null($parameters)) && is_array($parameters)) {
		//loop !thru parameters array
		foreach($parameters as $variable => $value)
		//no namespace in variables ''
			$xslt->setParameter('', $variable, $value);
	}
	$xslt->importStylesheet(new SimpleXMLElement($xsl));
	if($doc) {
		$result = $xslt->transformToDoc(new SimpleXMLElement($xml));
	} else {
		if($xml == '') {
			$result = '';
		} else {
			$result = $xslt->transformToXml(new SimpleXMLElement($xml));
		}
	}
	return $result;
};

/*
 * XSLT paths
 */

$xslWrapperURL	= "./XSLT/wrapperTypeXML.xslt";
$xslInjectURL	= "./XSLT/injectWSDL.xslt";
$xslT2FlowURL	= "./XSLT/t2flow.xslt";

/*
 * POST and sanitize, it is easier to pass the xml as base64
 */

$xmlEumisStr	= $_REQUEST["xmlContent"];
$fileName		= "eumis.t2flow";
$xmlEumisStr	= urldecode($xmlEumisStr); //filter_var(base64_decode($xmlEumisStr), FILTER_UNSAFE_RAW);

/*
 * Convert xmlEumis to SimpleXML and extract WSDL URL, date and UUID
 */

$xmlEumisDoc	= new SimpleXMLElement($xmlEumisStr);

$wsdlURL		= $xmlEumisDoc->xpath("//*[local-name()='wsdlURL']/text()");
if(isset($wsdlURL[0])) {
	if(isset($wsdlURL[0][0])) {
	$wsdlURL		= $wsdlURL[0][0];
		if(
			substr(strtolower($wsdlURL), 0, 6) !== 'ftp://' &&
			substr(strtolower($wsdlURL), 0, 7) !== 'http://' &&
			substr(strtolower($wsdlURL), 0, 8) !== 'https://'
		) {
			$wsdlURL	= $_SERVER['HTTP_REFERER'] . $wsdlURL;
		}
	} else {
		$wsdlURL	= '';
	}
} else {
	$wsdlURL	= '';
}
$dateEumis		= $xmlEumisDoc->xpath("//*[local-name()='date']/text()");
$dateEumis		= $dateEumis[0][0];

$uuidEumis		= $xmlEumisDoc->xpath("//*[local-name()='uuid']/text()");
$uuidEumis		= $uuidEumis[0][0];

/*
 * 1) GET WSDL and run wrapperXML transformation. DataInputs and ProcessOutputs are generate from WSDL and integrated to t2flow
 * <wrapperXML> element stucture
 */

if(file_exists(getcwd() . str_replace('http://', '', str_replace('..', '/', str_replace('./', '/', $wsdlURL))))) {
	$wsdlURL		= getcwd() . str_replace('http://', '', str_replace('..', '/', str_replace('./', '/', $wsdlURL)));
}
if(file_exists('./cache/wsdls/' . md5($wsdlURL))) {
	$wsdlURL		= './cache/wsdls/' . md5($wsdlURL);

}

$xmlWSDLString		= file_get_contents($wsdlURL);
$xslWrapperString	= file_get_contents($xslWrapperURL);

$xmlWrapperXML		= transform($xmlWSDLString, $xslWrapperString);

/*
 * 2) Add xmlWrapperXML to Eumis XML file (injection operation). The wrapperXML document is called from inside the injectWSDL
 * it is necessary to to save the xmlWrapperXML into an acessible URL
 */

$tmpFileName		= uniqid() . '.xml';
$fh					= fopen("/tmp/" . $tmpFileName, 'w') or die("cant open file");

fwrite($fh, $xmlWrapperXML);
fclose($fh);

$xmlWrapperURL		= "/tmp/" . $tmpFileName;

// Inject
$parametersArr		= array('wrapperURL' => $xmlWrapperURL);
$xslInjectString	= file_get_contents($xslInjectURL);
$result				= transform($xmlEumisStr, $xslInjectString, $doc = true, $parametersArr);

/*
 * 3) now the Eumis XML has the wrapperXML inside, all the necessary information to generate t2flow is inside the
 *  the wrapperXML need to be converted into a string structure
 */

$xPath				= new DOMXPath($result);
$nodeList			= $xPath->query("//*[local-name()='DataInputs' or local-name()='ProcessOutputs']");

$entries			= $nodeList;

for($i = 0; $i < $entries->length; $i++) {
	//This works
	//$entries->item($i)->parentNode->removeChild($entries->item($i));

	$stringC14N		= $entries->item($i);

	if($entries->item($i)->firstChild !== null) {
		$stringC14N = $entries->item($i) -> firstChild->C14N();
		$stringC14N = str_replace("<", "&lt;", $stringC14N);
		$stringC14N = str_replace(">", "&gt;", $stringC14N);

		$newelement = $result->createTextNode($stringC14N);
		$entries->item($i)->replaceChild($newelement, $entries->item($i)->firstChild);
	}
}
//change &amp to &, small problem with chars
$resultFinalStr	= $result->C14N();
$resultFinalStr	= str_replace("&amp;", "&", $resultFinalStr);

/*
 * DEBUG
 $fh2=fopen("/tmp/eumisB4t2flow.xml",'w') or die("cant open file");
 fwrite($fh2,$resultFinalStr);
 fclose($fh2);
 */

/*
 * 4) The Eumis file is now prepared to be transformed into to t2flow
 */
/* seperate out the content for the t2flow.xslt file into managable template sections*/ /*<---- to be done friday -->*/
$xsltT2FlowString	= file_get_contents($xslT2FlowURL);

$t2flowArr			= array('dateEumis' => $dateEumis, 'uuidEumis' => $uuidEumis);
$t2flowFinal		= transform($resultFinalStr, $xsltT2FlowString, $doc = FALSE, $t2flowArr);
$t2flowFinal		= implode("\n", array_slice(explode("\n", $t2flowFinal), 1));

/*
 * DELETE wrapperXML file
 */

unlink("/tmp/" . $tmpFileName);

/*
 * DUMP
 */

$t2flowFinal =	trim(
				str_replace('  ', "\t",
				str_replace('/>', " />",
					$t2flowFinal
				)));

$_REQUEST['content'] = $t2flowFinal;
if(!isset($_REQUEST['download'])) {
header("Content-Type: text/xml");
header("Content-Disposition: attachment; filename=$fileName");
header("Content-Length: " . strlen($t2flowFinal));

echo $t2flowFinal;
}
?>