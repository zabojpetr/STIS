<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
    <title>Záboj.ml - Vylepšení STISu</title>
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
	<h1>Uživatelský skript pro STIS</h1>
	<h2>Přidání grafů úspěšnosti do STISu</h2>
	<br>
	<h3>Náhledy</h3>
	<img src="data/other/stisTabulka.png" alt="Tabulka">
	<br>
	<img src="data/other/stisUspesnost.png" alt="Úspěšnost">
	<br>
	<img src="data/other/stisDruzstvo.png" alt="Družstvo">
	<br>
	<h3>Návod k instalaci</h3>
	<p>
		Před nainstalováním toho skriptu si nainstaluje doplněk GreaseMonkey nebo TamperMonkey nebo nějaký jiný, který umožní spouštět uživatelské skripty
		<ul>
			<li><a target="_blank" href="https://addons.mozilla.org/cs/firefox/addon/greasemonkey/" title="Firefox - Greasemonkey">Firefox - Greasemonkey</li>
			<li><a target="_blank" href="https://addons.mozilla.org/cs/firefox/addon/tampermonkey/?src=ss" title="Firefox - Tampermonkey">Firefox - Tampermonkey</li>
			<li><a target="_blank" href="https://addons.mozilla.org/cs/firefox/addon/userunified-script-injector/" title="Firefox - USI">Firefox Mobile - User|Unified Script Injector</li>
			<li><a target="_blank" href="https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=cs" title="Chrome - Tampermonkey">Chrome - Tampermonkey</li>
			<li><a target="_blank" href="https://addons.opera.com/cs/extensions/details/tampermonkey-beta/?display=en" title="Opera - Tampermonkey">Opera - Tampermonkey</li>
			<li><a target="_blank" href="http://tampermonkey.net/?ext=dhdg&browser=edge" title="Edge - Tampermonkey">Edge - Tampermonkey</li>
			<li><a target="_blank" href="https://addons.opera.com/cs/extensions/details/tampermonkey-beta/?display=en" title="Opera - Tampermonkey">Opera - Tampermonkey</li>
		</ul>
	</p>
	<br>
	<br>
	<?php
		$myfile = fopen("http://zaboj.ml/data/userscript/StisGraphLoader.user.js", "r");
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

	<a class="btn" href="http://zaboj.ml/data/userscript/StisGraphLoader.user.js" title="Skript">Nainstalovat skript StisGraphLoader<?= $version!=null?" ".$version.trim():"";?></a>
	<br>
	<br>

	<?php include_once("analyticstracking.php") ?>
</body>
</html>