Meteor.subscribe('userData');

Tracker.autorun(function(){
    Meteor.subscribe('allUsersData', Meteor.user());
});

Tracker.autorun(function(){
    //Al pasar el usuario y no el ID, se resuscribe cada vez que se modifica el mismo
    //Posible problema de performance!!
    Meteor.subscribe('events', Meteor.user());
});

Tracker.autorun(function(){
    Meteor.subscribe('roomsAndBuses', Session.get('event-id'), Meteor.user());
});

Tracker.autorun(function(){
    Meteor.subscribe('rowsAndSeats', Session.get('event-id'), Meteor.user());
});
