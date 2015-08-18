if (Meteor.isClient) {

  Template.profileEdit.perfil = function () {
    return Meteor.user().profile;
  };

  Template.profileEdit.events({
    'submit form' : function (e) {
      e.preventDefault();
      //Use Call to execute insert on server side after
      //checking data complete
      var data = {
        id: Meteor.user()._id,
        nombre: $('#inpNom').val(),
        apellido: $('#inpApe').val(),
        documento: $('#inpDoc').val(),
        telefono: $('#inpTel').val(),
        telefonoEmergencia: $('#inpTelEm').val(),
        obraSocial: $('#inpOS').val()
      }
      var response = Meteor.call('updateUserProfile',data, function (error, result){
        if (!error) {
          Router.go("home");
        } else {
          console.log(error.message);
          alert(error.message);
        }
      });
    }
  });
}

if (Meteor.isServer) {
}