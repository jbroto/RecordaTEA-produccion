$(document).ready(function(){

    ajustarAlturas();

    sessionStorage.setItem("mes", $("#mes").val());

    $('#consultaMes').on('click', function(e){
        e.preventDefault();
        sessionStorage.setItem("recup", true);
        window.location.href = $(this).attr("href"); 
    });
});