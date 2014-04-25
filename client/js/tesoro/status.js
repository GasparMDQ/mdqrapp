if (Meteor.isClient) {
  var getEquipo = function (user){
    if(user){
      var team = Equipos.findOne({
        'busquedaId' : Session.get('busqueda-active'),
        'pax' : user._id
      });
      return team;
    }
    return false;
  };

  var getRoute = function (routeId){
    if(routeId){
      var route = Routes.findOne({
        '_id' : routeId
      });
      return route;
    }
    return false;
  };

  var getNode = function (nodoId){
    if(nodoId){
      var nodo = Nodos.findOne({
        '_id' : nodoId
      });
      return nodo;
    }
    return false;
  };

  var getPreguntas = function (routeId){
    if(routeId){
      var ruta = getRoute(routeId);
      if(ruta){
        return ruta.nodos;
      }
    }
    return false;
  };

  Template.encabezadoStatus.busqueda = function () {
    return Session.get('busqueda');
  };

  Template.encabezadoStatus.equipo = function () {
    return getEquipo(Meteor.user());
  };

  Template.statusBusqueda.sobre = function () {
    var equipo = getEquipo(Meteor.user());
    if(equipo) {
      if(typeof equipo.routeId != 'undefined' && equipo.routeId != '') {
        var nodeIdx, i;
        var preguntas = getPreguntas(equipo.routeId);
        var respuestas = equipo.respuestas;

        for (i = 0; i < respuestas.length; i++){
          nodeIdx = preguntas.indexOf(respuestas[i].id);
          if(nodeIdx != -1) {
            preguntas.splice(nodeIdx,1);
          }
        }
        var nodo = getNode(preguntas[0]);
        return nodo;
      }
    }
    return '#error#';
  };

  Template.statusBusqueda.porcentajeBusqueda = function () {
    var equipo = getEquipo(Meteor.user());
    if(equipo) {
      if(typeof equipo.routeId != 'undefined' && equipo.routeId != '') {
        var preguntas = getPreguntas(equipo.routeId);
        if(preguntas && preguntas.length!=0){
          return equipo.respuestas.length / preguntas.length * 100;
        }
      }
      
    }
    return '100';
  };

  Template.statusBusqueda.hasStarted = function () {
    var busqueda = Session.get('busqueda');
    if (moment && busqueda) {
      var now = Session.get('time');
      var horaBegin = moment(busqueda.begin, 'YYYY-MM-DDTHH:mm');
      return horaBegin.isBefore(now);
    }
    return false;
  };

  Template.statusBusqueda.respuestasTotal = function () {
    var equipo = getEquipo(Meteor.user());
    if(equipo) {
      return equipo.respuestas.length;
    } else {
      return '0';
    }
  };

  Template.statusBusqueda.preguntasTotal = function () {
    var equipo = getEquipo(Meteor.user());
    if(equipo) {
      if(typeof equipo.routeId != 'undefined' && equipo.routeId != '') {
        var preguntas = getPreguntas(equipo.routeId);
        if(preguntas){
          return preguntas.length;
        }
      }
    } else {
      return '0';
    }
  };

  Template.statusBusqueda.hasRoute = function () {
    var equipo = getEquipo(Meteor.user());
    if(equipo) {
      if(typeof equipo.routeId != 'undefined' && equipo.routeId != '') {
        return true;
      }
    }
    return false;
  };

  Template.statusBusqueda.hasAllAnswersOrTimeUp = function () {
    var equipo = getEquipo(Meteor.user());
    if(equipo) {
      if(typeof equipo.routeId != 'undefined' && equipo.routeId != '') {
        var preguntas = getPreguntas(equipo.routeId);
        if(preguntas){
          return preguntas.length == equipo.respuestas.length;
        }
      }
    }
    return false;
  };

  Template.statusBusqueda.direccionFin = function () {
    var busqueda = Session.get('busqueda');
    if (busqueda) {
      return busqueda.endDescripcion;
    }
    return "#error#";
  };

  Template.statusBusqueda.direccionInicio = function () {
    var busqueda = Session.get('busqueda');
    if (busqueda) {
      return busqueda.initDescripcion;
    }
    return "#error#";
  };

  Template.statusBusqueda.horaComienzo = function () {
    var busqueda = Session.get('busqueda');
    if (moment && busqueda) {
      var now = Session.get('time');
      var horaBegin = moment(busqueda.begin, 'YYYY-MM-DDTHH:mm');
      if(now && horaBegin.isAfter(now)){
        return horaBegin.fromNow();
      } else {
        return '--:--:--';
      }
    }
    return '#error#';
  };

  Template.statusBusqueda.countDown = function () {
    var busqueda = Session.get('busqueda');
    if (moment && busqueda) {
      var now = Session.get('time');
      var horaFin = moment(busqueda.end, 'YYYY-MM-DDTHH:mm');
      if(now && horaFin.isAfter(now)){
        return horaFin.subtract(now).format('HH:mm:ss');
      } else {
        return '--:--:--';
      }
    }
    return '#error#';
  };

  Template.statusBusqueda.hasTimeRemaining = function () {
    var busqueda = Session.get('busqueda');
    if (moment && busqueda) {
      var now = Session.get('time');
      var horaFin = moment(busqueda.end, 'YYYY-MM-DDTHH:mm');
      if(now){
        return horaFin.isAfter(now);
      }
    }
    return false;
  };

  Template.tesoroTeamHistory.respuestas = function () {
    var equipo = getEquipo(Meteor.user());
    if(equipo) {
      return equipo.respuestas;
    } else {
      return null;
    }
  };

  Template.respuestaRow.idPregunta = function (data) {
    var nodo = getNode(data);
    if(nodo){ return nodo.id; }
    return 'no info';
  };
  Template.respuestaRow.usuario = function (data) {
    var usuario = Meteor.users.findOne({_id:data});
    if(usuario && usuario.profile && usuario.profile.name ) { return usuario.profile.name; }
    return 'no info';
  };
  Template.respuestaRow.hora = function (data) {
    if(moment){ return moment(data).format('HH:mm:ss'); }
    return 'no-info';
  };

  Template.statusBusqueda.events({
    'click .js-cargar-ruta' : function (e) {
      var addBtn = $(e.target).closest('div.js-ruta').find('button.js-cargar-ruta').first();
      e.preventDefault();
      addBtn.prop('disabled', true);
      var routeData = {
        id: $('#routeId').val(),
        busquedaId: Session.get('busqueda-active')
      };
      var confirmation = confirm('Esta seguro que desea ingresar la ruta número "'+routeData.id+'"?');
      if (confirmation == true ) {
        var response = Meteor.call('teamSetRoute', getEquipo(Meteor.user())._id, Meteor.user(), routeData, function (error, result){
          if (error) {
            alert(error.message);
          } else {
          }
          addBtn.prop('disabled', false);
        });
        $('#routeId').val('');
      } else {
        addBtn.prop('disabled', false);
      }
    },

    'click .js-cargar-respuesta' : function (e) {
      var addBtn = $(e.target).closest('div.js-respuesta').find('button.js-cargar-respuesta').first();
      e.preventDefault();
      addBtn.prop('disabled', true);
      var answerData = {
        id: $(e.target).closest('div.js-respuesta').attr('data-id'),
        respuesta: parseInt($('#respuestaId').val()),
        user: Meteor.user()._id,
        timeStamp: new Date().getTime(),
      };

      var confirmation = confirm('Esta seguro que desea responder "'+answerData.respuesta+'"?');
      if (confirmation == true ) {
        var response = Meteor.call('teamAddAnswer', getEquipo(Meteor.user())._id, Meteor.user(), answerData, function (error, result){
          if (error) {
            alert(error.reason);
          } else {
          }
          addBtn.prop('disabled', false);
        });
        $('#respuestaId').val('');
      } else {
        addBtn.prop('disabled', false);
      }
    },
  });

}