$(document).ready(function () {
    let cropper;
    var modal = new bootstrap.Modal(document.getElementById('recorta-img'));
    var img;
    var url;
    const tiposValidos = ["image/jpeg", "image/png", "image/webp"];

    $('#imagenSeleccionada').on('change', function (e) {
        let image = e.target.files[0];

        if (image) {
            if (!tiposValidos.includes(image.type)) {
                alert("Solo se permiten imágenes (JPG, PNG, WEBP).");
                this.value = "";
                return;
            }

            $("#nombreArchivo").text(image.name);

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
            $("#preview-image").attr("src", url);
            $("#btn-subir").show();
        });

        $("#recorta-img").modal("hide");
    });

    $('#btn-subir').on('click', function (e) {
        e.preventDefault();

        const inputFile = $('#imagenSeleccionada')[0].files[0];
        const fileName = inputFile ? inputFile.name : 'imagen_recortada.jpg';

        let formData = new FormData();

        img.toBlob(function (blob) {
            formData.append('image', blob, fileName);
            let alerta = $('<div>').addClass('alert alert-light alert-custom').attr('role', 'alert');
            $.ajax({
                url: '/tarjetas-comunicacion/nueva-imagen',
                method: 'POST',
                data: formData,
                contentType: false,
                processData: false,
                success: function (response) {
                    if (response.mensaje > 0) {
                        let tarjetaImagen = `
                        <div class="col-lg-2 col-md-3 mt-3">
                            <div class="dflex">
                                <div class="card">
                                    <a href="">
                                        <img src="${url}" class="card-img">
                                    </a>
                                    <div class="remove-picto"></div>
                                    <span id="${response.mensaje}" class="trash">
                                        <i class="bi bi-trash3-fill"></i>
                                    </span>
                                </div>
                            </div>
                        </div>
                    `;

                        $('#no-imagenes').hide().addClass('d-none');

                        $('#contenedorImagenes').prepend(tarjetaImagen);
                        alerta.text('Imagen añadidia con éxito.').attr('id', `alert-${response.mensaje.id}`).hide();
                        $('#avisosPictos').append(alerta);
                        $(`#alert-${response.mensaje.id}`).fadeIn();
                        setTimeout(function () {
                            $(`#alert-${response.mensaje.id}`).fadeOut(400, function () {
                                $(this).remove();
                            });
                        }, 500);
                    }
                    else if (response.mensaje == -5) {
                        alerta.text('Error al añadir el archivo: no es una imagen.').attr('id', `alert-${response.mensaje.id}`).hide();
                        $('#avisosPictos').append(alerta);
                        $(`#alert-${response.mensaje.id}`).fadeIn();
                        setTimeout(function () {
                            $(`#alert-${response.mensaje.id}`).fadeOut(400, function () {
                                $(this).remove();
                            });
                        }, 1000);
                    }
                    else if (response.mensaje == -6) {
                        alerta.text('Error al añadir el archivo: tipo no permitido.').attr('id', `alert-${response.mensaje.id}`).hide();
                        $('#avisosPictos').append(alerta);
                        $(`#alert-${response.mensaje.id}`).fadeIn();
                        setTimeout(function () {
                            $(`#alert-${response.mensaje.id}`).fadeOut(400, function () {
                                $(this).remove();
                            });
                        }, 1000);
                    }
                    else if (response.mensaje == -7) {
                        alerta.text('Error al añadir el archivo: excede el tamaño máximo permitido (500KB).').attr('id', `alert-${response.mensaje.id}`).hide();
                        $('#avisosPictos').append(alerta);
                        $(`#alert-${response.mensaje.id}`).fadeIn();
                        setTimeout(function () {
                            $(`#alert-${response.mensaje.id}`).fadeOut(400, function () {
                                $(this).remove();
                            });
                        }, 1000);
                    }
                },
                error: function () {

                }
            });
        });

    });
});
