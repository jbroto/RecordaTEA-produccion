
$(document).ready(function () {

    var fecha = new Date().toISOString().split('T')[0];
    var hora = new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
    var emocion = null;

    $('#fecha').val(fecha);
    $('#hora').val(hora);

    $('#editar-btn').click(function () {
        $('#fecha').removeAttr('readonly').removeClass('no-editable');;
        $('#hora').removeAttr('readonly').removeClass('no-editable');
        $('#editar-btn').hide();
        $('#cancel-btn').show();
    });

    $('#cancel-btn').click(function () {
        $('#fecha').addClass('no-editable').prop("readonly", true);
        $('#hora').addClass('no-editable').prop("readonly", true);
        $('#editar-btn').show();
        $('#cancel-btn').hide();
    });



    $("#mostrarPictos, #mostrarEmociones, .contenedorPictogramas").on("click", ".card", function (event) {
        event.preventDefault();

        let card = $(this);
        let column = card.closest(".col-lg-2, .col-md-3, .mt-3");
        let contenedorRegistros = $("#contenedorRegistros");

        // Si la card está en el contenedor de registros, eliminarla
        if (card.closest("#contenedorRegistros").length > 0) {
            column.remove();
        } else {
            // Si no está en contenedorRegistros, moverla ahí
            let clonedColumn = column.clone();

            // Añadir la X solo si no existe
            if (clonedColumn.find(".cross-icon").length === 0) {
                clonedColumn.find(".card").append('<span class="cross-icon">&times;</span>');
            }

            contenedorRegistros.append(clonedColumn);
        }
    });

 
    $('#addButton').on('click', function (e) {
        e.preventDefault();
        const fecha = $('#fecha').val(); // Ej: "2025-03-23"
        const hora = $('#hora').val();   // Ej: "10:30"
        
        // Crear un objeto Date en la zona local
        const [year, month, day] = fecha.split('-');
        const [hours, minutes] = hora.split(':');
        
        // Formatear como "YYYY-MM-DD HH:MM:SS"
        const fechaHoraFormatted = `${year}-${month}-${day} ${hora}:00`;
        
        

        if ($('#text-area').length > 0) {

            let escrito = $('#text-area').val();

            const entrada = {
                fecha_registro: fechaHoraFormatted,
                cuerpo: escrito,
                tipo : "Texto",
                emocion: null,
                tarjetas: []
                
            };

            $('#registrosInput').val(JSON.stringify(entrada));

        } else {
            const tarjetas = []; // Array para almacenar los datos de las cards

            // Recorrer todas las cards dentro del contenedorRegistros
            $('#contenedorRegistros .card').each(function (index) {
                const card = $(this); // Obtener la card actual
                const idTarjeta = parseInt(card.attr('id')); // Obtener el id de la tarjeta
                const orden = index + 1; // Obtener el orden (posición) de la tarjeta (empezando desde 1)

                tarjetas.push({
                    id: idTarjeta, // Guardar el id de la tarjeta
                    orden: orden   // Guardar el orden de la tarjeta
                });
            });

            if (emocionSeleccionadaAnt != null) {
                emocion = emocionSeleccionadaAnt.find('img').attr('src');
            }

            const entrada = {
                fecha_registro: fechaHoraFormatted,
                tarjetas: tarjetas,
                emocion: emocion,
                tipo : "Picto",
                cuerpo: null
            };

            // Convertir el array a JSON y asignarlo al input del formulario
            $('#registrosInput').val(JSON.stringify(entrada));
        }

        // Enviar el formulario
        $('#registrosForm').submit();
    });

    var emocionSeleccionadaAnt = null;

    $('#emocionModal .card').on('click', function (e) {
        e.preventDefault();
        if (emocionSeleccionadaAnt != null) {
            emocionSeleccionadaAnt.removeClass('seleccionada');
        }
        emocionSeleccionadaAnt = $(this);
        $(this).addClass('seleccionada');
    });

    $("#addEmocionButton").on('click', function () {
        var img = emocionSeleccionadaAnt.find('img').attr('src');
        $("#emocionSeleccionada").attr('src', img);
        $('#tituloEmocionSeleccionadaAdd').text(img.split('/').pop().replace('.png', '').toUpperCase());
        $('#emocionModal').modal('hide');

    })

});

