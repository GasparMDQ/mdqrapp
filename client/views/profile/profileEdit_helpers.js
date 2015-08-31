if (Meteor.isClient) {
    Template.profileEdit.helpers({
        perfil: function () {
            return Meteor.user().profile;
        }
    });
}
