//ID para test: 252191314929944
//GET URL: /<ID>?fields=admins.fields(id),attending.fields(id),owner,id,name,description,updated_time,start_time,end_time

//URL PARA OBTENER LOS EVENTOS FUTUROS DEL USUARIO
///<ID_USUARIO>/events?field=admins,name,owner,id&type=attending

Eventos = new Meteor.Collection('events');

/* This also works!
Eventos = new Meteor.Collection('events', {
  idGeneration:"MONGO"
});
*/
