if (Meteor.isClient) {
  Template.navbarLogged.pic = function () {
    var userProfile;
    userProfile=Meteor.user().profile;

    if(userProfile) {
      return userProfile.picture;
    }
  };

  Template.navbarLogged.events({
    'click #exitLnk' : function () {
      Meteor.logout();
    }
  });

}