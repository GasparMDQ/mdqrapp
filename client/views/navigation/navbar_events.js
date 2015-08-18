if (Meteor.isClient) {
    Template.navbarLogged.events({
        'click #exitLnk' : function () {
            Meteor.logout();
        }
    });
}
