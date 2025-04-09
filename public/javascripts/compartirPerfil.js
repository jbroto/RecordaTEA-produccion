$(document).ready(function () {

    $(document).on('click', '#btn-compartir', function (e) {
        e.preventDefault();
        let id = $(this).data('id');
        let nombre = $(this).data('nombre');
        $('#btnCompartir').data('id', id);
        $('#btnCompartir').data('nombre', nombre);
    });

    $(document).on('click', '#btnCompartir', function (e) {
        e.preventDefault();
        let idPerfil = $(this).data('id');
        let form = $('#compartirConUsuario').val().trim();
        let nombre = $(this).data('nombre');
        let alerta = $('<div>').addClass('alert alert-light alert-custom').attr('role', 'alert');
        if(form === ''){
            $('#compartirConUsuario').addClass('is-invalid');
            $('#compartirConUsuario-error').text('Campo obligatorio.');
        }
        else{
            let data = {
                idPerfil: idPerfil,
                usuario: form
            };
            $.ajax({
                url: '/cuidadores/compartir-usuario',
                method: 'POST',
                data: data,
                success: function(response){
                    if(response.mensaje > 0){
                        $('#compartirPerfil').modal('hide');
                        alerta.text('Usuario compartido con éxito.').attr('id', `alert-${response.mensaje.id}`).hide();
                        $('#avisosPictos').append(alerta);
                        $(`#alert-${response.mensaje.id}`).fadeIn();
                        setTimeout(function () {
                            $(`#alert-${response.mensaje.id}`).fadeOut().remove();
                        }, 2000);
                    }
                    else if(response.mensaje == -1){
                        $('#compartirConUsuario').addClass('is-invalid');
                        $('#compartirConUsuario-error').text('El usuario no existe.');
                    }
                    else if (response.mensaje == -8){
                        $('#compartirConUsuario').addClass('is-invalid');
                        $('#compartirConUsuario-error').text('Datos inválidos.');
                    }
                    else if (response.mensaje == -9){
                        $('#compartirConUsuario').addClass('is-invalid');
                        $('#compartirConUsuario-error').text(nombre+' ya está vinculado a '+form+'.');
                    }
                },
                error: function(response){

                }
            });
        }
    });
});