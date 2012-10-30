<?php
	echo file_get_contents($_GET['uri'] . '?request=DescribeProcess&service=WPS&identifier=' . $_GET['wsdl'] . '&version=1.0.0');
?>