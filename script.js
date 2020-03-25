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

Date.prototype.toDateInputValue = (function() {
  var local = new Date(this);
  local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
  return local.toJSON().slice(0,10);
});




$(function() {

  // CAPTCHA CHECK
  /*grecaptcha.ready(function () {
      grecaptcha.execute('6Ldn9eEUAAAAAMEIXFZuFopEl_esncpZgLEvE89p', { action: 'contact' }).then(function (token) {
        console.log(token);          
      });
  });*/

  $('#fait-le').val(new Date().toDateInputValue());

  var nowHour = new Date().toLocaleTimeString('fr', { hour12: false, 
    hour: "numeric", 
    minute: "numeric"});
  
    $('#fait-heure').val(nowHour);
  
  var checkForm = function(email){
    if($('#nomprenom').val() == undefined ||$('#nomprenom').val() == ""){
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Il semblerait que vous avez oubliez de renseigner votre nom et prénom'
      });return false;
    }else if($('#nee').val() == undefined ||$('#nee').val() == ""){
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Il semblerait que vous avez oubliez de renseigner votre date de naissance'
      });return false;
    }else if($('#demeurant1').val() == undefined ||$('#demeurant1').val() == ""){
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Il semblerait que vous avez oubliez de renseigner votre adresse'
      });return false;
    }else if($('#lieuNaissance').val() == undefined ||$('#lieuNaissance').val() == ""){
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Il semblerait que vous avez oubliez de renseigner votre lieu de naissance'
      });return false;
    }else if($('input[name=raison]:checked').val() == undefined || $('input[name=raison]:checked').val() == ""){
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Il semblerait que vous avez oubliez de renseigner votre motif de déplacement'
      });return false;
    }else if($('#fait-a').val() == undefined || $('#fait-a').val() == ""){
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Il semblerait que vous avez oubliez de renseigner l\'encart "fait à"'
      });return false;
    }else if(($('#fait-le').val() == undefined || $('#fait-le').val() == "")){
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Il semblerait que vous avez oubliez de renseigner le champ fait-le'
      });return false;
    }else if(($('#fait-heure').val() == undefined || $('#fait-heure').val() == "")){
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Il semblerait que vous avez oubliez de renseigner l\'heure de votre sortie'
      });return false;
    }else if(($('#email').val() == undefined || $('#email').val() == "") && email){
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Il semblerait que vous avez oubliez de renseigner votre adresse email pour recevoir l\'attestation'
      });return false;
    }
    return true;
  }

  $.extend({
      redirectPost: function(location, args)
      {
          var form = '';
          $.each( args, function( key, value ) {
              value = String(value);
              value = value.split('"').join('\"')
              form += '<input type="hidden" name="'+key+'" value="'+value+'">';
          });
          $('<form target="_blank" action="' + location + '" method="POST">' + form + '</form>').appendTo($(document.body)).submit();
      }
  });

  $('#telecharger').click(function(){
    if(checkForm(false)){

      //DATE
      const date = new Date($('#fait-le').val());
      const dateFormat = new Intl.DateTimeFormat('fr').format(date);

      // HEURE
      var faitHeure = $('#fait-heure').val();
      faitHeure = faitHeure.replace(":", "h");

      var datas = {
        name: $('#nomprenom').val(),
        birth: $('#nee').val(),
        address1: $('#demeurant1').val(),
        birthcity: $('#lieuNaissance').val(),
        choice: parseInt($('input[name=raison]:checked').val()),
        city: $('#fait-a').val(),
        signature: document.getElementById('signature-pad').toDataURL(),
        email: $('#email').val(),
        date: dateFormat,
        hour: faitHeure,
        download: "yes"
      }

      $.redirectPost("https://api.attestation-sortie-covid19.fr/generate", datas);
  
    }
  });

  // READY
  $('#submit').click(function(){

    if(!$('#submit').prop('disabled')){

      if(checkForm(true)){

        //DATE
        const date = new Date($('#fait-le').val());
        const dateFormat = new Intl.DateTimeFormat('fr').format(date);

        // HEURE
        var faitHeure = $('#fait-heure').val();
        faitHeure = faitHeure.replace(":", "h");

        var datas = {
          name: $('#nomprenom').val(),
          birth: $('#nee').val(),
          address1: $('#demeurant1').val(),
          birthcity: $('#lieuNaissance').val(),
          choice: parseInt($('input[name=raison]:checked').val()),
          city: $('#fait-a').val(),
          signature: document.getElementById('signature-pad').toDataURL(),
          email: $('#email').val(),
          date: dateFormat,
          hour: faitHeure
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
    

    $('#imprimer').click(function(){
      window.print();

    });

  });


 
});