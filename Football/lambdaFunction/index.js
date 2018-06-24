var https = require('https')

exports.handler = (event, context) => {

  try {

    if (event.session.new) {
      // New Session
      console.log("NEW SESSION")
    }

    switch (event.request.type) {

      case "LaunchRequest":
        // Launch Request
        console.log(`LAUNCH REQUEST`)
        break;

      case "IntentRequest":
        // Intent Request
        console.log(`INTENT REQUEST`)

        switch(event.request.intent.name) {
          case "getMatchesToday":
            /*var endpoint = "https://worldcup.sfg.io/matches/today" // ENDPOINT GOES HERE
            var body = ""

            https.get(endpoint, (response) => {
              response.on('data', (chunk) => { body += chunk })
              response.on('end', () => {
                var data = JSON.parse(body)
                var there = 'No';
                 for(var i=0; i<data.length; i++){
                    if(data[i].home_team_country==team || data[i].away_team_country==team){
                        there = 'Yes';
                      }
                    }

                 context.succeed( generateResponse( buildSpeechletResponse(there, true),{}) )
              })
            })*/
            context.succeed( generateResponse( buildSpeechletResponse("Today's matches are, England v Panama at 5 AM, Japan v Senegal at 8 AM, and Poland v Columbia at 11 AM", true),{}) )
            break;
          case "getMatchesTomorrow":
            /*
            var endpoint = "https://worldcup.sfg.io/matches/tomorrow" // ENDPOINT GOES HERE
            var body = ""

            https.get(endpoint, (response) => {
              response.on('data', (chunk) => { body += chunk })
              response.on('end', () => {
                var data = JSON.parse(body)
                var there = 'No';
                 for(var i=0; i<data.length; i++){
                    if(data[i].home_team_country==team || data[i].away_team_country==team){
                        there = 'Yes';
                      }
                    }

                 context.succeed( generateResponse( buildSpeechletResponse(there, true),{}) )
              })
            })*/
            context.succeed( generateResponse( buildSpeechletResponse("Tomorrow's matches are, Saudi Arabia v Egypt at 7 AM, Uruguay v Russia at 7 AM, Iran v Portugal at 11 AM, and Spain v Morocco at 11 AM", true),{}) )
            break;


          default:
            throw "Invalid intent"
        }

        break;

      case "SessionEndedRequest":
        // Session Ended Request
        console.log(`SESSION ENDED REQUEST`)
        break;

      default:
        context.fail(`INVALID REQUEST TYPE: ${event.request.type}`)

    }

  } catch(error) { context.fail(`Exception: ${error}`) }

}

// Helpers
buildSpeechletResponse = (outputText, shouldEndSession) => {

  return {
    outputSpeech: {
      type: "PlainText",
      text: outputText
    },
    shouldEndSession: shouldEndSession
  }

}

generateResponse = (speechletResponse, sessionAttributes) => {

  return {
    version: "1.0",
    sessionAttributes: sessionAttributes,
    response: speechletResponse
  }

}