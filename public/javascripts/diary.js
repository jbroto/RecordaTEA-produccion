$(document).ready(function () {

    const currentYear = new Date().getFullYear();
    const startYear = '2000';
    let puedeHaberCambio = false;
    let anyos = $("#anyo").data("anyos");
    anyos = anyos.map(item => item.anyo);

    $('#anyo').datepicker({
        format: "yyyy",
        startView: "years",
        minViewMode: "years",
        startDate: startYear,
        endDate: currentYear + '-12-31',
        autoclose: true,
        beforeShowYear: function (year) {
            return anyos.includes(year.getFullYear());
        }
    }).datepicker("setDate", currentYear + "-01-01");

    const currentMonth = new Date().getMonth() + 1;
    $('#mes').val(currentMonth);
/* 
    if (sessionStorage.getItem("recup")) {
        let mesGuardado = sessionStorage.getItem("mesDiario");
        let anyoGuardado = sessionStorage.getItem("anyo");

        if (mesGuardado) $("#mes").val(parseInt(mesGuardado, 10));
        if (anyoGuardado) $("#anyo").val(anyoGuardado);

        sessionStorage.removeItem("recup");
        actializarDiario();
    }
    else {
        sessionStorage.setItem("mesDiario", $("#mes").val());
        sessionStorage.setItem("anyo", $("#anyo").val());
    } */

    const cargaDiario = debounce(actializarDiario, 600);
    ajustarAlturas();


    $("#mes, #anyo").on("change", function () {
        $(this).blur();
        sessionStorage.setItem("mesDiario", $("#mes").val());
        sessionStorage.setItem("anyo", $("#anyo").val());
        cargaDiario();
    });

    $("#mes, #anyo").on("focus", function () {
        puedeHaberCambio = true;
    });

    $("#mes, #anyo").on("blur", function () {
        puedeHaberCambio = false;
    });



    function actializarDiario() {
        if (puedeHaberCambio) return;

        let d = {
            mes: $("#mes").val(),
            anyo: $("#anyo").val()
        };

        $.ajax({
            url: '/diario/actualizar-diario',
            method: 'GET',
            data: d,
            success: function (entradas) {
                let codigo = '';
                if (entradas.data.length > 0) {
                    entradas.data.forEach((elem) => {
                        let d = diasPasados(elem.fecha);
                        let diaTexto = textoDias(d);
                        codigo += `
                        <a href="/diario/dia/${elem.fecha}" id="consultaDia2" class="mt-3">
                            <div class="d-flex align-items-center tarjeta-diario shadow-lg ${elem.hoy ? 'hoy' : ''}">
                                <div class="list-group-item list-dia flex-column align-items-center entrada">
                                    <div class="justify-content-center text-center">
                                        <h2>${elem.dia}</h2>
                                        <h3>${elem.mes}</h3>
                                    </div>
                                </div>
                                <div class="list-group-item list-contenido flex-column align-items-start entrada">
                                    <div class="d-flex w-100 justify-content-between">
                                        <h5 class="mb-1 texto-diario fw-bold">${elem.f} (${elem.entradas} ${elem.entradas === 1 ? 'registro' : 'registros'})</h5>
                                        <small>${diaTexto}</small>
                                    </div>
                                    <p class="mb-1 texto-diario fw-bold">Último registro:</p>
                                    <div class="img-registro img-fluid gap-3">
                                        ${elem.cuerpo ? `<div class="d-flex"><p class="align-items-center texto-entrada">${elem.cuerpo}</p></div>` : ""}
                                        ${elem.pictos ? elem.pictos.map(p => `<img src="${p.enlace}" alt="">`).join('') : ""}
                                    </div>
                                </div>
                            </div>
                        </a>`;
                    });
                } else {
                    codigo = `<div class="col-12 text-center"><p class="texto-diario">El diario no tiene entradas este mes.</p></div>`;
                }

                $("#consultaDiario").fadeOut(300, function () {
                    $(this).html(codigo);
                    setTimeout(function() {
                        ajustarAlturas();
                        $("#consultaDiario").fadeIn(300);
                    }, 500);
                });
            }
        });
    }

    function ajustarAlturas() {
        let maxHeight = Math.max($(".list-dia").outerHeight(), $(".list-contenido").outerHeight());
        $(".list-dia, .list-contenido").css('min-height', maxHeight);
    }

    function debounce(funcion, time) {
        let timer;
        return function () {
            const context = this, args = arguments;
            clearTimeout(timer);
            timer = setTimeout(() => funcion.apply(context, args), time);
        };
    }

    function diasPasados(fecha) {
        const hoy = new Date();
        const f = new Date(fecha);
        return Math.floor((hoy - f) / (1000 * 60 * 60 * 24));
    }

    function textoDias(dias) {
        if (dias === 0) return "Hoy";
        if (dias === 1) return "Hace 1 día";
        return `Hace ${dias} días`;
    }
});