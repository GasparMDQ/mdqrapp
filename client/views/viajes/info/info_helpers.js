if (Meteor.isClient) {
    Template.eventInfo.helpers({ 
        evento: function(){
             return Session.get('event-active');
        }
    });
}
