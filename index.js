var express = require("express");
var alexa = require("alexa-app");

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
  checkCert: false,

  // sets up a GET route when set to true. This is handy for testing in
  // development, but not recommended for production. disabled by default
  debug: true
});

// now POST calls to /test in express will be handled by the app.request() function

// from here on you can setup any other express routes or middlewares as normal
app.set("view engine", "ejs");

alexaApp.launch(function(request, response) {
  response.say("You launched the app!");
});

alexaApp.intent("GetNextEvent", {
    "utterances": [
      "wann ist die nächste Veranstaltung",
      "wann ist das nächste Konzert",
      "was steht an"
    ]
  },
  function(request, response) {
    response.say("Die nächste Veranstaltung ist:");
  }
);

app.intent("AMAZON.HelpIntent",{
  "slots": {},
  "utterances": []
}, function(request, response) {
  	var helpOutput = "Um die nächste Veranstaltung abzurufen frage einfach 'Musikverein Schwieberdinen was steht an'.";
  	var reprompt = "wie kann ich dir jetzt weiterhelfen?";
  	// AMAZON.HelpIntent must leave session open -> .shouldEndSession(false)
  	response.say(helpOutput).reprompt(reprompt).shouldEndSession(false);
  	return
});

app.intent("AMAZON.StopIntent",{
  "slots": {},
  "utterances": []
}, function(request, response) {
  	var stopOutput = "Wir sehen uns!";
  	response.say(stopOutput)
  	return
});

app.intent("AMAZON.CancelIntent",{
  "slots": {},
  "utterances": []
}, function(request, response) {
  	var cancelOutput = "Vielleicht beim nächsten mal.";
  	response.say(cancelOutput);
  	return
});

app.listen(PORT, () => console.log("Listening on port " + PORT + "."));