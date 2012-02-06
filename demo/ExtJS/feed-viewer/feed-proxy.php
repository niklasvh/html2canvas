<?php
// this is an example server-side proxy to load feeds
$feed = $_REQUEST['feed'];
if($feed != '' && strpos($feed, 'http') === 0){
	header('Content-Type: text/xml');
	$xml = file_get_contents($feed);
	$xml = str_replace('<content:encoded>', '<content>', $xml);
	$xml = str_replace('</content:encoded>', '</content>', $xml);
	$xml = str_replace('</dc:creator>', '</author>', $xml);
	echo str_replace('<dc:creator', '<author', $xml);
	return;
}
