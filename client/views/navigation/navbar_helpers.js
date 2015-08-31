if (Meteor.isClient) {
    Template.navbarLogged.helpers({
        pic: function () {
            if(Meteor.user().profile) {
                return Meteor.user().profile.picture;
            }
        }
    });
}
