$(document).ready(function () {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

    $('#label-permisoTextoLibre').on('click', function (e) {
        e.preventDefault();
    });

    $('#permisoTextoLibre').on('change', function () {
        let alerta = $('<div>').addClass('alert alert-light alert-custom').attr('role', 'alert');
        let mensaje;
        var cambio;

        if ($(this).prop('checked')) {
            mensaje = 'Se ha activado el texto libre.'
            cambio = true;
        } else {
            mensaje = 'Se ha desactivado el texto libre.'
            cambio = false;
        }

        $.ajax({
            url: '/tarjetas-comunicacion/cambiar-texto-libre',
            method: 'PUT',
            data: {
                texto: cambio
            },
            success: function (data, status, xhr) {
                if (data.success) {
                    alerta.append(mensaje).hide();
                    alerta.attr('id', 'activo');
                    $('#avisosPictos').append(alerta);
                    alerta.fadeIn();
                    setTimeout(function () {
                        $('#activo').fadeOut(400, function () {
                            $(this).remove();
                        });
                    }, 500);
                }
            },
            error: function (data, status, xhr) {

            }
        });

    });
});
