$(document).ready(function () {

    var progreso = 0;
    var userEscrito = { valor: false };
    var passwEscrita = { valor: false };
    var passwConfirmacion = { valor: false };
    var nombreEscrito = { valor: false };
    var img;
    var url;
    var cropper;
    var modal = new bootstrap.Modal(document.getElementById('recorta-img'));

    const tiposValidos = ["image/jpeg", "image/png", "image/webp"];
    const barraProgreso = $('#progreso-crear-usuario');


    $(document).on('click', '#ver-passw-perfil', function (e) {
        e.preventDefault();
        if ($("#passw-perfil").attr("type") === "password") {
            $('#passw-perfil').attr('type', 'text');
            $(this).html('<i class="bi bi-eye-slash"></i>');
        }
        else {
            $('#passw-perfil').attr('type', 'password');
            $(this).html('<i class="bi bi-eye">');
        }
    });

    $('#passw-confirmacion-perfil, #passw-perfil').on('keyup', function (e) {
        let pass = $('#passw-perfil').val();
        let confirm = $('#passw-confirmacion-perfil').val();

        if (pass === confirm) {
            $("#add-perfil").prop("disabled", false);
            $('#passw-confirmacion-perfil').removeClass('is-invalid');
        }
        else {
            $("#add-perfil").prop("disabled", true);
            $("#error-perfil").text('Las contraseñas no coinciden');
            $('#passw-confirmacion-perfil').addClass('is-invalid');
        }
    });

    $('#mostrar-form').on('click', function (e) {
        e.preventDefault();
        $('#mostrar-perfiles').fadeOut().addClass('d-none');
        $('#container-form').fadeIn();
    });

    $('#add-perfil').on('click', function (e) {
        e.preventDefault();

        let usuario = $('#usuario-perfil');
        let passw = $('#passw-perfil');
        let confirm = $('#passw-confirmacion-perfil');
        let nombre = $('#nombre-perfil');
        let valido = true;

        let usuarioValor = usuario.val().trim();
        let passwValor = passw.val().trim();
        let confirmValor = confirm.val().trim();
        let nombreValor = nombre.val().trim();

        usuario.removeClass('is-invalid');
        passw.removeClass('is-invalid');
        confirm.removeClass('is-invalid');
        nombre.removeClass('is-invalid');


        if (usuarioValor === '') {
            usuario.addClass('is-invalid');
            $('#usuario-error-perfil').text('Campo obligatorio.');
            valido = false;
        }
        if (passwValor === '') {
            passw.addClass('is-invalid');
            $('#passw-error-perfil').text('Campo obligatorio.');
            valido = false;
        }
        if (confirmValor === '') {
            confirm.addClass('is-invalid');
            $('#error-perfil').text('Campo obligatorio.')
            valido = false;
        }
        if (nombreValor === '') {
            nombre.addClass('is-invalid');
            valido = false;
        }

        if (valido) {

            let formData = new FormData();
            formData.append('usuario', usuarioValor);
            formData.append('passw', passwValor);
            formData.append('nombre', nombreValor);

            const inputFile = $('#imgPerfil')[0].files[0];
            const fileName = inputFile ? inputFile.name : 'imagen_recortada.jpg';
            if (img) {
                img.toBlob(function (blob) {
                    formData.append('image', blob, fileName);
                    enviarFormulario(formData);
                });
            }
            else {
                enviarFormulario(formData);
            }


        }
    });

    $('#volver-inicio').on('click', function (e) {
        $('#container-form').hide();
        $('#mostrar-perfiles').show().removeClass('d-none');
        $('#usuario-perfil').val('');
        $('#passw-perfil').val('');
        $('#passw-confirmacion-perfil').val('');
        $('#nombre-perfil').val('');
    });

    $('#usuario-perfil').on('input', function () {
        actualizaProgreso($(this), userEscrito);
    });

    $('#passw-perfil').on('input', function () {
        actualizaProgreso($(this), passwEscrita);
    });

    $('#passw-confirmacion-perfil').on('input', function () {
        actualizaProgreso($(this), passwConfirmacion);
    });

    $('#nombre-perfil').on('input', function () {
        actualizaProgreso($(this), nombreEscrito);
    });

    $('#imgPerfil').on('change', function (e) {
        let image = e.target.files[0];

        if (image) {
            if (!tiposValidos.includes(image.type)) {
                alert("Solo se permiten imágenes (JPG, PNG, WEBP).");
                this.value = ""; // Borra la selección del archivo
                return;
            }

            $("#nombreImgPerfil").text(image.name);

            const reader = new FileReader();

            reader.onload = function (event) {

                $("#imagenRecortable").attr("src", event.target.result);
                modal.show();
            }

            reader.readAsDataURL(e.target.files[0]);
        }
        $(this).val('');
    });

    $('#recorta-img').on('shown.bs.modal', function () {
        if (cropper) cropper.destroy();

        cropper = new Cropper(document.getElementById("imagenRecortable"), {
            aspectRatio: 1,
            viewMode: 1,
            background: true,
            autoCropArea: 0.8,
            movable: true,
            rotatable: true,
            scalable: false,
            zoomable: true,
            minCropBoxWidth: 500,
            minCropBoxHeight: 500,
            cropBoxResizable: false,
            cropBoxMovable: false,
            responsive: true,
            dragMode: 'move'
        });

    });

    $('#recortar-img').on('click', function () {
        if (!cropper) return;

        img = cropper.getCroppedCanvas({
            width: 500,
            height: 500
        });

        img.toBlob(function (blob) {
            url = URL.createObjectURL(blob);
            $("#imagenPerfil").attr("src", url);
        });

        $('#errores-img').hide();
        $("#recorta-img").modal("hide");
    });



    function actualizaProgreso(componente, comprobacion) {
        if (componente.val().trim() === '') {
            progreso -= 25;
            comprobacion.valor = false;
            barraProgreso.css('width', progreso + '%');
        }
        else {
            if (!comprobacion.valor) {
                progreso += 25;
                comprobacion.valor = true;
                barraProgreso.css('width', progreso + '%');
            }
        }
    }

    async function enviarFormulario(formData) {
        let usuario = $('#usuario-perfil');
        $.ajax({
            url: '/users/nuevo-usuario',
            method: 'POST',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                let errImg = $('#errores-img');
                if (response.mensaje > 0) {
                    const estiloImagen = img ? '' : 'style="opacity: 70%;"';

                    let usu = `
                        <div class="col-md-3 col-xs-3 mb-5">
                            <a href="/diario/${response.mensaje}">
                                <div class="card card-usuarios align-content-center justify-content-center text-end">
                                    <div class="card-body">
                                        <img class="card-img img-fluid placeholder" src="/images/config/perfilDefecto.png" ${estiloImagen} id="img-${response.mensaje}">
                                        <h5 class="text-center">${formData.get('nombre')}</h5>
                                        <hr class="my-2">
                                        <button class="btn-compartir btn btn-background text-end" 
                                                data-id="${response.mensaje}" 
                                                data-nombre="${formData.get('nombre')}" 
                                                data-bs-toggle="modal" 
                                                data-bs-target="#compartirPerfil">
                                            <i class="fa-solid fa-share"></i>
                                        </button>
                                    </div>
                                </div>
                            </a>
                        </div>`;

                    $('#cards-usuarios').prepend(usu);
                    $('#aviso-boton').hide();
                    $('#container-form').fadeOut();
                    $('#mostrar-perfiles').removeClass('d-none').fadeIn();
                    obtenerImgSrc(img).then((imagenSrc) => {
                        $(`#img-${response.mensaje}`).attr('src', imagenSrc).removeClass('placeholder');
                    });

                    $('#usuario-perfil').val('');
                    $('#passw-perfil').val('');
                    $('#passw-confirmacion-perfil').val('');
                    $('#nombre-perfil').val('');
                    $('#imgPerfil').val('');
                    $('#nombreImgPerfil').text('Ninguna imagen seleccionada.');
                    $("#imagenPerfil").attr('src', '/images/config/perfilDefecto.png');
                    progreso = 0;
                    barraProgreso.css('width', progreso + '%');

                    img = null;
                }
                else if (response.mensaje == -3) {
                    usuario.addClass('is-invalid');
                    $('#usuario-error-perfil').text('Usuario ya existente.');
                } else if (response.mensaje == -5) {
                    errImg.text('Error al añadir el archivo: no es una imagen.').show();
                }
                else if (response.mensaje == -6) {
                    errImg.text('Error al añadir el archivo: tipo no permitido.').show();
                }
                else if (response.mensaje == -7) {
                    errImg.text('Error al añadir el archivo: excede el tamaño máximo permitido (500KB).').show();
                }
            },
            error: function () {

            }
        });
    }

    async function obtenerImgSrc(i) {
        if (!i) return '/images/config/perfilDefecto.png';

        return new Promise((resolve) => {
            i.toBlob((blob) => {
                const url = URL.createObjectURL(blob);
                resolve(url);
            });
        });
    }
});