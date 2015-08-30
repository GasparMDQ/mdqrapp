if (Meteor.isClient) {
    Template.paxEdit.events({
        'click .js-pago-toggle': function (e) {
            Meteor.call('togglePagoUser', this, function (error, result){
                if (error) { alert(error.message); }
            });
        },
    });

}
