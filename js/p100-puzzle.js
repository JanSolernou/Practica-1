
var numFiles = 2;
var numColumnes = 2;
var nomImatge = "img-5";
var extImatge = ".jpg";

// comença el programa
$(document).ready(function () {

    //Esdeveniments de l'usuari
    //Menú inicial
    /**TASCA *****************************
    * Addicional.- codi del menú que permet escollir imatges i/o el número de peces**/

    $("img").on("click", function () {
        nomImatge = $(this).attr("id");
    });

    $("#files").on("input", function () {
        numFiles = $(this).val();
    });
    $("#columnes").on("input", function () {
        numColumnes = $(this).val();
    });


    /*****************************************************************/



    //Comença el joc
    $("#jugar").on("click", function () {
        $(".audio").attr("src","./audio/"+nomImatge+".mp3")
        $(".audio")[0].play();
        creaPuzzle();
        $("#form-joc").show();
        $("#form-menu").hide();
        $(".peca")
            .mousedown(function () {
                zIndexPeca = $(this).css("z-index");
                $(this).css("z-index", 100);
            })
            .mouseup(function () {
                /**
                * PosicionaPeca calcula la posició correcte i 
                * revisa si la distànca entre la posició actual
                * i la posició correcte és inferior a una 
                * distància determinada
                */


                posicionaPeca($(this));
                /**
                * puzzleResolt revisa si totes les peces
                * estan a la seva posició correcte i 
                * En cas afirmatiu, mostra la felicitació
                */
                if (puzzleResolt()) {
                    /**TASCA *****************************
                    * 6.- Codi que mostra la felicitació si puzzleResolt = true
                    * És valora alguna animació o efecte
                    */
                    $(".audio").attr("src","./audio/win.mp3");
                    $(".audio")[0].play();

                    $("#felicitacio").show();

                    $("#felicitacio").css({
                        position: "fixed",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        padding: "30px",
                        background: "#fff",
                        border: "5px solid gold",
                        "font-size": "2em",
                        "z-index": 9999,
                        display: "none",
                        "border-radius": "15px"
                    });
                
                    $("#felicitacio")
                        .fadeIn(1000)
                        .delay(1000)
                        .animate({ fontSize: "3em", padding: "40px" }, 500)
                        .fadeOut(2000, function () {
                            $(this).remove();
                        });
                }
            });

    });
    $("#resolPuzzle").on("click", function () {
        /**
        * Si l'usuari fa clic, totes les peces
        * es posicionen a la seva posició correta
        * resolent el puzle
        */
        resolPuzzle();
    });

});

/**
* Calcula les mides de les peces en funció de la mida de la imatge
* i del nombre de files i columnes
* Estableix les mides dels contenidors
*/
function creaPuzzle() {

    ampladaPeca = Math.floor($("#p-" + nomImatge).width() / numColumnes);
    alcadaPeca = Math.floor($("#p-" + nomImatge).height() / numFiles);

    $("#peces-puzzle").html(crearPeces());
    $(".peca").css({
        "width": ampladaPeca + "px",
        "height": alcadaPeca + "px",
    });

    setImatgePosicioPeces();

    $("#marc-puzzle").css("width", (ampladaPeca * numColumnes) + "px");
    $("#marc-puzzle").css("height", (alcadaPeca * numFiles) + "px");
    $("#solucio").css("width", "100%");
    $("#solucio").css("height", "100%");
    $("#solucio").css("background-image", "url(imatges/" + nomImatge + extImatge + ")");

    $(".peca").draggable();


}

/**
* Crea codi HTML per representar les peces
* amb un sistema d'identificació f0c0, f0c1,...fxcy
*
* @return text (divs html per cada peça)
*/
function crearPeces() {
    var htmlPeces = "";
    for (let fila = 0; fila < numFiles; fila++) {
        for (let columna = 0; columna < numColumnes; columna++) {
            htmlPeces += "<div id='f" + fila + "c" + columna + "' class='peca'></div>";
        }
        htmlPeces += "\n";
    }
    return htmlPeces;
}

/**
* Estableix els backgroud de la peça, ajustada a la imatge i 
* a la posició correcte de la peça
* Estableix una posició aleatoria (left, top) per a cada peça. Barreja.
*
*/
function setImatgePosicioPeces() {
    $(".peca").css("background-image", "url(imatges/" + nomImatge + extImatge + ")");
    for (let fila = 0; fila < numFiles; fila++) {
        for (let columna = 0; columna < numColumnes; columna++) {
            $("#f" + fila + "c" + columna).css("background-position", (-(columna) * ampladaPeca) + "px " + (-(fila) * alcadaPeca) + "px");
            $("#f" + fila + "c" + columna).css("left", Math.floor(Math.random() * ((numColumnes - 1) * ampladaPeca)) + "px ");
            $("#f" + fila + "c" + columna).css("top", Math.floor(Math.random() * ((numFiles - 1) * alcadaPeca)) + "px ");

        }
    }

}


/**
* PosicionaPeca calcula la posició correcte i 
* revisa si la distància entre la posició actual
* i la posició correcte és inferior a una 
* distància determinada, utilitzant la funció distanciaDosPunts.
* Si aquesta avaluació és positiva, mou la peça a la posició correcte
*
* @para peca (peça que l'usuari ha alliberat amb el ratolí)
*  
*/

function posicionaPeca(peca) {
    let posicioPeca = peca.position();
    let posicioPecaCorrecte = {};
    /**TASCA *****************************
    * 1.- Identifica la peça pel seu id (fxcy) i en calcula la
    * seva posició correcte  (posicioPecaCorrecte) 
    */

    ampladaPeca = Math.floor($("#p-" + nomImatge).width() / numColumnes);
    alcadaPeca = Math.floor($("#p-" + nomImatge).height() / numFiles);
    posicioPecaCorrecte = { top: $(peca).attr("id").charAt(1) * alcadaPeca, left: $(peca).attr("id").charAt(3) * ampladaPeca };

    if (distanciaDosPunts(posicioPeca, posicioPecaCorrecte) < 40) {
        /**TASCA *****************************
        * 2.- Si la distancia és dins del marge determinat
        * mou la peça a la seva posició correcta
        *
        *  La peça ja no és podrà tornar a moure
        *  
        */
       
        $(".click")[0].play();
        peca.css({ top: posicioPecaCorrecte.top, left: posicioPecaCorrecte.left, position: 'absolute', zIndex: -1 });
        peca.draggable("disable");
    }

}

/**
* Posa totes les peces al seu lloc correcte
*
* @para 
* @return 
*/
function resolPuzzle() {
    /**TASCA *****************************
    * 4.- Posiciona totes les peces a la 
    * seva posició correcte, resolent el puzle
    *  
    */
    for (let i = 0; i < $(".peca").length; i++){
        let peca = $(".peca").eq(i);
        ampladaPeca = Math.floor($("#p-"+nomImatge).width()/numColumnes);
        alcadaPeca = Math.floor($("#p-"+nomImatge).height()/numFiles);
        posicioPecaCorrecte = {top: $(peca).attr("id").charAt(1)*alcadaPeca ,left: $(peca).attr("id").charAt(3)*ampladaPeca};
        
        peca.css({ top: posicioPecaCorrecte.top, left: posicioPecaCorrecte.left, position: 'absolute', zIndex: -1 });
        
    }

}
/**
* Revisa si totes les peces son al seu lloc
*
* @return bool (true si totes les peces son al seu lloc)
*/
function puzzleResolt(){
    /**TASCA *****************************
    * 5.- Revisa totes les peces i les seves posicions actuals i compara
    * aquestes poscions amb les posicions correctes que haurien de tenir
    * En cas que totes les peces siguin a la seva posició 
    * correcte, retorna cert
    *  
    */

    let puzzleNumCorr = 0;
   

   for (let i = 0; i < $(".peca").length; i++){
        let peca = $(".peca").eq(i);
        ampladaPeca = Math.floor($("#p-"+nomImatge).width()/numColumnes);
        alcadaPeca = Math.floor($("#p-"+nomImatge).height()/numFiles);
        posicioPecaCorrecte = {top: $(peca).attr("id").charAt(1)*alcadaPeca ,left: $(peca).attr("id").charAt(3)*ampladaPeca};
        
        if(distanciaDosPunts($(".peca").eq(i).position(), posicioPecaCorrecte) < 40){
            puzzleNumCorr++;
        }else{
            return false;
        }
        if(puzzleNumCorr == $(".peca").length){
            return true;
        }
    }
	
}






/**
* Calcula la distància entre dos punts
*
* @para puntA, puntB 
* coordenada superior esquerra de la peca (pA) i de la seva posició correcte (pB)
* @return Distancia entre els dos punts en un pla cartesià
*/
function distanciaDosPunts(puntA, puntB) {
    /**TASCA *****************************
     * 3.- Reviseu la fórmula de càlcul de distància entre dos punts
     * a la lliçó 5: Col·lisions  dels apunts
     *  
     */


    let dx = puntB.top - puntA.top;
    let dy = puntB.left - puntA.left;
    return Math.sqrt(dx * dx + dy * dy)
}


$("#nouPuzzle").on("click", function () {
    $(".audio")[0].pause();
    $("#form-joc").hide();
    $("#form-menu").show();
})

$("#volumen").change(function (e) { 
   
$('.audio')[0].volume=this.value;
    
});