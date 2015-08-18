if (Meteor.isClient) {
    Meteor.methods({
        addNewEvent: function(evento, user){
            if(evento){
                Eventos.insert(evento);
            }
        },
        setActiveEvent: function(eId, user){
          if(eId){
            Eventos.update({ _id: { $ne: eId.toString() }}, { $set: { active: false }}, {multi: true});
            Eventos.update({ _id: eId.toString() }, { $set: { active: true }});
          }
        },

        unSetActiveEvent: function(eId, user){
          if(eId){
            Eventos.update({ _id: eId.toString() }, { $set: { active: false }});
          }
        },

        removeEvent: function(eId, user){
          if(eId){
            Eventos.remove({ _id: eId.toString() });
          }
        },

      
        setRegisterEvent: function(eId, user){
            if(eId){
                Eventos.update({ _id: eId.toString() }, { $set: { registracion: true }});
            }
        },

        unSetRegisterEvent: function(eId, user){
            if(eId){
                Eventos.update({ _id: eId.toString() }, { $set: { registracion: false }});
            }
        },
        setChismeEvent: function(eId, user){
            if(eId){
                Eventos.update({ _id: eId.toString() }, { $set: { chismografo: true }});
            }
        },

        unSetChismeEvent: function(eId, user){
            if(eId){
                Eventos.update({ _id: eId.toString() }, { $set: { chismografo: false }});
            }
        },

    });
}
