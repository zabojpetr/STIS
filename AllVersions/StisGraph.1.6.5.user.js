// ==UserScript==
// @name        StisGraph
// @namespace   http://zaboj.ml
// @description Úprava STISu a přidání grafů úspěšnosti
// @include     http://stis.ping-pong.cz/*
// @include     https://stis.ping-pong.cz/*
//@downloadURL  https://github.com/zabojpetr/STIS/raw/master/StisGraph.user.js
// @version     1.6.5
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_info
// ==/UserScript==

/**
 * Ceskta k zobrazovanému souboru.
 * @type {string}
 */
var path = window.location.pathname;
/**
 * Cesta ke setránce s aktualizací skriptu.
 * @type {string}
 */
var serverScriptPath = "http://zaboj.ml/stisAktualizace.php";


/**
 * Škálování barev v grafech úspěšnosti.
 * @param {number} procenta Procenta úspěšnosti
 * @returns {number} úspěšnost Zaokrouhlená úspěšnost na 5, 15, 25,...
 */
function ColorRound(procenta) {
    return Math.round(procenta/10)*10;
}

/**
 * Vytvoření grafu úspěšnosti.
 * @param uspesnost Úspěšnost v procentech
 * @returns {Element} Element div s grafem
 */
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

/**
 * Převedení poměru na procenta.
 * @param {string} s Řetězec s poměrem ve tvaru číslo:číslo
 * @returns {number} Procenta s přesností na 2 desetinná místa
 */
function pomer2Uspesnost(s)
{
    if(s==undefined || s==null || s.length == 0) return NaN;

    var pomer = s.split(":");
    pomer[0] = parseInt(pomer[0]);
    pomer[1] = parseInt(pomer[1]);
    return (pomer[0]+pomer[1])!=0?Math.round(pomer[0]/(pomer[0]+pomer[1])*10000)/100:NaN;
}

/**
 * Vytvoření hlavičkové buňky tabulky s levým a pravým paddingem.
 * @param {string} nazev Test v buňce
 * @param {number} mezera Mezera v pixelech
 * @returns {Element} Hlavičková buňka
 */
function CreateHeader(nazev, mezera) {
    var th = document.createElement("th");
    th.style.borderBottom = "2px solid grey";
    th.style.paddingLeft = mezera + "px";
    th.style.paddingRight = mezera + "px";
    th.style.textAlign = "center";
    var strong = document.createElement("strong");
    strong.innerHTML = nazev;
    th.insertBefore(strong, null);
    return th;
}

/**
 * Vytvoření hlavičkové buňky tabulky.
 * @param {string} nazev Test v buňce
 * @returns {Element} Hlavičková buňka
 */
function CreateHeader(nazev) {
    var th = document.createElement("th");
    th.style.borderBottom = "2px solid grey";
    th.style.textAlign = "center";
    var strong = document.createElement("strong");
    strong.innerHTML = nazev;
    th.insertBefore(strong, null);
    return th;
}

/**
 * Vytvoření jednoho řádku soupisky.
 * @param {number} pozice Pořadí na soupisce
 * @param {string} jmeno Jméno hráče
 * @param {Element} pomerDvouhra Element s poměrem dvouher
 * @param {Element} pomerCtyrhra Element s poměrem čtyřher
 * @returns {Element} Řádek soupisky
 */
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

    //nastavení pořadí na soupisce
    position.innerHTML = pozice + ".";
    position.style.textAlign="right";

    //nastavení jména hráče
    name.style.fontWeight = "bold";
    name.style.width = "150px";
    name.setAttribute("colspan","2");
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

/**
 * Vytvoření jednoho řádku soupisky.
 * @param {number} pozice Pořadí na soupisce
 * @param {string} jmeno Jméno hráče
 * @param {Element} pomerDvouhra Element s poměrem dvouher
 * @param {Element} pomerCtyrhra Element s poměrem čtyřher
 * @returns {Element[]} Řádek soupisky
 */
function GenerateRowOfSoupiskaWithQualification(pozice, jmeno, pomerDvouhra, pomerCtyrhra, popisKvalifikace, pomerDvouhraKval, pomerCtyrhraKval) {

    //vytvoření elementů
    var tr = document.createElement("tr");
    var trKval = document.createElement("tr");
    var position = document.createElement("td");
    var name = document.createElement("td");
    var popis = document.createElement("td");
    var dvouhry = document.createElement("td");
    var ctyrhry = document.createElement("td");
    var mezera = document.createElement("td");
    var dvouhryp = document.createElement("td");
    var ctyrhryp = document.createElement("td");
    var popisKval = document.createElement("td");
    var dvouhryKval = document.createElement("td");
    var ctyrhryKval = document.createElement("td");
    var dvouhrypKval = document.createElement("td");
    var ctyrhrypKval = document.createElement("td");

    //nastavení pořadí na soupisce
    position.innerHTML = pozice + ".";
    position.style.textAlign = "right";
    position.setAttribute("rowspan", "2");

    //nastavení jména hráče
    name.style.fontWeight = "bold";
    name.style.width = "200px";
    name.appendChild(jmeno);
    name.setAttribute("rowspan", "2");

    //poměr dvouher
    var strong = document.createElement("strong");
    strong.insertBefore(pomerDvouhra, null);
    dvouhry.insertBefore(strong, null);
    dvouhry.style.textAlign = "center";

    //procenta a graf dvouher
    dvouhryp.innerHTML = "<div width='100%' align='center'>" + pomer2Uspesnost(pomerDvouhra.innerHTML).toFixed(2) + "%</div>";
    dvouhryp.insertBefore(CreateGraph(pomer2Uspesnost(pomerDvouhra.innerHTML)), null);
    dvouhryp.setAttribute("align", "right");

    //mezera
    mezera.style.width = "30px";
    mezera.setAttribute("rowspan", "2");

    //poměr čtyřher
    var strong = document.createElement("strong");
    strong.insertBefore(pomerCtyrhra, null);
    ctyrhry.insertBefore(strong, null);
    ctyrhry.style.textAlign = "center";

    //procenta a graf čtyřher
    ctyrhryp.innerHTML = "<div width='100%' align='center'>" + pomer2Uspesnost(pomerCtyrhra.innerHTML).toFixed(2) + "%</div>";
    ctyrhryp.insertBefore(CreateGraph(pomer2Uspesnost(pomerCtyrhra.innerHTML)), null);
    ctyrhryp.setAttribute("align", "right");


    //nastavení titulku kvalifikace
    //nameKval.style.fontWeight = "bold";
    popisKval.style.width = "50px";
    popisKval.classList.add("male");
    console.log(popisKval)
    popisKval.innerHTML = popisKvalifikace;

    //poměr dvouher
    var strong = document.createElement("strong");
    strong.insertBefore(pomerDvouhraKval, null);
    dvouhryKval.insertBefore(strong, null);
    dvouhryKval.style.textAlign = "center";

    //procenta a graf dvouher
    dvouhrypKval.innerHTML = "<div width='100%' align='center'>" + pomer2Uspesnost(pomerDvouhraKval.innerHTML).toFixed(2) + "%</div>";
    dvouhrypKval.insertBefore(CreateGraph(pomer2Uspesnost(pomerDvouhraKval.innerHTML)), null);
    dvouhrypKval.setAttribute("align", "right");

    //poměr čtyřher
    var strong = document.createElement("strong");
    strong.insertBefore(pomerCtyrhraKval, null);
    ctyrhryKval.insertBefore(strong, null);
    ctyrhryKval.style.textAlign = "center";

    //procenta a graf čtyřher
    ctyrhrypKval.innerHTML = "<div width='100%' align='center'>" + pomer2Uspesnost(pomerCtyrhraKval.innerHTML).toFixed(2) + "%</div>";
    ctyrhrypKval.insertBefore(CreateGraph(pomer2Uspesnost(pomerCtyrhraKval.innerHTML)), null);
    ctyrhrypKval.setAttribute("align", "right");


    //vložení elementů do řádku
    tr.insertBefore(position, null);
    tr.insertBefore(name, null);
    tr.insertBefore(popis, null);
    tr.insertBefore(dvouhry, null);
    tr.insertBefore(dvouhryp, null);
    tr.insertBefore(mezera, null);
    tr.insertBefore(ctyrhry, null);
    tr.insertBefore(ctyrhryp, null);


    //trKval.insertBefore(nameKval, null);
    trKval.insertBefore(popisKval, null);
    trKval.insertBefore(dvouhryKval, null);
    trKval.insertBefore(dvouhrypKval, null);
    trKval.insertBefore(ctyrhryKval, null);
    trKval.insertBefore(ctyrhrypKval, null);

    return [tr,trKval];
}

/**
 * Vytvoření řádku u hráče s popisem hráče
 * @param {Element} rok
 * @param {Element} oddil
 * @param {Element} pomerDvouhra
 * @param {Element} pomerCtyrhra
 * @returns {Element} Popis hráče
 */
function GenerateRowOfHracPopis(rok, oddil, pomerDvouhra, pomerCtyrhra)
{
    //vytvoření elementů
    var tr = document.createElement("tr");
    var year = document.createElement("td");
    var team = document.createElement("td");
    var dvouhry = document.createElement("td");
    var ctyrhry = document.createElement("td");
    var mezera = document.createElement("td");
    var dvouhryp = document.createElement("td");
    var ctyrhryp = document.createElement("td");

    //nastavení rok
    year.insertBefore(rok,null);

    //nastavení oddílu
    team.appendChild(oddil);

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

    //vložení elementů do řádku
    tr.insertBefore(year,null);
    tr.insertBefore(oddil,null);
    tr.insertBefore(dvouhry,null);
    tr.insertBefore(dvouhryp,null);
    tr.insertBefore(mezera,null);
    tr.insertBefore(ctyrhry,null);
    tr.insertBefore(ctyrhryp,null);

    return tr;
}


/**
 * Vytvoření řádku u hráče s popisem hráče
 * @param {Element} druzstvo
 * @param {Element} kategorie
 * @param {Element} soutez
 * @param {Element} pomerDvouhra
 * @param {Element} pomerCtyrhra
 * @returns {Element} Popis hráče
 */
function GenerateRowOfHracSoutez(druzstvo, kategorie, soutez, pomerDvouhra, pomerCtyrhra)
{
        //vytvoření elementů
        var tr = document.createElement("tr");
        var team = document.createElement("td");
        var cat = document.createElement("td");
        var compet = document.createElement("td");
        var dvouhry = document.createElement("td");
        var ctyrhry = document.createElement("td");
        var mezera = document.createElement("td");
        var dvouhryp = document.createElement("td");
        var ctyrhryp = document.createElement("td");

        //nastavení družstvo
        team.insertBefore(druzstvo, null);

        //nastavení kategorie
        cat.appendChild(kategorie);
        cat.style.textAlign = "center";

        //nastavení soutez
        compet.appendChild(soutez);
        compet.style.textAlign = "center";

        //poměr dvouher
        var strong = document.createElement("strong");
        strong.insertBefore(pomerDvouhra, null);
        dvouhry.insertBefore(strong, null);
        dvouhry.style.textAlign = "center";

        //procenta a graf dvouher
        dvouhryp.innerHTML = "<div width='100%' align='center'>" + pomer2Uspesnost(pomerDvouhra.innerHTML).toFixed(2) + "%</div>";
        dvouhryp.insertBefore(CreateGraph(pomer2Uspesnost(pomerDvouhra.innerHTML)), null);
        dvouhryp.setAttribute("align", "right");

        //mezera
        mezera.style.width = "30px";

        //poměr čtyřher
        var strong = document.createElement("strong");
        strong.insertBefore(pomerCtyrhra, null);
        ctyrhry.insertBefore(strong, null);
        ctyrhry.style.textAlign = "center";

        //procenta a graf čtyřher
        ctyrhryp.innerHTML = "<div width='100%' align='center'>" + pomer2Uspesnost(pomerCtyrhra.innerHTML).toFixed(2) + "%</div>";
        ctyrhryp.insertBefore(CreateGraph(pomer2Uspesnost(pomerCtyrhra.innerHTML)), null);
        ctyrhryp.setAttribute("align", "right");

        //vložení elementů do řádku
        tr.insertBefore(team, null);
        tr.insertBefore(cat, null);
        tr.insertBefore(compet, null);
        tr.insertBefore(dvouhry, null);
        tr.insertBefore(dvouhryp, null);
        tr.insertBefore(mezera, null);
        tr.insertBefore(ctyrhry, null);
        tr.insertBefore(ctyrhryp, null);

        return tr;
}


/**
 * Vytvoření řádku u hráče s popisem hráče
 * @param {Element} druzstvo
 * @param {Element} kategorie
 * @param {Element} soutez
 * @param {Element} pomerDvouhra
 * @param {Element} pomerCtyrhra
 * @returns {Element[]} Popis hráče
 */
function GenerateRowOfHracSoutezWithQualification(druzstvo, kategorie, soutez, pomerDvouhra, pomerCtyrhra, soutezKval, pomerDvouhraKval, pomerCtyrhraKval)
{
    //vytvoření elementů
    var tr = document.createElement("tr");
    var trKval = document.createElement("tr");
    var team = document.createElement("td");
    var cat = document.createElement("td");
    var compet = document.createElement("td");
    var dvouhry = document.createElement("td");
    var ctyrhry = document.createElement("td");
    var mezera = document.createElement("td");
    var dvouhryp = document.createElement("td");
    var ctyrhryp = document.createElement("td");
    var competKval = document.createElement("td");
    var dvouhryKval = document.createElement("td");
    var ctyrhryKval = document.createElement("td");
    var dvouhrypKval = document.createElement("td");
    var ctyrhrypKval = document.createElement("td");

    //nastavení družstvo
    team.insertBefore(druzstvo, null);
    team.setAttribute("rowspan", "2");

    //nastavení kategorie
    cat.appendChild(kategorie);
    cat.setAttribute("rowspan", "2");
    cat.style.textAlign = "center";

    //nastavení soutez
    compet.appendChild(soutez);
    compet.style.textAlign = "center";

    //poměr dvouher
    var strong = document.createElement("strong");
    strong.insertBefore(pomerDvouhra, null);
    dvouhry.insertBefore(strong, null);
    dvouhry.style.textAlign = "center";

    //procenta a graf dvouher
    dvouhryp.innerHTML = "<div width='100%' align='center'>" + pomer2Uspesnost(pomerDvouhra.innerHTML).toFixed(2) + "%</div>";
    dvouhryp.insertBefore(CreateGraph(pomer2Uspesnost(pomerDvouhra.innerHTML)), null);
    dvouhryp.setAttribute("align", "right");

    //mezera
    mezera.style.width = "30px";
    mezera.setAttribute("rowspan", "2");

    //poměr čtyřher
    var strong = document.createElement("strong");
    strong.insertBefore(pomerCtyrhra, null);
    ctyrhry.insertBefore(strong, null);
    ctyrhry.style.textAlign = "center";

    //procenta a graf čtyřher
    ctyrhryp.innerHTML = "<div width='100%' align='center'>" + pomer2Uspesnost(pomerCtyrhra.innerHTML).toFixed(2) + "%</div>";
    ctyrhryp.insertBefore(CreateGraph(pomer2Uspesnost(pomerCtyrhra.innerHTML)), null);
    ctyrhryp.setAttribute("align", "right");

    //nastavení soutez
    competKval.appendChild(soutezKval);
    competKval.style.textAlign = "center";

    //poměr dvouher
    var strong = document.createElement("strong");
    strong.insertBefore(pomerDvouhraKval, null);
    dvouhryKval.insertBefore(strong, null);
    dvouhryKval.style.textAlign = "center";

    //procenta a graf dvouher
    dvouhrypKval.innerHTML = "<div width='100%' align='center'>" + pomer2Uspesnost(pomerDvouhraKval.innerHTML).toFixed(2) + "%</div>";
    dvouhrypKval.insertBefore(CreateGraph(pomer2Uspesnost(pomerDvouhraKval.innerHTML)), null);
    dvouhrypKval.setAttribute("align", "right");

    //poměr čtyřher
    var strong = document.createElement("strong");
    strong.insertBefore(pomerCtyrhraKval, null);
    ctyrhryKval.insertBefore(strong, null);
    ctyrhryKval.style.textAlign = "center";

    //procenta a graf čtyřher
    ctyrhrypKval.innerHTML = "<div width='100%' align='center'>" + pomer2Uspesnost(pomerCtyrhraKval.innerHTML).toFixed(2) + "%</div>";
    ctyrhrypKval.insertBefore(CreateGraph(pomer2Uspesnost(pomerCtyrhraKval.innerHTML)), null);
    ctyrhrypKval.setAttribute("align", "right");

    //vložení elementů do řádku
    tr.insertBefore(team, null);
    tr.insertBefore(cat, null);
    tr.insertBefore(compet, null);
    tr.insertBefore(dvouhry, null);
    tr.insertBefore(dvouhryp, null);
    tr.insertBefore(mezera, null);
    tr.insertBefore(ctyrhry, null);
    tr.insertBefore(ctyrhryp, null);


    trKval.insertBefore(competKval, null);
    trKval.insertBefore(dvouhryKval, null);
    trKval.insertBefore(dvouhrypKval, null);
    trKval.insertBefore(ctyrhryKval, null);
    trKval.insertBefore(ctyrhrypKval, null);

    return [tr,trKval];
}

/**
 * Vytvoření řádku u hráče s popisem hráče
 * @param {string} typ
 * @param {Element} pomer
 * @returns {Element} Řádek bilance dbouhry/ čtyřhry
 */
function GenerateRowOfHracBilance(typ, pomer)
{
    //vytvoření elementů
    var tr = document.createElement("tr");
    var type = document.createElement("td");
    var tdPomer = document.createElement("td");
    var tdProcenta = document.createElement("td");

    //nastavení typu
    type.innerHTML = typ;

    //poměr dvouher
    var strong = document.createElement("strong");
    strong.insertBefore(pomer, null);
    tdPomer.insertBefore(strong, null);
    tdPomer.style.textAlign = "center";

    //procenta a graf dvouher
    tdProcenta.innerHTML = "<div width='100%' align='center'>" + pomer2Uspesnost(pomer.innerHTML).toFixed(2) + "%</div>";
    tdProcenta.insertBefore(CreateGraph(pomer2Uspesnost(pomer.innerHTML)), null);
    tdProcenta.setAttribute("align", "right");


    //vložení elementů do řádku
    tr.insertBefore(type, null);
    tr.insertBefore(tdPomer, null);
    tr.insertBefore(tdProcenta, null);

    return tr;
}


//######################################################################################################################
//######################################################################################################################
//####                                                                                                              ####
//####                                                   LIGHTBOX                                                   ####
//####                                                                                                              ####
//######################################################################################################################
//######################################################################################################################

/**
 * Nastavení původní hodnoty overflow v tagu HTML
 * @type {string}
 */
var overflowOriginal = "";

/**
 * Vytvoření okna lightboxu a jeho zobrazení
 * @param {Element} content Obsah lightboxu
 */
function LightBox(content) {
    var body = document.body;
    if(document.documentElement.hasAttribute("overflow"))
    {
        overflowOriginal = document.documentElement.getAttribute("overflow");
    }
    document.documentElement.setAttribute("overflow", "hidden");

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

/**
 * Vycentrování hlavního okna lightboxu
 */
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

/**
 * Pozadí lightboxu - tmavé + průhledné
 * @returns {Element} Pozadí lightboxu
 */
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

/**
 * Vytvoření hlavního okna lightboxu bez obsahu
 * @returns {Element} Hlavní okno lightboxu
 */
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

/**
 * Skrytí lightboxu
 */
function HideLightWindow() {
    document.body.removeChild(document.getElementById('StisGraphLightWindowOverlap'));
    if(overflowOriginal != "")
    {
        document.documentElement.setAttribute("overflow", overflowOriginal);
    }
    else
    {
        document.documentElement.removeAttribute("overflow");
    }
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

/**
 * Zastavení propagace eventu
 * @param ev Událost
 */
function StopEventPropagation(ev) {
    ev.stopPropagation();
    //console.log("StopEventPropagation: OK");
}

/**
 * Vytvoření obsahu lightboxu a jeho zobrazení
 */
function ShowUpdateDetail(){
    var iframe = document.createElement("iframe");
    iframe.setAttribute("src", serverScriptPath);
    iframe.style.width = "100%";
    iframe.style.minHeight = "200px";
    iframe.setAttribute("id", "StisGraphIframe");

    LightBox(iframe);
}

/**
 * Kontrola dostupnosti aktualizace
 */
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

/**
 * Porovnání verzí
 * @param {string} v1 První verze
 * @param {string} v2 Druhá verze
 * @returns {number} Výsledek porovnání -1 v1<v2, 0 v1=v2, 1 v1>v2
 */
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

/**
 * Zobrazení upozornění na nový update
 */
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
    //table[table.length-1].setAttribute("width","700");
    table[table.length-1].style.width = "700px";
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
    var th = CreateHeader("Jméno hráče");
    th.setAttribute("colspan","2");
    thead.insertBefore(th,null);
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
        var uspesnostDvouhryKval = 0;
        var uspesnostCtyrhryKval = 0;
        var kval = false;
        var popisKval = "";

        var pomerDvouhry = document.createElement("span");
        pomerDvouhry.innerHTML = "0:0";
        var pomerCtyrhry = document.createElement("span");
        pomerCtyrhry.innerHTML = "0:0";
        var pomerDvouhryKval = document.createElement("span");
        pomerDvouhryKval.innerHTML = "0:0";
        var pomerCtyrhryKval = document.createElement("span");
        pomerCtyrhryKval.innerHTML = "0:0";
        var jmeno = document.createElement("span");
        jmeno.innerHTML = "Jmeno";

        //var s = brs[i].nextElementSibling;
        var s = brs[i].nextSibling;
        //while(s.tagName.toLowerCase()!="br")
        while(s.nodeName.toLowerCase()!="br")
        {
            if(s.nodeName.toLowerCase() == "#text" && s.textContent.indexOf("Kvalifikace") != -1)
            {
                kval = true;
                popisKval = "Kvalifikace";
            }
            else if(s.nodeName.toLowerCase() == "#text" && s.textContent.indexOf("Play Off/Out") != -1)
            {
                kval = true;
                popisKval = "Play Off/Out";
            }
            else if(s.nodeName.toLowerCase() == "font")
            {
                var span = document.createElement("span");
                span.insertBefore(jmeno.cloneNode(true),null);
                jmeno = span;
                jmeno.innerHTML += " - ";
                jmeno.insertBefore(s.cloneNode(true),null);
                s = s.nextElementSibling;
                jmeno.insertBefore(s.cloneNode(true),null);
            }
            else if(s.nodeName.toLowerCase() == "a" && s.getAttribute("href").startsWith("hrac"))
            {
                jmeno = s.cloneNode(true);
            }
            else if(s.nodeName.toLowerCase() == "a" && s.getAttribute("href").startsWith("dvouhry"))
            {
                //uspesnostDvouhry = pomer2Uspesnost(s.innerHTML);

                //s.innerHTML += " - <strong>" + uspesnostDvouhry + "%</strong>";
                if(!kval) pomerDvouhry = s.cloneNode(true);
                else pomerDvouhryKval = s.cloneNode(true);
            }
            else if(s.nodeName.toLowerCase() == "a" && s.getAttribute("href").startsWith("ctyrhry"))
            {
                //uspesnostCtyrhry = pomer2Uspesnost(s.innerHTML);

                //s.innerHTML += " - <strong>" + uspesnostCtyrhry + "%</strong>";

                if(!kval) pomerCtyrhry = s.cloneNode(true);
                else pomerCtyrhryKval = s.cloneNode(true);
            }

            //s = s.nextElementSibling;
            s = s.nextSibling;
        }


        //var graph2 = CreateGraph(uspesnostDvouhry);
        //var graph4 = CreateGraph(uspesnostCtyrhry);

        //brs[i].parentElement.insertBefore(graph2,brs[i+1]);
        //brs[i].parentElement.insertBefore(graph4,brs[i+1]);

        if(!kval)
        {
            var tr = GenerateRowOfSoupiska(position, jmeno, pomerDvouhry, pomerCtyrhry);
            if(i%2 == 1)tr.style.backgroundColor = "#EEEEEE";
            table.insertBefore(tr,null);
        }
        else
        {
            var trs = GenerateRowOfSoupiskaWithQualification(position, jmeno, pomerDvouhry, pomerCtyrhry, popisKval, pomerDvouhryKval, pomerCtyrhryKval);
            if(i%2 == 1)
            {
                trs[0].style.backgroundColor = "#EEEEEE";
                trs[1].style.backgroundColor = "#EEEEEE";
            }
            table.insertBefore(trs[0],null);
            table.insertBefore(trs[1],null);
        }


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
//Hráč
else if(path.startsWith("/htm/hrac.php"))
{

    var contentDiv = document.getElementById("content");
    //console.log(contentDiv);
    var table = contentDiv.getElementsByTagName("div")[0].getElementsByTagName("table")[0].getElementsByTagName("tbody")[0];
    //console.log(table);
    var list = table.getElementsByTagName("tr")[1].getElementsByTagName("td")[0];
    //console.log(list);
    var nodes = list.childNodes;
    //console.log(nodes);

    var dvouhryOriginal = nodes[8];
    var ctyrhryOriginal = nodes[11];

    var dvouhry = nodes[8].cloneNode(true);
    //console.log(dvouhry);
    var ctyrhry = nodes[11].cloneNode(true);
    //console.log(ctyrhry);

    tableBilance = document.createElement("table");
    tableBilance.style.width = "100%";
    tableBilance.style.borderCollapse = "collapse";

    thead = document.createElement("thead");
    tr = document.createElement("tr");
    th = CreateHeader("Celková bilance");
    th.setAttribute("colspan", "3");
    tr.insertBefore(th, null);

    thead.insertBefore(tr,null);
    tableBilance.insertBefore(thead, null);

    var tbody = document.createElement("tbody");
    tbody.insertBefore(GenerateRowOfHracBilance("Dvouhry", dvouhry),null);
    var trCtyrhry = GenerateRowOfHracBilance("Čtyřhry", ctyrhry);
    trCtyrhry.style.backgroundColor = "#eee";
    tbody.insertBefore(trCtyrhry, null);
    tableBilance.insertBefore(tbody, null);


        for (i = nodes.length-1; i >= 7; i--) {
            list.removeChild(nodes[i]);
        }
    list.insertBefore(tableBilance, null);



    list = table.getElementsByTagName("tr")[1].childNodes[1];
    //console.log(list);
    var brs = list.getElementsByTagName("br");
    //console.log(nodes);


    tableDruzstva = document.createElement("table");
    tableDruzstva.style.width = "100%";
    tableDruzstva.style.borderCollapse = "collapse";

    thead = document.createElement("thead");
    tr = document.createElement("tr");
    th = CreateHeader("Družstvo");
    th.style.width = "180px";
    tr.insertBefore(th, null);
    tr.insertBefore(CreateHeader("Kategorie"), null);
    tr.insertBefore(CreateHeader("Soutěž"), null);
    th = CreateHeader("Dvouhry");
    th.setAttribute("colspan", "2");
    tr.insertBefore(th, null);
    tr.insertBefore(CreateHeader(""), null);
    th = CreateHeader("Čtyřhry");
    th.setAttribute("colspan", "2");
    tr.insertBefore(th, null);

    thead.insertBefore(tr,null);
    tableDruzstva.insertBefore(thead, null);

    //console.log(brs.length);
    for (var i = 0; i < brs.length-1; i++) {
        //console.log("V cyklu");


        var uspesnostDvouhry = 0;
        var uspesnostCtyrhry = 0;
        var uspesnostDvouhryKval = 0;
        var uspesnostCtyrhryKval = 0;
        kval = false;

        var pomerDvouhry = document.createElement("span");
        pomerDvouhry.innerHTML = "0:0";
        var pomerCtyrhry = document.createElement("span");
        pomerCtyrhry.innerHTML = "0:0";
        var pomerDvouhryKval = document.createElement("span");
        pomerDvouhry.innerHTML = "0:0";
        var pomerCtyrhryKval = document.createElement("span");
        pomerCtyrhry.innerHTML = "0:0";
        var druzstvo = document.createElement("span");
        druzstvo.innerHTML = "Družstvo";
        var soutez = document.createElement("span");
        soutez.innerHTML = "Soutěž";
        var soutezKval = document.createElement("span");
        soutezKval.innerHTML = "Soutěž";
        var kategorie = document.createElement("span");
        kategorie.innerHTML = "Kategorie";

        var s = brs[i].nextSibling;
        //console.log(s);
        while(s.nodeName.toLowerCase()!="br")
        {
            //console.log(s);
            if(s.nodeName.toLowerCase()=="#text")
            {
                if(s.textContent.indexOf("MUZ")>0) {
                    kategorie = s.cloneNode(true);
                    kategorie.textContent = "MUŽI";
                }
                else if(s.textContent.indexOf("ZEN")>0) {
                    kategorie = s.cloneNode(true);
                    kategorie.textContent = "ŽENY";
                }
                else if(s.textContent.indexOf("soupisce")>0) {
                        var span = document.createElement("span");
                        span.insertBefore(druzstvo, null);
                        var font = document.createElement("font");
                        font.classList.add("male");
                        var text = s.cloneNode(true);
                        text.textContent = text.textContent.substr(text.textContent.lastIndexOf("-")).trim();
                        font.insertBefore(text ,null);
                        span.insertBefore(font,null);
                        druzstvo = span;
                }
                else if(s.textContent.indexOf("Play Off/Out")!=-1){
                    soutezKval.innerHTML = "Play Off/Out";
                }
            }
            else if(s.getAttribute("href").startsWith("druzstvo"))
            {
                druzstvo = s.cloneNode(true);
            }
            else if(s.getAttribute("href").startsWith("soutez"))
            {
                if(soutez.innerHTML == "Soutěž") soutez = s.cloneNode(true);
                else soutezKval = s.cloneNode(true);
            }
            else if(s.getAttribute("href").startsWith("dvouhry"))
            {
                if(pomerDvouhry.innerHTML == "0:0") pomerDvouhry = s.cloneNode(true);
                else pomerDvouhryKval = s.cloneNode(true);
            }
            else if(s.getAttribute("href").startsWith("ctyrhry"))
            {
                if(pomerCtyrhry.innerHTML == "0:0")pomerCtyrhry = s.cloneNode(true);
                else pomerCtyrhryKval = s.cloneNode(true);
            }

            s = s.nextSibling;
        }
        //console.log("Za for cyklem");

        if(soutezKval.innerHTML == "Soutěž") {
            var tr = GenerateRowOfHracSoutez(druzstvo, kategorie, soutez, pomerDvouhry, pomerCtyrhry);
            if (i % 2 == 1)tr.style.backgroundColor = "#EEEEEE";
            tableDruzstva.insertBefore(tr, null);
        }
        else{
            var trs = GenerateRowOfHracSoutezWithQualification(druzstvo, kategorie, soutez, pomerDvouhry, pomerCtyrhry, soutezKval, pomerDvouhryKval, pomerCtyrhryKval);
            if (i % 2 == 1)trs[0].style.backgroundColor = "#EEEEEE";
            if (i % 2 == 1)trs[1].style.backgroundColor = "#EEEEEE";
            tableDruzstva.insertBefore(trs[0], null);
            tableDruzstva.insertBefore(trs[1], null);
        }


        //console.log(newDiv);
    }

    list.innerHTML = "";
    list.style.width = "70%";

    list.insertBefore(tableDruzstva, brs[brs.length-1]);

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


//TestNewUpdate();
