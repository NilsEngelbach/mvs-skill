var express = require("express");
var rp = require('request-promise');
var alexa = require("alexa-app");
var moment = require('moment');

moment.locale('de');

var PORT = process.env.PORT || 8080;
var app = express();

// ALWAYS setup the alexa app and attach it to express before anything else.
var alexaApp = new alexa.app("mvs");

alexaApp.express({
  expressApp: app,
  //router: express.Router(),

  // verifies requests come from amazon alexa. Must be enabled for production.
  // You can disable this if you're running a dev environment and want to POST
  // things to test behavior. enabled by default.
  checkCert: true,

  // sets up a GET route when set to true. This is handy for testing in
  // development, but not recommended for production. disabled by default
  debug: false
});

// now POST calls to /test in express will be handled by the app.request() function

// from here on you can setup any other express routes or middlewares as normal
app.set("view engine", "ejs");

app.pre = function(request, response, type) {
  if (request.applicationId != "amzn1.ask.skill.43cdc88b-cff1-4cd3-840c-6872b9557566") {
    // fail ungracefully
    return response.fail("Ungültige Application ID");
  }
};

alexaApp.launch(function (request, response) {
  response.say("Herzlich Willkommen beim Musikverein Schwieberdingen. Momentan können wir dir einen Ausblick auf unsere nächsten Veranstaltungen geben. Mit der Fragen 'was steht an?' und 'wann ist die nächste Veranstaltung?' kannst du die Abfrage starten. Weitere Funktionen werden nach und nach nachgerüstet. Viel Spaß!");
});

alexaApp.sessionEnded(function(request, response) {
  // cleanup the user's server-side session
  logout(request.userId);
  // no response required
});

alexaApp.intent("GetNextEvent", {
  "utterances": [
    "wann ist die nächste Veranstaltung",
    "wann findet die nächste Veranstaltung statt",
    "wann ist das nächste Konzert",
    "wann findet das nächste Konzert statt",
    "wann das nächste Konzert ist",
    "wann die nächste Veranstaltung ist",
    "wann findet das nächste Event statt",
    "was steht an"
  ]
},
  function (request, response) {
    return rp("http://mv-schwieberdingen.de/wp-json/events/v1/next")
      .then(function (events) {
        var event = JSON.parse(events)[0];
        var time = moment(event.EventStartDate, 'YYYY-MM-DD HH:mm:ss'); // 2017-07-08 09:30:00
        response.say("Die nächste Veranstaltung ist '" +  event.post_title + "'. Sie findet am " + time.format('dddd') + ', ' + time.format('LL') + " statt.");
      })
      .catch(function (err) {
        // API call failed...
        response.say("Es tut uns leid, die Veranstaltungen konnten nicht abgerufen werden.");
      });
  }
);

app.listen(PORT, () => console.log("Listening on port " + PORT + "."));