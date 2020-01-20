const express = require("express");
const config = require('dotenv').config();
const rp = require("request-promise");
const alexa = require("alexa-app");
const moment = require("moment");

moment.locale("de");

const PORT = process.env.PORT || 8080;
const app = express();

const alexaApp = new alexa.app("mvs-skill");

alexaApp.express({
  expressApp: app,

  // Verifies requests come from amazon alexa. Must be enabled for production.
  // You can disable this if you're running a dev environment and want to POST
  // things to test behavior. enabled by default.
  checkCert: !process.env.development,

  // Sets up a GET route when set to true. This is handy for testing in
  // development, but not recommended for production. disabled by default
  debug: process.env.development
});

app.set("view engine", "ejs");

app.pre = function(request, response, type) {
  if (!process.env.skillId || request.applicationId != process.env.skillId) {
    // Fail ungracefully
    return response.fail("Ungültige Application ID");
  }
};

alexaApp.launch(function(request, response) {
  respons
    .say(
      "Herzlich Willkommen beim Musikverein Schwieberdingen. Momentan können wir dir einen Ausblick auf unsere nächsten Veranstaltungen geben. Mit den Fragen Was steht an und Wann ist die nächste Veranstaltung kannst du die Abfrage starten. Weitere Funktionen werden mit der Zeit nachgerüstet. Viel Spaß!"
    )
    .shouldEndSession(false);
});

alexaApp.sessionEnded(function(request, response) {
  // Cleanup the user's server-side session
  logout(request.userId);
  // No response required
});

alexaApp.intent(
  "GetNextEvent",
  {
    utterances: [
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
    // Alternative URI: "https://mv-schwieberdingen.de/wp-json/events/v1/next"
    return rp("https://mv-schwieberdingen.de/wp-json/tribe/events/v1/events")
      .then(function(data) {
        let jsonData = JSON.parse(data);
        if (jsonData.events) {
          const event = jsonData.events[0];
          let answer = "Die nächste Veranstaltung ist " + event.title + ". ";

          if (event.start_date) {
            let time = moment(event.start_date, "YYYY-MM-DD HH:mm:ss"); // 2017-07-08 09:30:00
            answer =
              answer +
              "Sie findet am " +
              time.format("dddd") +
              ", " +
              time.format("LL") +
              " statt. ";
          }

          if (event.venue && event.venue.venue && event.venue.city) {
            answer =
              answer +
              "Wir sehen uns dann in " +
              event.venue.city +
              " - " +
              event.venue.venue +
              ". #bockstark";
          }

          response.say(answer);

          response.card({
            type: "Standard",
            title: event.title,
            content: answer,
            image: {
              smallImageUrl: event.image.sizes.thumbnail.url,
              largeImageUrl: event.image.sizes.large.url
            }
          });

        } else {
          response.say(
            "Es tut uns leid, die Veranstaltungen konnten nicht abgerufen werden."
          );
        }
      })
      .catch(function(err) {
        // API call failed...
        response.say(
          "Es tut uns leid, die Veranstaltungen konnten nicht abgerufen werden."
        );
      });
  }
);

alexaApp.intent(
  "AMAZON.HelpIntent",
  {
    slots: {},
    utterances: []
  },
  function(request, response) {
    const helpOutput =
      "Momentan können wir dir einen Ausblick auf unsere nächsten Veranstaltungen geben. Mit den Fragen Was steht an und Wann ist die nächste Veranstaltung kannst du die Abfrage starten. Weitere Funktionen werden mit der Zeit nachgerüstet. Mit den Befehlen Abbrechen und Stopp kannst du die Ansage beenden.";
    const reprompt = "Also, wie können wir dir helfen?";
    response
      .say(helpOutput)
      .reprompt(reprompt)
      .shouldEndSession(false);
    return;
  }
);

alexaApp.intent(
  "AMAZON.StopIntent",
  {
    slots: {},
    utterances: []
  },
  function(request, response) {
    const stopOutput = "Musikalische Grüße vom MVS. Wir sehen uns, bis bald!";
    response.say(stopOutput);
    return;
  }
);

alexaApp.intent(
  "AMAZON.CancelIntent",
  {
    slots: {},
    utterances: []
  },
  function(request, response) {
    const cancelOutput = "Musikalische Grüße vom MVS. Tschau ge`!";
    response.say(cancelOutput);
    return;
  }
);

app.listen(PORT, () => console.log("Listening on port " + PORT + "."));
