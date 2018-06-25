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
          case "getMatchesYesterday":
              var yesterday = new Date();
              yesterday = yesterday.subtractHours(7);
              var dd = (yesterday.getDate()-1).toString();
              var mm = (yesterday.getMonth()+1).toString();
              var yyyy = yesterday.getFullYear().toString();
              var url = "https://worldcup.sfg.io/matches?start_date="+yyyy+"-"+mm+"-"+dd+"&end_date="+yyyy+"-"+mm+"-"+dd; 
              var body = "";

              https.get(url, (response) => {

                    response.on('data', (chunk) => { 
                      body += chunk; 
                    })

                    response.on('end', () => {
                       data = JSON.parse(body);
                       context.succeed( generateResponse( buildSpeechletResponse(getYesterdayMatchesFromAPI(data), true),{}) );
                       
              })
            })
            break;
          case "getMatchesToday":
              var today = new Date();
              today = today.subtractHours(7);
              var dd = today.getDate().toString();
              var mm = (today.getMonth()+1).toString();
              var yyyy = today.getFullYear().toString();
              var url = "https://worldcup.sfg.io/matches?start_date="+yyyy+"-"+mm+"-"+dd+"&end_date="+yyyy+"-"+mm+"-"+dd; 
              var body = "";

              https.get(url, (response) => {

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
              var tomorrow = new Date();
              tomorrow = tomorrow.subtractHours(7);
              var dd = (tomorrow.getDate()+1).toString();
              var mm = (tomorrow.getMonth()+1).toString();
              var yyyy = tomorrow.getFullYear().toString();
              var url = "https://worldcup.sfg.io/matches?start_date="+yyyy+"-"+mm+"-"+dd+"&end_date="+yyyy+"-"+mm+"-"+dd; 
              var body = "";

              https.get(url, (response) => {

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

function getYesterdayMatchesFromAPI(data){

  var matchData = [];
  var result  = "Yesterday's matches were, ";

   for(var i=0; i<data.length; i++){
    matchData.push([data[i].away_team_country, data[i].home_team_country, 
          (Number(data[i].datetime.split('T')[1].split(':00Z')[0].split(":")[0])-7).toString()+" AM"]);
   }
 
   for(var i=0; i<matchData.length-1; i++){
    result+=matchData[i][0]+" v "+matchData[i][1]+" at "+matchData[i][2]+", ";
   }
   result+="and "+matchData[matchData.length-1][0]+" v "+matchData[matchData.length-1][1]+" at "+matchData[matchData.length-1][2];

   return result;        
}

function getTodayMatchesFromAPI(data){

  var matchData = [];
  var result  = "Today's matches are, ";

   for(var i=0; i<data.length; i++){
    matchData.push([data[i].away_team_country, data[i].home_team_country, 
          (Number(data[i].datetime.split('T')[1].split(':00Z')[0].split(":")[0])-7).toString()+" AM"]);
   }
  
   for(var i=0; i<matchData.length-1; i++){
    result+=matchData[i][0]+" v "+matchData[i][1]+" at "+matchData[i][2]+", ";
   }
   result+="and "+matchData[matchData.length-1][0]+" v "+matchData[matchData.length-1][1]+" at "+matchData[matchData.length-1][2];

   return result;        
}


function getTomorrowMatchesFromAPI(data){

  var matchData = [];
  var result  = "Tomorrow's matches are, ";


   for(var i=0; i<data.length; i++){
    matchData.push([data[i].away_team_country, data[i].home_team_country, 
          (Number(data[i].datetime.split('T')[1].split(':00Z')[0].split(":")[0])-7).toString()+" AM"]);
   }
   
   for(var i=0; i<matchData.length-1; i++){
    result+=matchData[i][0]+" v "+matchData[i][1]+" at "+matchData[i][2]+", ";
   }
   result+="and "+matchData[matchData.length-1][0]+" v "+matchData[matchData.length-1][1]+" at "+matchData[matchData.length-1][2];

   return result; 
}

Date.prototype.subtractHours = function(h) {    
   this.setTime(this.getTime() - (h*60*60*1000)); 
   return this;   
}




