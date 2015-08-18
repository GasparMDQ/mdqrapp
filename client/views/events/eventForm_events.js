if (Meteor.isClient) {
    Template.eventForm.events({
        'click .js-event-active-toggle': function (e) {
            var data = $(e.currentTarget).data('toggle');
            var response;
            if (data){
                response = Meteor.call('unSetActiveEvent', Session.get('edit-event'), Meteor.user(), function (error, result){
                    if (error) { alert(error.message); }
                });
            } else {
                response = Meteor.call('setActiveEvent', Session.get('edit-event'), Meteor.user(), function (error, result){
                    if (error) { alert(error.message); }
                });
            }
        },
        
        'click .js-event-register-toggle': function (e) {
            var data = $(e.currentTarget).data('toggle');
            if (data){
                var response = Meteor.call('unSetRegisterEvent', Session.get('edit-event'), Meteor.user(), function (error, result){
                    if (error) { alert(error.message); }
                });
            } else {
                var response = Meteor.call('setRegisterEvent', Session.get('edit-event'), Meteor.user(), function (error, result){
                    if (error) { alert(error.message); }
                });
            }
        },
        'click .js-event-chismografo-toggle': function (e) {
            var data = $(e.currentTarget).data('toggle');
            if (data){
                var response = Meteor.call('unSetChismeEvent', Session.get('edit-event'), Meteor.user(), function (error, result){
                    if (error) { alert(error.message); }
                });
            } else {
                var response = Meteor.call('setChismeEvent', Session.get('edit-event'), Meteor.user(), function (error, result){
                    if (error) { alert(error.message); }
                });
            }
        },

});
}
