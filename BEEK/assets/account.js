$('form#create_customer').submit(function(e) {
  if ( $('#CreatePassword').val() !== $('#CreatePasswordConfirm').val()) {
    document.getElementById('password-match').classList.remove("hide");
    e.preventDefault(); // stops our form from submitting
  } 
  $('form#create_customer').reset();
});
