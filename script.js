var canvas = document.getElementById('signature-pad');

// Adjust canvas coordinate space taking into account pixel ratio,
// to make it look crisp on mobile devices.
// This also causes canvas to be cleared.
function resizeCanvas() {
    // When zoomed out to less than 100%, for some very strange reason,
    // some browsers report devicePixelRatio as less than 1
    // and only part of the canvas is cleared then.
    var ratio =  Math.max(window.devicePixelRatio || 1, 1);
    canvas.width = canvas.offsetWidth * ratio;
    canvas.height = canvas.offsetHeight * ratio;
    canvas.getContext("2d").scale(ratio, ratio);
}

window.onresize = resizeCanvas;
resizeCanvas();

var signaturePad = new SignaturePad(canvas, {
  backgroundColor: 'rgb(255, 255, 255)' // necessary for saving image as JPEG; can be removed is only saving as PNG or SVG
});

document.getElementById('clear').addEventListener('click', function () {
  signaturePad.clear();
});

document.getElementById('undo').addEventListener('click', function () {
	var data = signaturePad.toData();
  if (data) {
    data.pop(); // remove the last dot or line
    signaturePad.fromData(data);
  }
});



$(function() {

  // READY
  $('#submit').click(function(){

    if(!$('#submit').prop('disabled')){

      if($('#nomprenom').val() == undefined ||$('#nomprenom').val() == ""){
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Il semblerait que vous avez oubliez de renseigner votre nom et prénom'
        })
      }else if($('#nee').val() == undefined ||$('#nee').val() == ""){
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Il semblerait que vous avez oubliez de renseigner votre date de naissance'
        })
      }else if($('#demeurant1').val() == undefined ||$('#demeurant1').val() == ""){
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Il semblerait que vous avez oubliez de renseigner votre adresse'
        })
      }else if($('input[name=raison]:checked').val() == undefined || $('input[name=raison]:checked').val() == ""){
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Il semblerait que vous avez oubliez de renseigner votre motif de déplacement'
        })
      }else if($('#fait-a').val() == undefined || $('#fait-a').val() == ""){
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Il semblerait que vous avez oubliez de renseigner l\'encart "fait à"'
        })
      }else if($('#email').val() == undefined || $('#email').val() == ""){
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Il semblerait que vous avez oubliez de renseigner votre adresse email pour recevoir l\'attestation'
        })
      }else{

        var datas = {
          name: $('#nomprenom').val(),
          birth: $('#nee').val(),
          address1: $('#demeurant1').val(),
          address2: $('#demeurant2').val(),
          address3: $('#demeurant3').val(),
          choice: parseInt($('input[name=raison]:checked').val()),
          city: $('#fait-a').val(),
          signature: document.getElementById('signature-pad').toDataURL(),
          email: $('#email').val()
        }
    
        $('#overlay').show();
  
        $.ajax({
          type: "POST",
          url: "https://api.attestation-sortie-covid19.fr/generate",
          data: datas,
          success: function(data){
            $('#submit').prop('disabled', 'true');
            $('#overlay').hide();
  
            Swal.fire(
              'Attestation envoyée !',
              'Vous allez recevoir votre attestation dans la minute, pensez bien à regarder vos spams!',
              'success'
            );
          },error: function(){
            $('#overlay').hide();
          }
        });
      }


    }
    
  });


});