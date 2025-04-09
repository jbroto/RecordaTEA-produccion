$(document).ready(function () {


    /*
    $("#contenedorRutina").hide();

    $(".card").on('click', function (e) {
        e.preventDefault();
        $('#conjuntoRutinas').fadeOut(function () {
            $('#contenedorRutina').fadeIn();
        });
    })

    $(".card").on('click', function (e) {
        e.preventDefault();
        $('#conjuntoRutinas').fadeOut(function () {
            $('#contenedorRutina').fadeIn();
        });
    })*/

    $("#containerInicioRutina").hide();


    $("#botonVolverRutinas").on('click', function(e){
        window.location.href="/rutinas/mis-rutinas";
    })

    $("#botonIniciarRutina").on('click', function(){
        //window.location.href="iniciarRutinaTEA.html";
        $("#buttonsRutina").fadeOut(function(){
            $("#containerInicioRutina").fadeIn();
        })
    })

    



})