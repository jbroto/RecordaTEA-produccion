$(document).ready(function () {
    var pagina = 1;
    var consulta = "";
    var ultPag;
    var persiste = false;

    if (!$("#permisoTextoPicto").prop('checked')) { $(".nombre-pictograma").hide() }

    $('#permisoTextoPicto').on('change', function () {
        let alerta = $('<div>').addClass('alert alert-light alert-custom').attr('role', 'alert');
        let mensaje;
        var cambio;

        if ($(this).prop('checked')) {
            mensaje = 'Se ha activado el texto al Pictograma.'
            cambio = true;
        } else {
            mensaje = 'Se ha desactivado el texto al Pictograma.'
            cambio = false;
        }

        $.ajax({
            url: '/tarjetas-comunicacion/cambiar-texto-picto',
            method: 'PUT',
            data: {
                picto: cambio
            },
            success: function (data, status, xhr) {
                if (data.success) {
                    alerta.append(mensaje).hide();
                    alerta.attr('id', 'activo');
                    $('#avisosPictos').append(alerta);
                    alerta.fadeIn();
                    setTimeout(function () {
                        $('#activo').fadeOut(1500, function () {
                            $(this).remove();
                        });
                    }, 1500);

                    if (cambio) {
                        $(".nombre-pictograma").show();
                    }
                    else {
                        $(".nombre-pictograma").hide();
                    }


                }
            },
            error: function (xhr, status, error) {
                let alerta = $('<div>').addClass('alert alert-light alert-custom').attr('role', 'alert');
                alerta.text(error.message).attr('id', `alert-${status}`).hide();
                    $('#avisosPictos').append(alerta);
                    $(`#alert-${status}`).fadeIn();
                    setTimeout(function () {
                        $(`#alert-${status}`).fadeOut(400, function () {
                            $(this).remove();
                        });
                    }, 1000);
            }
        });

    });

    $('#buscaArasaac').on('click', function (e) {
        e.preventDefault();
        consulta = $('#campoBusqueda').val().trim();
        pagina = 1;
        let contenedorPictos = $('#resultBusqueda');
        let cont = $('<div>').attr('id', 'page-1').addClass('row');
        if (consulta === null || consulta === undefined || consulta === "") {
        }
        else {
            $('#paginas').hide();
            $.ajax({
                url: '/tarjetas-comunicacion/arasaac',
                method: 'GET',
                data: { consulta: consulta },
                beforeSend: function () {
                    $('#matrizBusqueda').show();
                    $('#cargando').show();
                    contenedorPictos.hide().empty();
                    $('#avisos').find('span').remove();
                },
                success: function (data, status, xhr) {
                    if (data.pictos.length > 0 || !data) {
                        data.pictos.forEach(picto => {
                            const divPicto = $('<div>').addClass('col-lg-2 col-md-3 mt-3 d-flex');
                            const card = $('<div>').addClass('card').addClass('gestion');
                            const enlace = $('<a>').attr('href', '');
                            const imagen = $('<img>').attr('src', picto.enlace).attr('alt', consulta).addClass('card-img');
                            const fondo = $('<div>').addClass('add-picto');
                            const mas = $('<span>').attr('id', picto.id_arasaac).attr('data-enlace', picto.enlace).addClass('mas').text('+');
                            const titulo = $('<h5>').addClass('nombre-pictograma text-center').text(picto.keyword);
                            enlace.append(imagen);
                            card.append(enlace, fondo, mas, titulo);
                            divPicto.append(card);
                            cont.append(divPicto);
                        });
                        contenedorPictos.append(cont);
                        if (data.paginacion >= 17) {
                            $('#paginas').show();
                            $('#anteriorPag').prop('disabled', true);
                            $('#siguientePag').prop('disabled', false);
                        }
                    }
                    else {
                        const sp = $('<span>').text('No se encontraron pictogramas que coincidan con su búsqueda.').addClass('aviso');
                        $('#avisos').append(sp);
                    }
                    $('#cargando').hide();
                    if (!$('#permisoTextoPicto').prop('checked')) {
                        $(".nombre-pictograma").hide();
                    }
                    contenedorPictos.show();
                },
                error: function (xhr, status, error) {
                    let alerta = $('<div>').addClass('alert alert-light alert-custom').attr('role', 'alert');
                    alerta.text(error.message).attr('id', `alert-${status}`).hide();
                        $('#avisosPictos').append(alerta);
                        $(`#alert-${status}`).fadeIn();
                        setTimeout(function () {
                            $(`#alert-${status}`).fadeOut(400, function () {
                                $(this).remove();
                            });
                        }, 1000);
                }
            });
        }
    });


    $('#siguientePag').on('click', function (e) {
        e.preventDefault();
        $(`#page-${(pagina)}`).hide();
        pagina += 1;
        if (document.getElementById(`page-${(pagina)}`)) {
            $(`#page-${(pagina)}`).show();
            $('#anteriorPag').prop('disabled', false);
            if (ultPag !== undefined && ultPag === pagina) {
                $('#siguientePag').prop('disabled', true);
            }
        }
        else {
            let cont = $('<div>').attr('id', `page-${pagina}`).addClass('row');
            let contenedorPictos = $('#resultBusqueda');
            $.ajax({
                url: '/tarjetas-comunicacion/pagina',
                method: 'GET',
                data: { pagina: pagina },
                beforeSend: function () {
                    $('#cargando').show();
                },
                success: function (data, status, xhr) {
                    if (data.pictos.length > 0) {
                        data.pictos.forEach(picto => {
                            const divPicto = $('<div>').addClass('col-lg-2 col-md-3 mt-3 d-flex');
                            const card = $('<div>').addClass('card').addClass('gestion');
                            const enlace = $('<a>').attr('href', '');
                            const imagen = $('<img>').attr('src', picto.enlace).attr('alt', consulta).addClass('card-img');
                            const fondo = $('<div>').addClass('add-picto');
                            const mas = $('<span>').attr('id', picto.id_arasaac).attr('data-enlace', picto.enlace).addClass('mas').text('+');
                            const titulo = $('<h5>').addClass('nombre-pictograma text-center').text(picto.keyword);
                            enlace.append(imagen);
                            card.append(enlace, fondo, mas, titulo);
                            divPicto.append(card);
                            cont.append(divPicto);
                        });
                        if (data.paginacion < 17) {
                            ultPag = pagina;
                            $('#siguientePag').prop('disabled', true);
                        }
                        $('#cargando').hide();
                        if (!$('#permisoTextoPicto').prop('checked')) {
                            $(".nombre-pictograma").hide();
                        }
                        $('#anteriorPag').prop('disabled', false);
                        contenedorPictos.append(cont);
                    }
                },
                error: function(xhr, status, error){
                    let alerta = $('<div>').addClass('alert alert-light alert-custom').attr('role', 'alert');
                    alerta.text(error.message).attr('id', `alert-${status}`).hide();
                        $('#avisosPictos').append(alerta);
                        $(`#alert-${status}`).fadeIn();
                        setTimeout(function () {
                            $(`#alert-${status}`).fadeOut(400, function () {
                                $(this).remove();
                            });
                        }, 1000);
                }
            });
        }
    });

    $('#anteriorPag').on('click', function (e) {
        e.preventDefault();
        $(`#page-${(pagina)}`).hide();
        pagina -= 1;
        $(`#page-${(pagina)}`).show();
        if (pagina === 1) {
            $('#anteriorPag').prop('disabled', true);
        }
        if ($('#siguientePag').prop('disabled')) {
            $('#siguientePag').prop('disabled', false);
        }
    });

    $('#resultBusqueda').on('click', '.mas', function (e) {
        e.preventDefault();
        let id = $(this).attr('id');
        let enlace = $(this).attr('data-enlace');
        let texto = $(this).closest('.card').find('.nombre-pictograma').text();
        let divPicto = $(this).closest('.col-lg-2.col-md-3.mt-3.d-flex');
        let carta = $(this).closest('.card.gestion');
        let copia = carta.clone(true);
        let alerta = $('<div>').addClass('alert alert-light alert-custom').attr('role', 'alert');
        $.ajax({
            url: '/tarjetas-comunicacion/picto-vocabulario',
            method: 'POST',
            data: {
                id_arasaac: id,
                enlace: enlace,
                keyword: texto
            },
            success: function (data, status, xhr) {
                if (data.success) {
                    //Contruir la papelera y eliminar el +
                    copia.find(`#${data.id_arasaac}`).remove();
                    copia.find('.add-picto').remove();
                    let hov = $('<div>').addClass('remove-picto');
                    let basura = $('<span>').attr('id', data.id).addClass('trash').html('<i class="bi bi-trash3-fill"></i>');
                    copia.append(hov, basura);
                    let div = divPicto.clone(true);
                    div.empty().removeClass('d-flex');
                    let d = $('<div>').addClass('d-flex');
                    div.append(d).append(copia);

                    //Añadirlo al contenedor del vocabulario
                    $('#contenedorPictogramas').prepend(div);

                    // Eliminar texto de no pictos (si lo hubiese)
                    $('#no-pictos').hide();
                    $('#no-pictos span').hide();


                    //Mostrar el aviso de cambios guardados
                    alerta.text('Cambios guardados').attr('id', `alert-${data.id}`).hide();
                    $('#avisosPictos').append(alerta);
                    $(`#alert-${data.id}`).fadeIn();
                    setTimeout(function () {
                        $(`#alert-${data.id}`).fadeOut(400, function () {
                            $(this).remove();
                        });
                    }, 500);
                }
                else {
                    alerta.text('El picto ya existe en el vocabulario.').attr('id', `alert-${data.id}`).hide();
                    $('#avisosPictos').append(alerta);
                    $(`#alert-${data.id}`).fadeIn();
                    setTimeout(function () {
                        $(`#alert-${data.id}`).fadeOut(400, function () {
                            $(this).remove();
                        });
                    }, 500);
                }
            },
            error: function (xhr, status, error) {
                let alerta = $('<div>').addClass('alert alert-light alert-custom').attr('role', 'alert');
                alerta.text(error.message).attr('id', `alert-${status}`).hide();
                    $('#avisosPictos').append(alerta);
                    $(`#alert-${status}`).fadeIn();
                    setTimeout(function () {
                        $(`#alert-${status}`).fadeOut(400, function () {
                            $(this).remove();
                        });
                    }, 1000);
            }
        });
    });

    $('#contenedorPictogramas, #contenedorImagenes').on('click', '.trash', function (e) {
        e.preventDefault();
        //Obtenemos los datos
        let id = $(this).attr('id');
        let divPicto = $(this).closest('.col-lg-2.col-md-3.mt-3');
        let card = $(this).closest('.card');
        persiste = true;

        //Escondemos el picto como si estuviese eliminado
        divPicto.hide();

        //Avisamos de que ha eliminado un picto y que lo puede deshacer
        let alerta = $('<div>').addClass('alert alert-light alert-custom').attr('role', 'alert');
        let contenedorPadre = $(this).closest('#contenedorPictogramas, #contenedorImagenes');
        let nombreContenedor = contenedorPadre.attr('id');
        let mensaje;
        if (nombreContenedor === 'contenedorPictogramas') {
            mensaje = $('<span>').text('Se ha eliminado el pictograma');
        }
        else {
            mensaje = $('<span>').text('Se ha eliminado la imagen');
        }
        let deshacer = $('<button>').addClass('btn btn-sm btn-deshacer').attr('id', 'deshacer-elim').text('Deshacer');
        alerta.append(mensaje, deshacer).hide();
        $('#avisosPictos').append(alerta);
        alerta.fadeIn();
        let temp = setTimeout(function () {
            alerta.fadeOut(function () {
                alerta.remove();
            });
            if (persiste) {
                eliminarPicto(id);
            }
        }, 5000);

        deshacer.on('click', function (e) {
            e.preventDefault();
            persiste = false;
            clearTimeout(temp);
            alerta.fadeOut();
            divPicto.show();
        });

        $(window).on('beforeunload', function () {
            if (persiste) {
                let data = new FormData();
                data.append('id', id);
                navigator.sendBeacon('/tarjetas-comunicacion/eliminar-picto', data);
            }
        });
    });

    $('#btn-pictos').on('click', function (e) {
        $('#btn-pictos').addClass('seleccion');
        $('#btn-imagenes').removeClass('seleccion');
        $('#btn-texto').removeClass('seleccion');
        $('#gestion-imagenes').hide();
        $('#texto-libre').hide();
        $('#gestion-pictogramas').show();
    });

    $('#btn-imagenes').on('click', function (e) {
        $('#btn-imagenes').addClass('seleccion');
        $('#btn-pictos').removeClass('seleccion');
        $('#btn-texto').removeClass('seleccion');
        $('#gestion-pictogramas').hide();
        $('#texto-libre').hide();
        $('#gestion-imagenes').show();
    });

    $('#btn-texto').on('click', function (e) {
        $('#btn-imagenes').removeClass('seleccion');
        $('#btn-pictos').removeClass('seleccion');
        $('#btn-texto').addClass('seleccion');
        $('#gestion-pictogramas').hide();
        $('#gestion-imagenes').hide();
        $('#texto-libre').show();
    });

    function eliminarPicto(id) {
        $.ajax({
            url: '/tarjetas-comunicacion/eliminar-picto',
            method: 'DELETE',
            data: {
                id: id
            },
            success: function (data, status, xhr) {
                if (data.success) {
                    $(`#${id}`).closest('.col-lg-2.col-md-3.mt-3').remove();
                }
            },
            error: function (xhr, status, error) {
                let alerta = $('<div>').addClass('alert alert-light alert-custom').attr('role', 'alert');
                alerta.text(error.message).attr('id', `alert-${status}`).hide();
                    $('#avisosPictos').append(alerta);
                    $(`#alert-${status}`).fadeIn();
                    setTimeout(function () {
                        $(`#alert-${status}`).fadeOut(400, function () {
                            $(this).remove();
                        });
                    }, 1000);
            }
        });
    }
})