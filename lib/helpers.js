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

arrayUnique = function (array) {
    var a = array.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i] === a[j])
                a.splice(j--, 1);
        }
    }

    return a;
};

//Helpers para el cliente
if (Meteor.isClient) {
  // Meteor.setInterval(function () {
  //   if (moment) {
  //     Session.set('time', new Date);
  //     moment.locale('en', {
  //         relativeTime : {
  //             future: "en %s",
  //             past:   "hace %s",
  //             s:  "segundos",
  //             m:  "un minuto",
  //             mm: "%d minutos",
  //             h:  "una hora",
  //             hh: "%d horas",
  //             d:  "un día",
  //             dd: "%d días",
  //             M:  "un mes",
  //             MM: "%d meses",
  //             y:  "un año",
  //             yy: "%d años"
  //         }
  //     });
  //   } else {
  //     Session.set('time', false);
  //   }
  // }, 1000);
}
