if (Meteor.isClient) {
    Template.eventPaxList.helpers({
        hasPax: function () {
            return Meteor.users.find({'eventos': this._id}).count() > 0;
        },
        pax: function () {
            return Meteor.users.find({'eventos': this._id}, {sort: { 'profile.name': 1}});
        }
    });
}
