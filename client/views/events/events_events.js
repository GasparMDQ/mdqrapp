if (Meteor.isClient) {
    Template.eventList.events({
        'click .js-set-active' : function (e) {
            e.preventDefault();
            var response = Meteor.call('setActiveEvent', $(e.target).closest('div.js-evento').data('event'), Meteor.user(), function (error, result){
                if (error) {
                    alert(error.message);
                }
            });

        },
        'click .js-event-remove' : function (e) {
            e.preventDefault();
            var confirmation = confirm('Desea eliminar este evento?');
            if (confirmation === true ) {
                var response = Meteor.call('removeEvent', $(e.target).closest('div.js-evento').data('event'), Meteor.user(), function (error, result){
                    if (error) {
                        alert(error.message);
                    }
                });
            }
        },
        'click .js-set-deactive' : function (e) {
            e.preventDefault();
            var response = Meteor.call('unSetActiveEvent', $(e.target).closest('div.js-evento').data('event'), Meteor.user(), function (error, result){
                if (error) {
                    alert(error.message);
                }
            });
        }
    });

}
