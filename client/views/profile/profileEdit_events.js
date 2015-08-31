if (Meteor.isClient) {
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
            };
            $('.js-btn-submit').prop('disabled', true);
            var response = Meteor.call('updateUserProfile',data, function (error, result){
                if (!error) {
                    Router.go("viajesHome");
                } else {
                    console.log(error.message);
                    alert(error.message);
                }
                $('.js-btn-submit').prop('disabled', false);
            });
        }
    });
}
