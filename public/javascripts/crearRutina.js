$(document).ready(function () {
    var imgSeleccionadaAnt = null;
    var idImg;
    var progreso = 0;
    var escrito = false;
    var pictos = false;

    $('#portadaModal img').on('click', function (e) {
        e.preventDefault();
        if (imgSeleccionadaAnt != null) {
            imgSeleccionadaAnt.parent().removeClass('seleccionada');
        }
        imgSeleccionadaAnt = $(this);
        $(this).parent().addClass('seleccionada');
        idImg = imgSeleccionadaAnt.parent().attr('id');
    });

    $('#seleccionarPortada').on('click', function () {
        if (imgSeleccionadaAnt != null) {
            let imgSeleccionada = imgSeleccionadaAnt.attr('src');
            $('#portadaImagen').attr('src', imgSeleccionada).attr('data-id', idImg);
        }
        progreso+=25;
        $('#barra-progreso').css('width', progreso +'%');
        $("#portadaModal").modal("hide");
    });

    $('#eliminarPortada').on('click', function (e) {
        e.preventDefault();
        imgSeleccionadaAnt.removeClass('seleccionada');
        progreso-=25;
        $('#barra-progreso').css('width', progreso +'%');
        $('#portadaImagen').attr('src', '/images/config/noPortada.png');
    });

    $('#cancelarPortada').on('click', function () {
        imgSeleccionadaAnt.removeClass('seleccionada');
    });

    $('#nombreRutina').on('input', function(){
        if ($(this).val().trim() === "") {
            progreso-=25;
            $('#barra-progreso').css('width', progreso +'%');
            escrito = false;
        } 
        else {
            if(!escrito){
                progreso+=25;
                $('#barra-progreso').css('width', progreso +'%');
                escrito = true;
            }
        }
    });

    $('#stepDos').on('click', function (e) {
        e.preventDefault();
        $('#basicoRutina').fadeOut(function () {
            $('#stepTarjetas').fadeIn();
        });
    });

    $('#stepAnterior').on('click', function (e) {
        e.preventDefault();
        $('#stepTarjetas').fadeOut(function () {
            $('#basicoRutina').fadeIn();
        });
    });


    $("#tarjetasRutinas").on("click", ".card", function () {
        let $card = $(this).closest(".col-lg-2.col-md-3"); // Capturar toda la columna
        let imgSrc = $card.find("img").attr("src");
        let cardId = $card.find(".card").attr("id");
        let cardText = $card.find(".card").find("h5").text();
        let h5Text = (cardText !== null && cardText !== undefined && cardText.trim() !== '') 
    ? `<h5 class="nombre-pictograma text-center">${cardText}</h5>` 
    : '';


        // Crear nueva tarjeta con el formato de eliminación
        let newCard = $(`
            <div class="col-lg-2 col-md-3 mt-3 d-flex">
                <div class="card" id="${cardId}">
                    <img src="${imgSrc}" class="card-img">
                    <div class="remove-picto"></div>
                    <span class="trash"><i class="bi bi-trash3-fill"></i></span>
                    ${h5Text}
                </div>
            </div>
        `);

        // Agregar al contenedor de la rutina
        $("#composiciónRutina").append(newCard);
        if(!pictos){
            pictos = true;
            progreso+=50;
            $('#barra-progreso').css('width', progreso +'%');
        }

    });

    // Evento para devolver la tarjeta de #composiciónRutina a #tarjetasRutinas
    $("#composiciónRutina").on("click", ".card", function () {
        let $card = $(this).closest(".col-lg-2.col-md-3"); // Capturar toda la columna
        let imgSrc = $card.find("img").attr("src");
        let cardId = $card.find(".card").attr("id");

        // Crear nueva tarjeta con el formato original
        let newCard = $(`
            <div class="col-lg-2 col-md-3 mt-3 d-flex">
                <div class="card" id="${cardId}">
                    <img src="${imgSrc}" class="card-img">
                    <div class="add-picto"></div>
                    <span class="mas">+</span>
                </div>
            </div>
        `);

        $card.remove();

        if ($('#composiciónRutina').children().length === 0) {
            pictos = false;
            progreso-=50;
            $('#barra-progreso').css('width', progreso +'%');
        }
    });



    $("#guardarRutina").on('click', function (e) {
        e.preventDefault();

        const tarjetas = [];
        // Recorrer todas las cards dentro del contenedorRegistros
        $('#composiciónRutina .card').each(function (index) {
            const card = $(this); // Obtener la card actual
            const idTarjeta = parseInt(card.attr('id')); // Obtener el id de la tarjeta
            const orden = index + 1; // Obtener el orden (posición) de la tarjeta (empezando desde 1)


            tarjetas.push({
                id_tarjeta: idTarjeta, // Guardar el id de la tarjeta
                orden: orden   // Guardar el orden de la tarjeta
            });

            const rutina = {
                nombre: $("#nombreRutina").val(),
                fecha_creacion: new Date(),
                tarjetas: tarjetas,
                id_portada: idImg
            };

            $("#rutinaInput").val(JSON.stringify(rutina));

            $("#form-rutina").submit();
        });
    })
});