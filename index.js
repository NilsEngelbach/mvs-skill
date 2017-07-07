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

app.pre = function(request, response, type) {
  if (request.applicationId != "amzn1.ask.skill.43cdc88b-cff1-4cd3-840c-6872b9557566") {
    // fail ungracefully
    return response.fail("Invalid applicationId");
  }
};

alexaApp.launch(function(request, response) {
  response.say("You launched the app!");
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
  function(request, response) {
    response.say("Die nächste Veranstaltung ist:");
  }
);

app.listen(PORT, () => console.log("Listening on port " + PORT + "."));