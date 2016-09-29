<html>
<head>
<title>
Aktualizace skriptu
</title>
<style>
		body {
    		text-align: center;
		}

		ul, li{
			list-style: none;
			margin: 0;
			padding: 0;
		}

		img{
			border: 1px black solid;
			width: 500px;
		}

		.btn {
  background: #34d93f;
  background-image: -webkit-linear-gradient(top, #34d93f, #36b82b);
  background-image: -moz-linear-gradient(top, #34d93f, #36b82b);
  background-image: -ms-linear-gradient(top, #34d93f, #36b82b);
  background-image: -o-linear-gradient(top, #34d93f, #36b82b);
  background-image: linear-gradient(to bottom, #34d93f, #36b82b);
  -webkit-border-radius: 28;
  -moz-border-radius: 28;
  border-radius: 28px;
  color: #ffffff;
  font-size: 20px;
  padding: 10px 20px 10px 20px;
  text-decoration: none;
}

.btn:hover {
  background: #6aeb36;
  background-image: -webkit-linear-gradient(top, #6aeb36, #4ad934);
  background-image: -moz-linear-gradient(top, #6aeb36, #4ad934);
  background-image: -ms-linear-gradient(top, #6aeb36, #4ad934);
  background-image: -o-linear-gradient(top, #6aeb36, #4ad934);
  background-image: linear-gradient(to bottom, #6aeb36, #4ad934);
  text-decoration: none;
}
	</style>
</head>
<body>
<h1>Aktualizace skriptu</h1>

Více podrobností o aktualizaci <a target="_blank" href="https://github.com/zabojpetr/STIS/commits/master">ZDE</a>
<br>
<br>
<?php
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
	?>

	<a class="btn" href="http://zaboj.ml/data/userscript/StisGraph.user.js" title="Skript">Nainstalovat skript StisGraph<?= $version!=null?" ".$version.trim():"";?></a>
	<br>
	<br>

	<?php include_once("analyticstracking.php") ?>
</body>
</html>