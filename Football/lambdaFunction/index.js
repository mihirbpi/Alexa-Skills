var https = require('https');

exports.handler = (event, context) => {

  try {

    if (event.session.new) {
      // New Session
      console.log("NEW SESSION");
    }

    switch (event.request.type) {

      case "LaunchRequest":
        // Launch Request
        console.log(`LAUNCH REQUEST`);
        break;

      case "IntentRequest":
        // Intent Request
        console.log(`INTENT REQUEST`);

        switch(event.request.intent.name) {
          case "getMatchesToday":
              var today = new Date();
              var dd = today.getDate().toString();
              var mm = (today.getMonth()+1).toString();
              var yy = today.getFullYear().toString();
              var endpoint = "https://worldcup.sfg.io/matches?start_date="+yy+"-"+mm+"-"+dd+"&end_date="+yy+"-"+mm+"-"+dd; 
              var body = "";

              https.get(endpoint, (response) => {

                    response.on('data', (chunk) => { 
                      body += chunk; 
                    })

                    response.on('end', () => {
                       data = JSON.parse(body);
                       context.succeed( generateResponse( buildSpeechletResponse(getTodayMatchesFromAPI(data), true),{}) );
                       
              })
            })
            break;
          case "getMatchesTomorrow":
              var today = new Date();
              var dd = (today.getDate()+1).toString();
              var mm = (today.getMonth()+1).toString();
              var yy = today.getFullYear().toString();
              var endpoint = "https://worldcup.sfg.io/matches?start_date="+yy+"-"+mm+"-"+dd+"&end_date="+yy+"-"+mm+"-"+dd; 
              var body = "";

              https.get(endpoint, (response) => {

                    response.on('data', (chunk) => { 
                      body += chunk; 
                    })

                    response.on('end', () => {
                       data = JSON.parse(body);
                       context.succeed( generateResponse( buildSpeechletResponse(getTomorrowMatchesFromAPI(data), true),{}) );
                       
              })
            })
            break;


          default:
            context.succeed( generateResponse( buildSpeechletResponse("Prakash please stop asking me silly questions", true),{}) );
            throw "Invalid intent"
        }

        break;

      case "SessionEndedRequest":
        // Session Ended Request
        console.log(`SESSION ENDED REQUEST`);
        break;

      default:
        context.fail( `INVALID REQUEST TYPE: ${event.request.type}` );

    }

  } catch(error) { context.fail(`Exception: ${error}`); }

}

// Helpers
buildSpeechletResponse = (outputText, shouldEndSession) => {

  return {
    outputSpeech: {
      type: "PlainText",
      text: outputText
    },
    shouldEndSession: shouldEndSession
  };

}

generateResponse = (speechletResponse, sessionAttributes) => {

  return {
    version: "1.0",
    sessionAttributes: sessionAttributes,
    response: speechletResponse
  };

}

function getTodayMatchesFromAPI(data){

  var versus = [];
  var result  = "Today's matches are, ";

   for(var i=0; i<data.length; i++){
    versus.push([data[i].away_team_country, data[i].home_team_country, 
          (Number(data[i].datetime.split('T')[1].split(':00Z')[0].split(":")[0])-7).toString()+" AM"]);
   }
   console.log(versus);
   for(var i=0; i<versus.length-1; i++){
    result+=versus[i][0]+" v "+versus[i][1]+" at "+versus[i][2]+", ";
   }
   result+="and "+versus[versus.length-1][0]+" v "+versus[versus.length-1][1]+" at "+versus[versus.length-1][2];

   return result;        
}


function getTomorrowMatchesFromAPI(data){

  var versus = [];
  var result  = "Tomorrow's matches are, ";


   for(var i=0; i<data.length; i++){
    versus.push([data[i].away_team_country, data[i].home_team_country, 
          (Number(data[i].datetime.split('T')[1].split(':00Z')[0].split(":")[0])-7).toString()+" AM"]);
   }
   console.log(versus);
   for(var i=0; i<versus.length-1; i++){
    result+=versus[i][0]+" v "+versus[i][1]+" at "+versus[i][2]+", ";
   }
   result+="and "+versus[versus.length-1][0]+" v "+versus[versus.length-1][1]+" at "+versus[versus.length-1][2];

   return result; 
}




