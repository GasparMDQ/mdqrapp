if (Meteor.isClient) {
    Template.home.helpers({
        userLogged: function () {
            return Meteor.user();
        }
    });
    Template.homeLogged.helpers({
        greeting: function() {
            if(Meteor.user() && Meteor.user().services && Meteor.user().services.facebook){
                if (Meteor.user().services.facebook.gender == "male") {
                    return "Bienvenido "+Meteor.user().profile.name+"!";
                } else {
                    return "Bienvenida "+Meteor.user().profile.name+"!";
                }
            }
        }
    });
}
