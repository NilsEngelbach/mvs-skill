# Alexa Skill for [Musikverein Schwieberdingen](https://mv-schwieberdingen.de)

> Alexa frage "Musikverein Schwieberdingen" was steht an?

> Alexa frage "Musikverein Schwieberdingen" wann ist die nächste Veranstaltung?


The website of Musikverein Schwieberdingen provides an REST API to fetch the next events (concerts etc.).  
This skill queries this REST API and provides the next event/concert to the user via an convenient amazon alexa skill.

The skill is using the [alexa-app](https://github.com/alexa-js/alexa-app) module with Express.

## Configuration

Create `.env` file with amazon skill id and optional development flag:
```
skillId=<amazon-skill-id>
development=true
```

## Deploy/develop locally

Make sure you have [Node.js](http://nodejs.org/) installed.

```sh
git clone https://github.com/NilsEngelbach/mvs-skill.git
cd mvs-skill
npm install
npm start # or `npm start-dev` for server with file watcher
```

Your app should now be running on *[http://localhost:8080](http://localhost:8080)*.
You can access a test page to verify if the basic setup is working fine: *[http://localhost:8080/mvs-skill](http://localhost:8080/mvs-skill)*.
