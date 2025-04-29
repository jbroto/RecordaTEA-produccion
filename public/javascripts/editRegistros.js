$(document).ready(function () {
   
    const defaultSrc = "/images/emotions/emociones.png";
    const emocionActual = $("#emocionSeleccionada").attr('src');
    const emocion = emocionActual === defaultSrc ? null : emocionActual;

    if (emocion !== null) {
        marcarEmocionSeleccionada(emocion);
    }

    function marcarEmocionSeleccionada(srcEmocion) {
        $('#emocionModal .card').removeClass('seleccionada');
        const matchingCard = $(`#emocionModal .card img[src="${srcEmocion}"]`);
        if (matchingCard.length) {
            matchingCard.closest('.card').addClass('seleccionada');
        }
    }


    $('#emocionModal .card').on('click', function (e) {
        e.preventDefault();
        $('#emocionModal .card').removeClass('seleccionada');
        $(this).addClass('seleccionada');
    });

    $("#addEmocionButton").on('click', function () {
        const seleccionada = $('#emocionModal .card.seleccionada img').attr('src');

        console.log(seleccionada);
        if (seleccionada) {
            $("#emocionSeleccionada").attr('src', seleccionada);
            $("#tituloEmocionSeleccionada").text(seleccionada.split('/').pop().replace('.png', '').toUpperCase());
        } else {
            $("#emocionSeleccionada").attr('src', defaultSrc);
            $("#tituloEmocionSeleccionada").text(seleccionada.split('/').pop().replace('.png', '').toUpperCase());
        }

        $('#emocionModal').modal('hide');
    });

    $('#editar-btn-edit').click(function () {
        $('#fecha-edit, #hora-edit')
            .removeAttr('readonly')
            .removeClass('no-editable');

        $('#editar-btn-edit').hide();
        $('#cancel-btn-edit').show();
    });

  
    $('#cancel-btn-edit').click(function () {
        $('#fecha-edit, #hora-edit')
            .addClass('no-editable')
            .prop("readonly", true);

        $('#editar-btn-edit').show();
        $('#cancel-btn-edit').hide();
    });


    $('#contenedorVocabulario').on('click', '.card', function (event) {
        event.preventDefault();

        const card = $(this);
        const column = card.closest('.col-lg-2, .col-auto');
        const contenedorRegistros = $('#contenedorRegistrosEdit');
        const clonedColumn = column.clone();
        clonedColumn.removeClass('col-lg-2 col-md-3 mt-3').addClass('col-auto');
        clonedColumn.find('.card').addClass('mb-3');
        clonedColumn.find('img').addClass('tamaño-texto');

        // Añadir X si no existe
        if (clonedColumn.find('.cross-icon').length === 0) {
            clonedColumn.find('.card').append(
                '<span class="cross-icon" style="position: absolute; top: 5px; right: 10px; font-size: 20px; cursor: pointer;">X;</span>'
            );
        }

        // Asegurar posición relativa para posicionar bien la X
        clonedColumn.find('.card').css('position', 'relative');
        contenedorRegistros.append(clonedColumn);
    });

    
    $('#contenedorRegistrosEdit').on('click', '.card', function (event) {
        event.stopPropagation();
        $(this).closest('.col-lg-2, .col-auto').remove();
    });


    $('#updateButton').on('click', function (e) {
        e.preventDefault();

        const tarjetas = [];
        $('#contenedorRegistrosEdit .card').each(function (index) {
            const idTarjeta = parseInt($(this).attr('id'));
            tarjetas.push({ id: idTarjeta, orden: index + 1 });
        });

        const emocionSeleccionada = $('#emocionSeleccionada').attr('src');
        const emocionFinal = emocionSeleccionada === defaultSrc ? null : emocionSeleccionada;

        const fecha = $('#fecha-edit').val();
        const hora = $('#hora-edit').val();
        const [year, month, day] = fecha.split('-');
        const [hours, minutes] = hora.split(':');

        const fechaHoraFormatted = `${year}-${month}-${day} ${hours}:${minutes}:00`;
        const idEntrada = window.location.pathname.split('/').pop();

        let entrada;

        if ($('#text-area-edit').length > 0) {
            const escrito = $('#text-area-edit').val();
            entrada = {
                fecha_registro: fechaHoraFormatted,
                tarjetas: [],
                id: idEntrada,
                emocion: null,
                tipo: "Texto",
                cuerpo: escrito
            };
        } else {
            entrada = {
                fecha_registro: fechaHoraFormatted,
                tarjetas: tarjetas,
                id: idEntrada,
                emocion: emocionFinal,
                tipo: "Picto",
                cuerpo: null
            };
        }

        $('#registrosEditadosInput').val(JSON.stringify(entrada));
        $('#registrosFormEdit').submit();
    });
});
