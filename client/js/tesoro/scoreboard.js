if (Meteor.isClient) {
  var getEquipo = function (teamId){
    if(teamId){
      var team = Equipos.findOne({
        'busquedaId' : Session.get('busqueda-active'),
        '_id' : teamId
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

  var getPuntaje = function (equipo){
    var puntaje = 0;
    if(equipo.dnf){ return -1; }

    for(var i = 0; i<equipo.respuestas.length;i++){
      if(getPreguntaCorrecta(equipo, i+1)){ //Se pasa idx +1 porque la funcion usa el indice legible
        puntaje++;
      }
    }
    puntaje+=equipo.bonus;
    return puntaje;
  };

  var getTotalTiempo = function (equipo){
    if(moment && equipo && equipo.respuestas.length>0){
      if(equipo.dnf){
        return 'DNF';
      }
      var horaInicio = moment(equipo.routeBegin-(equipo.handicap*60000));
      var horaRespuesta;
      if('routeEnd' in equipo && equipo.routeEnd){
        horaRespuesta = moment(equipo.routeEnd);
      } else {
        horaRespuesta = moment(equipo.respuestas[equipo.respuestas.length-1].timeStamp);
      }

      return horaRespuesta.subtract(horaInicio).format('HH:mm:ss');
    }
    return 'xx:xx:xx';
  };

  var getTotalTiempoInt = function (equipo){
    if(equipo && equipo.respuestas.length>0){
      if(equipo.dnf){
        return new Date().getTime();
      }
      if('routeEnd' in equipo && equipo.routeEnd){
        return equipo.routeEnd - equipo.routeBegin;
      } else {
        return equipo.respuestas[equipo.respuestas.length-1].timeStamp - equipo.routeBegin;
      }
    }
    return null;
  };

  var getPreguntaCorrecta = function(equipo, idxPregunta){
    var ruta = getRoute(equipo.routeId);
    if(ruta && equipo && equipo.respuestas.length>=idxPregunta){
      var pregunta = getNode(ruta.nodos[idxPregunta-1]);
      if (pregunta){
        if(
          equipo.respuestas[idxPregunta-1].respuesta >= pregunta.answer - pregunta.lowOffset
          && equipo.respuestas[idxPregunta-1].respuesta <= pregunta.answer + pregunta.highOffset
        ){
          return true;
        }
      }
    }
    return false;
  };


  Template.tesoroScoreBoard.helpers({
    totalPreguntas : function (parent) {
      var cantidad = 16; //@todo Parametrizar dentro de la búsqueda
      var response = [];
      //console.log(parent);
      for (var i=0;i<cantidad;i++){
        response.push(i+1);
      }
      return response;
    },

    equipos : function () {
      var equipos = Equipos.find({'pago': true}).fetch();
      for (var i=0; i<equipos.length; i++){
        equipos[i].puntaje = getPuntaje(equipos[i]);
        equipos[i].tiempoTotal = getTotalTiempo(equipos[i]);
        equipos[i].tiempoTotalInt = getTotalTiempoInt(equipos[i]);
      }

      equipos.sort(function (a,b){
        if(parseInt(a.puntaje,10) == parseInt(b.puntaje,10)) {
          //En caso de similar puntaje, devuelve primero el equipo con menor tiempo
          return parseInt(a.tiempoTotalInt,10) - parseInt(b.tiempoTotalInt,10);
        } else {
          //Devuelve primero los equipos de mayor puntaje
          return parseInt(b.puntaje,10) - parseInt(a.puntaje,10);
        }
      });
      return equipos;
    },

    preguntaEstado : function (equipo, idxPregunta) {
      if (equipo && equipo.respuestas.length>=idxPregunta){
        var response = getPreguntaCorrecta(equipo, idxPregunta);
        if(response){
          return 'success';
        } else {
          return 'danger';
        }
      }
      return '';
    },

    preguntaIdSobre : function (equipo, idxPregunta) {
      var ruta = getRoute(equipo.routeId);
      if(ruta){
        var pregunta = getNode(ruta.nodos[idxPregunta-1]);
        if (pregunta){
          return pregunta.id;
        }
      }
      return 'sin ruta';
    },

    preguntaRespuesta : function (equipo, idxPregunta) {
      if(equipo && equipo.respuestas.length>=idxPregunta){
        return equipo.respuestas[idxPregunta-1].respuesta;
      }
      return '--';
    },

    preguntaTiempo : function (equipo, idxPregunta) {
      if(moment && equipo && equipo.respuestas.length>=idxPregunta){
        var horaInicio = moment(equipo.routeBegin);
        var horaRespuesta = moment(equipo.respuestas[idxPregunta-1].timeStamp);

        return horaRespuesta.subtract(horaInicio).format('HH:mm:ss');
      }
      return 'xx:xx:xx';
    },

  });
};