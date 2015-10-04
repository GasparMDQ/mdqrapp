if (Meteor.isClient) {

    Template.rowOptions.events({
        'click .js-row-action' : function (e) {
            e.preventDefault();
            switch (e.target.getAttribute('data-value')) {
                case 'P':
                    element = {'val': 'P'};
                    break;
                case 'B':
                    element = {'val': 'B'};
                    break;
                case 'E':
                    element = {'val': 'E'};
                    break;
                case 'C':
                    element = {'val': 'C'};
                    break;
                case 'A':
                    element = {'val': 'A', 'pax': ''};
                    break;
                case 'clear':
                    element = false;
                    break;
                default:
                    element = false;
            }
            if(element){
                Meteor.call('addElement', this._id, Meteor.user(), element, function (error, result){
                    if (error) {
                        alert(error.message);
                    }
                });
            } else {
                Meteor.call('clearElements', this._id, Meteor.user(), function (error, result){
                    if (error) {
                        alert(error.message);
                    }
                });
            }

        },

        'click .js-remove-row-bus' : function (e) {
            e.preventDefault();
            var confirmation = confirm('Desea eliminar esta fila?');
            if (confirmation === true ) {
                var response = Meteor.call('removeRow', this._id, Meteor.user(), function (error, result){
                    if (error) {
                        alert(error.message);
                    }
                });
            }

        },
    });
    Template.rowShow.events({
        'click .element': function (e) {
            e.preventDefault();
            // console.log(this);
            // console.log(Session.get('edit-event'));
            if(Iron.controller().route.getName() === 'busesList' && 'pax' in this){ // No esta editando evento y es asiento
                if (this.pax === '' || this.pax === Meteor.user()._id ){ //el lugar esta vacio o es propio
                    var result = Rows.find({"elements.pax": Meteor.user()._id, "eventId": Session.get('event-id')}).fetch();
                    if(result.length !== 0 ) {
                        Meteor.call('seatCheckOut', Session.get('event-id'), Meteor.user(), function (error, result){
                            if (error) {
                                alert(error.message);
                            }
                        });
                    }
                    if (this.pax === '') {
                        Meteor.call('seatCheckIn', this, Meteor.user(), function (error, result){
                            if (error) {
                                alert(error.message);
                            }
                        });
                    }
                }
            }
        }
    });



}
