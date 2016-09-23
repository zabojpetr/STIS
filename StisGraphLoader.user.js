// ==UserScript==
// @name        StisGraphLoader
// @namespace   http://zaboj.ml
// @description Úprava STISu a přidání grafů úspěšnosti
// @include     http://stis.ping-pong.cz/*
// @downloadURL http://zaboj.ml/data/userscript/StisGraphLoader.user.js
// @version     1.0
// @grant       none
// ==/UserScript==

(function () {
    var scriptElement = document.createElement( "script" );
    scriptElement.type = "text/javascript";
    scriptElement.src = "http://zaboj.ml/data/userscript/StisGraph.user.js";
    scriptElement.charset = "UTF-8";
    document.body.appendChild( scriptElement );
})();