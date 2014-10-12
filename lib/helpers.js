// Handlebars Global Helpers
UI.registerHelper('formatDate', function (datetime, format) {
  if(datetime){
    var DateFormats = {
           short: "DD/MM/YYYY HH:mm",
           long: "dddd DD.MM.YYYY HH:mm"
    };

    if (moment) {
      f = DateFormats[format];
      return moment(datetime).format(f);
    } else {
      return datetime;
    }
  } else {
    return 'sin información';
  }
});

distanceBetweenNodes = function (node1, node2) {
  var lat1, lon1, lat2, lon2;
  var deg2rad = 0.017453292519943295; // === Math.PI / 180
  var cos = Math.cos;
  lat1 = node1.latitude * deg2rad;
  lon1 = node1.longitude * deg2rad;
  lat2 = node2.latitude * deg2rad;
  lon2 = node2.longitude * deg2rad;
  var a = (
    (1 - cos(lat2 - lat1)) +
    (1 - cos(lon2 - lon1)) * cos(lat1) * cos(lat2)
  ) / 2;

  //Devuelve la distancia entre los dos nodos en Kilometros
  return 12742 * Math.asin(Math.sqrt(a)); // Diameter of the earth in km (2 * 6371)
};

ArrayHasDuplicate = function (arr) {
    var i = arr.length, j, val;

    while (i--) {
      val = arr[i];
      j = i;
      while (j--) {
        if (arr[j] === val) {
          return true;
        }
      }
    }
    return false;
};

//Helpers para el cliente
if (Meteor.isClient) {
  Meteor.setInterval(function () {
    if (moment) {
      Session.set('time', new Date);
      moment.lang('en', {
          relativeTime : {
              future: "en %s",
              past:   "hace %s",
              s:  "segundos",
              m:  "un minuto",
              mm: "%d minutos",
              h:  "una hora",
              hh: "%d horas",
              d:  "un día",
              dd: "%d días",
              M:  "un mes",
              MM: "%d meses",
              y:  "un año",
              yy: "%d años"
          }
      });
    } else {
      Session.set('time', false);
    }
  }, 1000);
}
