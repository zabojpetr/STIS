// ==UserScript==
// @name        StisGraph
// @namespace   http://zaboj.ml
// @description Úprava STISu a přidání grafů úspěšnosti
// @include     http://stis.ping-pong.cz/*
//@downloadURL  http://zaboj.ml/data/userscript/StisGraph.user.js
// @version     1.5
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_info
// ==/UserScript==


var path = window.location.pathname;
//var serverScriptPath = "https://github.com/zabojpetr/STIS";
var serverScriptPath = "http://zaboj.ml/stisAktualizace.php";


//škálování barev
function ColorRound(procenta) {
    return Math.round(procenta/10)*10;
}

//Vytvoření line grafu
function CreateGraph(uspesnost)
{
    var obal = document.createElement("div");
    obal.style.border = "1px solid";
    obal.style.width = "100%";
    obal.style.minWidth = "50px";
    obal.style.height = "5px";
    obal.style.overflow = "hidden";
    obal.style.margin = "0";
    obal.style.padding = "0";
    var div1 = document.createElement("div");
    div1.style.width = uspesnost+"%";
    div1.style.backgroundColor = "hsl("+ColorRound(uspesnost)+",100%,"+(50-ColorRound(uspesnost)/10)+"%)";
    div1.innerHTML = "&nbsp;";

    obal.insertBefore(div1,null);
    return obal;
}

//převod buňky s poměrem na úspěšnost
function pomer2Uspesnost(s)
{
    if(s==undefined || s==null || s.length == 0) return 0;

    var pomer = s.split(":");
    pomer[0] = parseInt(pomer[0]);
    pomer[1] = parseInt(pomer[1]);
    return (pomer[0]+pomer[1])!=0?Math.round(pomer[0]/(pomer[0]+pomer[1])*10000)/100:0;
}

//Vytvoření hlavičky th s mezerou
function CreateHeader(nazev, mezera) {
    var th = document.createElement("th");
    th.style.borderBottom = "2px solid grey";
    th.style.paddingLeft = mezera;
    th.style.paddingRight = mezera;
    th.style.textAlign = "center";
    var strong = document.createElement("strong");
    strong.innerHTML = nazev;
    th.insertBefore(strong, null);
    return th;
}

//vytvoření hlavičky th
function CreateHeader(nazev) {
    var th = document.createElement("th");
    th.style.borderBottom = "2px solid grey";
    th.style.textAlign = "center";
    var strong = document.createElement("strong");
    strong.innerHTML = nazev;
    th.insertBefore(strong, null);
    return th;
}

//ztmavení barvy
function ColorLuminance(hex, lum) {

    // validate hex string
    hex = String(hex).replace(/[^0-9a-f]/gi, '');
    if (hex.length < 6) {
        hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
    }
    lum = lum || 0;

    // convert to decimal and change luminosity
    var rgb = "#", c, i;
    for (i = 0; i < 3; i++) {
        c = parseInt(hex.substr(i*2,2), 16);
        c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
        rgb += ("00"+c).substr(c.length);
    }

    return rgb;
}

function GenerateRowOfSoupiska(pozice, jmeno, pomerDvouhra, pomerCtyrhra)
{
    //vytvoření elementů
    var tr = document.createElement("tr");
    var position = document.createElement("td");
    var name = document.createElement("td");
    var dvouhry = document.createElement("td");
    var ctyrhry = document.createElement("td");
    var mezera = document.createElement("td");
    var dvouhryp = document.createElement("td");
    var ctyrhryp = document.createElement("td");

    //nastavení pozice
    position.innerHTML = pozice + ".";
    position.style.textAlign="right";

    //nastavení jména
    name.style.fontWeight = "bold";
    name.style.width = "250px";
    name.appendChild(jmeno);

    //poměr dvouher
    var strong = document.createElement("strong");
    strong.insertBefore(pomerDvouhra,null);
    dvouhry.insertBefore(strong,null);
    dvouhry.style.textAlign="center";

    //procenta a graf dvouher
    dvouhryp.innerHTML = "<div width='100%' align='center'>" + pomer2Uspesnost(pomerDvouhra.innerHTML).toFixed(2) + "%</div>";
    dvouhryp.insertBefore(CreateGraph(pomer2Uspesnost(pomerDvouhra.innerHTML)),null);
    dvouhryp.setAttribute("align","right");

    //mezera
    mezera.style.width = "30px";

    //poměr čtyřher
    var strong = document.createElement("strong");
    strong.insertBefore(pomerCtyrhra,null);
    ctyrhry.insertBefore(strong,null);
    ctyrhry.style.textAlign="center";

    //procenta a graf čtyřher
    ctyrhryp.innerHTML = "<div width='100%' align='center'>" + pomer2Uspesnost(pomerCtyrhra.innerHTML).toFixed(2) + "%</div>";
    ctyrhryp.insertBefore(CreateGraph(pomer2Uspesnost(pomerCtyrhra.innerHTML)),null);
    ctyrhryp.setAttribute("align","right");

/* pokud by byl graf pod poměrem a procentama
    var spanc = document.createElement("span");
    spanc.insertBefore(pomerCtyrhra,null);
    spanc.style.float = "left";
    spanc.style.textAlign = "center";
    spanc.style.width = "50%";

    var spancp = document.createElement("span");
    spancp.innerHTML = "<strong>" + pomer2Uspesnost(pomerCtyrhra.innerHTML).toFixed(2) + "%</strong>";
    spancp.style.float = "right";

    var br = document.createElement("br");
    br.style.float = "none";

    var graph = CreateGraph(pomer2Uspesnost(pomerCtyrhra.innerHTML));

    ctyrhryp.insertBefore(spanc,null);
    ctyrhryp.insertBefore(spancp,null);
    ctyrhryp.insertBefore(br,null);
    ctyrhryp.insertBefore(graph,null);
*/

//vložení elementů do řádku
    tr.insertBefore(position,null);
    tr.insertBefore(name,null);
    tr.insertBefore(dvouhry,null);
    tr.insertBefore(dvouhryp,null);
    tr.insertBefore(mezera,null);
    tr.insertBefore(ctyrhry,null);
    tr.insertBefore(ctyrhryp,null);

    return tr;
}

function LightWindow(content) {
    var body = document.body;
    document.getElementsByTagName("html")[0].style.overflow = "hidden";
    /*body.innerHTML += "" +
        "<div id='StisGraphLightWindowOverlap' style='position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.9); overflow: auto;'>" +
            "<div id='StisGraphLightWindow' style='position: relative; width: 900px; height: 2000px; background: white; margin: 2% auto'>" +
            "</div>" +
        "</div>";*/
    var overlap = LightWindowOverlap();
    //console.log(overlap);
    var mainWindow = LightWindowBody();
    //console.log(mainWindow);


    mainWindow.insertBefore(content,null);
    window.addEventListener("resize", ChangeMargin);
    overlap.insertBefore(mainWindow, null);
/*
    console.log(window.innerHeight);
    console.log(window.outerHeight);
    console.log(mainWindow.offsetHeight);
    console.log((window.innerHeight - mainWindow.scrollHeight)/2);
*/
    body.insertBefore(overlap, null);

    ChangeMargin();

    var overlap = document.getElementById("StisGraphLightWindowOverlap");
    overlap.addEventListener("click", HideLightWindow);
    var div = document.getElementById("StisGraphLightWindow");
    div.addEventListener("click", StopEventPropagation);
}

function ChangeMargin()
{
    var div = document.getElementById("StisGraphLightWindow");

    //console.log(div.scrollHeight);
    //console.log(div.offsetHeight);

    div.style.marginTop = (window.innerHeight - div.scrollHeight)/2 < 40 ? "40px" : (window.innerHeight - div.scrollHeight)/2 + "px";
    div.style.marginBottom = div.style.marginTop;
    div.style.marginLeft = (window.innerWidth - div.scrollWidth)/2 < 40 ? "40px" : (window.innerWidth - div.scrollWidth)/2 + "px";
    div.style.marginRight = div.style.marginLeft;
}

function LightWindowOverlap()
{
    var div = document.createElement("div");
    div.setAttribute("id","StisGraphLightWindowOverlap");
    div.style.position = "fixed";
    div.style.top = "0";
    div.style.left = "0";
    div.style.width = "100%";
    div.style.height = "100%";
    div.style.background = "rgba(0,0,0,0.8)";
    div.style.overflow = "auto";
    div.style.display = "block";


    var close = document.createElement("p");
    close.style.color = "white";
    close.style.position = "fixed";
    close.style.top = "0";
    close.style.right = "0";
    close.style.textAlign = "right";
    close.style.padding = "10px 20px";
    close.style.fontSize = "1.2em";
    close.style.fontWeight = "bold";

    close.innerHTML = "Zavřít";

    div.insertBefore(close, null);

    return div;
}

function LightWindowBody()
{
    var div = document.createElement("div");
    div.setAttribute("id","StisGraphLightWindow");
    div.style.position = "relative";
    div.style.maxWidth = "900px";
    div.style.minWidth = "450px";
    div.style.height = "200px";
    div.style.background = "white";

    return div;
}

function HideLightWindow() {
    document.body.removeChild(document.getElementById('StisGraphLightWindowOverlap'));
    document.getElementsByTagName("html")[0].style.removeProperty("overflow");
    window.removeEventListener("resize", ChangeMargin);
    try
    {
        document.getElementById("StisGraphUpdateNotify").addEventListener("click", ShowUpdateDetail);
    }
    catch(err)
    {
        //console.log(err);
    }

    //console.log("HideLightWindow: OK");
}

function StopEventPropagation(ev) {
    ev.stopPropagation();
    //console.log("StopEventPropagation: OK");
}

function ShowUpdateDetail(){
    var iframe = document.createElement("iframe");
    iframe.setAttribute("src", serverScriptPath);
    iframe.style.width = "100%";
    iframe.style.minHeight = "200px";
    iframe.setAttribute("id", "StisGraphIframe");

    LightWindow(iframe);
}

function TestNewUpdate(){
    var scriptOnServer;
    var thisVersion = GM_info.script.version;

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            scriptOnServer = this.responseText;
            scriptOnServer = scriptOnServer.trim();

            if(CompareVersion(thisVersion, scriptOnServer) < 0) // nová verze
            {
                NotifyUpdate();
                if((GM_getValue("lastNotify")==undefined) || ((Date.now() - GM_getValue("lastNotify")) > 24*60*60*1000))
                {
                    ShowUpdateDetail();
                    GM_setValue("lastNotify", Date.now());
                }
            }
        }
    };
    xhttp.open("GET", "http://zaboj.ml/data/userscript/info.php?version", true);
    xhttp.send();

}

function CompareVersion(v1, v2)
{
    var split1 = v1.split(".");
    var split2 = v2.split(".");
    for (var i = 0; i < Math.min(split1.length, split2.length); i++)
    {
        if(split1[i] < split2[i])
        {
            return -1;
        }
        else if (split1[i] > split2[i])
        {
            return 1;
        }
    }
    if(split1.length < split2.length)
    {
        return -1;
    }
    else if(split1.length > split2.length)
    {
        return 1;
    }
    else
    {
        return 0;
    }
}


function NotifyUpdate() {
    var body = document.body;
    var div = document.createElement("div");
    div.setAttribute("id","StisGraphUpdateNotify");
    div.style.padding = "5px 10px";
    div.style.border = "1px red solid";
    div.style.backgroundColor = "#FAA";
    div.style.position = "fixed";
    div.style.top = "0";
    div.style.right = "0";
    div.style.fontWeight = "bold";
    div.innerHTML = "Dostupný nový update!";
    div.style.cursor = "pointer";

    div.addEventListener("click", ShowUpdateDetail);

    body.insertBefore(div, null);
}

//úspěšnost dvouher a čtyrher
if(path.startsWith("/htm/uspesnost.php"))
{
    var contentDiv = document.getElementById("content");
    //console.log(contentDiv);
    var table = contentDiv.getElementsByTagName("div")[0].getElementsByTagName("table")[0].getElementsByTagName("tbody")[0];
    //console.log(table);
    var rows = table.getElementsByTagName("tr");

    for (var i = 0; i < rows.length; i++) {
        if(i%2==1)rows[i].style.backgroundColor = "#EEEEEE";

        if(rows[i].getElementsByTagName("td")[0].getAttribute("class")!="info")continue;

        var uspesnost = rows[i].getElementsByTagName("td")[rows[i].getElementsByTagName("td").length-1].innerHTML;
        rows[i].getElementsByTagName("td")[rows[i].getElementsByTagName("td").length-1].innerHTML = "<strong>"+uspesnost+"</strong>";
        uspesnost = uspesnost.substring(0,uspesnost.length-1);

        var td = rows[i].getElementsByTagName("td")[rows[i].getElementsByTagName("td").length-1];
        var br = document.createElement("br");
        var graph = CreateGraph(uspesnost);

        td.insertBefore(br,null);
        td.insertBefore(graph,null);
    }
}
//tabulka
else if(path.startsWith("/htm/soutez.php"))
{
    var contentDiv = document.getElementById("content");
    //console.log(contentDiv);
    var table = contentDiv.getElementsByTagName("div")[0].getElementsByTagName("table")[0].getElementsByTagName("table");
    table[table.length-1].setAttribute("width","700");
    table = table[table.length-1].getElementsByTagName("tbody")[0]; //podlední tabulka - kvůli některým play-off


    var tableHeader = document.createElement("thead");
    var tableHeaderTr = document.createElement("tr");

    tableHeaderTr.insertBefore(CreateHeader(""), null);

    tableHeaderTr.insertBefore(CreateHeader("Název týmu"), null);

    tableHeaderTr.insertBefore(CreateHeader("U", "5px"), null);

    tableHeaderTr.insertBefore(CreateHeader("V", "5px"), null);

    tableHeaderTr.insertBefore(CreateHeader("R", "5px"), null);

    tableHeaderTr.insertBefore(CreateHeader("P", "5px"), null);

    tableHeaderTr.insertBefore(CreateHeader("K", "5px"), null);

    var th = CreateHeader("Skóre");
    th.setAttribute("colspan","2");
    tableHeaderTr.insertBefore(th, null);

    tableHeaderTr.insertBefore(CreateHeader("Body"), null);

    tableHeader.insertBefore(tableHeaderTr,null);

    table.parentNode.insertBefore(tableHeader,table);

    //console.log(table);
    var rows = table.getElementsByTagName("tr");
    //console.log(rows);

    for (var i = 0; i < rows.length; i++) {
        if(i%2==1)rows[i].style.backgroundColor = "#EEEEEE";
        //if(rows[i].getElementsByTagName("td")[0].getAttribute("class")!="info")continue;

        if(rows[i].getElementsByTagName("td").length<2) continue;

        var uspesnost = pomer2Uspesnost(rows[i].getElementsByTagName("td")[rows[i].getElementsByTagName("td").length-2].innerHTML);

        var newTd = document.createElement("td");
        newTd.style.width = "50px";
        newTd.style.textAlign = "center";

        var hr = document.createElement("br");

        var graph = CreateGraph(uspesnost);

        newTd.innerHTML = uspesnost.toFixed(2) + "%";
        newTd.insertBefore(hr,null);
        newTd.insertBefore(graph,null);
        rows[i].insertBefore(newTd,rows[i].getElementsByTagName("td")[rows[i].getElementsByTagName("td").length-1]);
        rows[i].getElementsByTagName("td")[rows[i].getElementsByTagName("td").length-1].style.fontWeight = "bold";

        //rows[i].getElementsByTagName("td")[0].innerHTML = "<strong>" + rows[i].getElementsByTagName("td")[0].innerHTML + "</strong>"
        rows[i].getElementsByTagName("td")[0].style.paddingRight = "10px";

        //console.log(newDiv);
    }
}
//soupiska
else if(path.startsWith("/htm/druzstvo.php"))
{
    var contentDiv = document.getElementById("content");
    //console.log(contentDiv);
    var table = contentDiv.getElementsByTagName("div")[0].getElementsByTagName("table")[0].getElementsByTagName("tbody")[0];
    //console.log(table);
    var list = table.getElementsByTagName("tr")[1].getElementsByTagName("td")[1];
    //console.log(list);
    var brs = list.getElementsByTagName("br");
    //console.log(brs);

    var table = document.createElement("table");
    table.style.width = "100%";
    table.style.borderCollapse = "collapse";
    var thead = document.createElement("thead");
    thead.insertBefore(CreateHeader(""),null);
    thead.insertBefore(CreateHeader("Jméno hráče"),null);
    var th = CreateHeader("Dvouhry");
    th.setAttribute("colspan","2");
    thead.insertBefore(th,null);
    thead.insertBefore(CreateHeader(""),null);
    var th = CreateHeader("Čtyřhry");
    th.setAttribute("colspan","2");
    thead.insertBefore(th,null);
    table.insertBefore(thead,null);



    var position = 0;


    for (var i = 0; i < brs.length-1; i++) {
        //console.log("V cyklu");
        if(brs[i].nextElementSibling.tagName.toLowerCase()!="a")
        {
            var tr = document.createElement("tr");
            if(i%2 == 1)tr.style.backgroundColor = "#EEEEEE";
            var td = document.createElement("td");
            //var td = CreateHeader("");

            td.setAttribute("colspan","7");
            td.style.textAlign="center";

            td.insertBefore(brs[i].nextElementSibling.cloneNode(true),null);
            tr.insertBefore(td,null);
            table.insertBefore(tr,null);

            continue;
        } //nenásleduje odkaz = jméno hráče
        //console.log("Za podmínkou");

        position++;
        var uspesnostDvouhry = 0;
        var uspesnostCtyrhry = 0;

        var pomerDvouhry = document.createElement("span");
        pomerDvouhry.innerHTML = "0:0";
        var pomerCtyrhry = document.createElement("span");
        pomerCtyrhry.innerHTML = "0:0";
        var jmeno = document.createElement("span");
        jmeno.innerHTML = "Jmeno";

        var s = brs[i].nextElementSibling;
        while(s.tagName.toLowerCase()!="br")
        {
            if(s.tagName.toLowerCase() == "font")
            {
                var span = document.createElement("span");
                span.insertBefore(jmeno.cloneNode(true),null);
                jmeno = span;
                jmeno.innerHTML += " - ";
                jmeno.insertBefore(s.cloneNode(true),null);
                s = s.nextElementSibling;
                jmeno.insertBefore(s.cloneNode(true),null);
            }
            else if(s.getAttribute("href").startsWith("hrac"))
            {
                jmeno = s.cloneNode(true);
            }
            else if(s.getAttribute("href").startsWith("dvouhry"))
            {
                //uspesnostDvouhry = pomer2Uspesnost(s.innerHTML);

                //s.innerHTML += " - <strong>" + uspesnostDvouhry + "%</strong>";

                pomerDvouhry = s.cloneNode(true);
            }
            else if(s.getAttribute("href").startsWith("ctyrhry"))
            {
                //uspesnostCtyrhry = pomer2Uspesnost(s.innerHTML);

                //s.innerHTML += " - <strong>" + uspesnostCtyrhry + "%</strong>";

                pomerCtyrhry = s.cloneNode(true);
            }

            s = s.nextElementSibling;
        }


        //var graph2 = CreateGraph(uspesnostDvouhry);
        //var graph4 = CreateGraph(uspesnostCtyrhry);

        //brs[i].parentElement.insertBefore(graph2,brs[i+1]);
        //brs[i].parentElement.insertBefore(graph4,brs[i+1]);

        var tr = GenerateRowOfSoupiska(position, jmeno, pomerDvouhry, pomerCtyrhry);
        if(i%2 == 1)tr.style.backgroundColor = "#EEEEEE";
        table.insertBefore(tr,null);


        //console.log(newDiv);
    }

    //var parent = brs[0].parentElement;
    list.innerHTML = "";
    list.style.width = "70%";

    list.insertBefore(table, brs[brs.length-1]);
/*
    for(i = brs.length-1; i>=0; i--)
    {
        //console.log(brs[i].previousElementSibling.tagName.toLowerCase())
        if(brs[i].previousElementSibling.tagName.toLowerCase()=="div")
        {
            //console.log("V podmínce");
            brs[i].previousElementSibling.style.marginBottom="5px";
            var parent = brs[i].parentNode;
            parent.removeChild(brs[i]);
        }
    }*/

}
//los a výsledky
else if(path.startsWith("/htm/vysledky.php") || path.startsWith("/htm/dvouhry.php") || path.startsWith("/htm/ctyrhry.php") || path.startsWith("/htm/soupisky.php"))
{
    var contentDiv = document.getElementById("content");
    //console.log(contentDiv);
    var table = contentDiv.getElementsByTagName("div")[0].getElementsByTagName("table")[0].getElementsByTagName("tbody")[0];
    //console.log(table);
    var rows = table.getElementsByTagName("tr");

    for (var i = 0; i < rows.length; i++) {
        //console.log(rows[i].getAttribute("bgcolor"));
        //console.log(ColorLuminance(rows[i].getAttribute("bgcolor"),-0.1));

        if(i%2==1)rows[i].style.backgroundColor = "#EEEEEE";
    }
}

TestNewUpdate();