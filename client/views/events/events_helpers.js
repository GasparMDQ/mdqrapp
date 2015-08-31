if (Meteor.isClient) {
    var eventosUsuario = function(usr){
        var data = [];
        for(var i=0;i<usr.eventos.length; i++){
            data.push(usr.eventos[i]._id);
        }
        return data;
    };

    Template.eventList.helpers({
        userLogged: function () {
            return Meteor.user();
        },

    });
}
