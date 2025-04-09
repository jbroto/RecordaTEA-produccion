$(document).ready(function () {


    $('#buttonIniciar').click(function () {
        $('#texto-tarjeta').text('');
        if ($('#contenedorRutina .col-lg-2').length === 0) {
            window.location.href="/rutinas/mis-rutinas";
        }
        // Selecciona la primera tarjeta dentro del contenedorRutina
        var primeraTarjeta = $('#contenedorRutina .col-lg-2').first();
        var imagenBtnActual = $('#buttonIniciar').find('img').attr('src');

        if (imagenBtnActual === "/images/config/iniciar.png") {

            if (primeraTarjeta.length > 0) {

                var imagenTarjeta = primeraTarjeta.find('.card-img').attr('src');
                let txtTrajeta = primeraTarjeta.find('h5').text();
                $('#buttonIniciar .card-img').attr('src', imagenTarjeta);
                $('#texto-tarjeta').text(txtTrajeta);
                var ocultarTarjeta = primeraTarjeta.find('.card');

                // $('#contenedorRutinaHecha .row').append(primeraTarjeta);

            }

            else {
                $('#buttonIniciar .card-img').attr('src', "/images/config/iniciar.png");
                $('#texto-tarjeta').text('SIGUIENTE PASO');

            }
        } else {

            $('#contenedorRutinaHecha .row').append(primeraTarjeta);
            $('#buttonIniciar .card-img').attr('src', "/images/config/iniciar.png");

        }
        // Verifica si el contenedorRutina está vacío
        if ($('#contenedorRutina .col-lg-2').length === 0) {
            $('#buttonIniciar .card-img').attr('src', "/images/config/botonVolver.png");
          $('#terminado').text("Enhorabuena, has terminado la rutina");
        }
    });

    







});