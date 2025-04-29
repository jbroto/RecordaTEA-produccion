$(document).ready(function () {
    
    $('#contenedorPictogramas, #cardsRutina, #contenedorRegistros, #contenedorRegistrosEdit , #composiciónRutina').sortable({
        // Define los elementos que serán "draggeables"
        items: '.col-lg-2, .col-auto',
        animation: 500,
        ghostClass: 'ghost'
    });

   
})