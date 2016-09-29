<?php
	header('Access-Control-Allow-Origin: http://stis.ping-pong.cz');  


	if (isset($_GET["version"])) {
		$myfile = fopen("http://zaboj.ml/data/userscript/StisGraph.user.js", "r");
		// Output one line until end-of-file
		$version = null;
		while(!feof($myfile)) {
  			$line = fgets($myfile);
  			if (strrpos($line, "@version")!==false) {
  				$version = substr($line, strrpos($line, "@version")+strlen("@version")).trim();
  				break;
  			}
		}
		fclose($myfile);
		echo $version;

			
	}
	if (isset($_GET['height'])) {
		?>
		<script>
		function getHeight(){
			console.log(document.getElementById("height").contentWindow.document.body.scrollHeight);
			document.body.innerHTML = document.getElementById("height").contentWindow.document.body.scrollHeight;
		}
		</script>
		<iframe id="height" src="http://zaboj.ml/stis.php" onload="getHeight()"></iframe>
		<?php
	}
?>