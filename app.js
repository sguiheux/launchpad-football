const Launchpad = require('launchpad-mini'),
    pad = new Launchpad();
const char =
    require('../launchpad-mini-scroll');

var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

var team1 = '';
var team2 = '';

var apiMode = 0;
pad.connect().then(() => {
    pad.reset(0);

    setInterval(function () {
        let result = callAPI(apiMode);
        if (result === null) {
            return;
        }
        switch(apiMode) {
            case 1:
                processWorldCup(pad, JSON.parse(result));
                break;
            default:
                processApifootball(pad, JSON.parse(result));
        }
    }, 10000);
});

function callAPI(mode) {
    let url = '';
    switch(mode) {
        case 1:
            url = 'http://worldcup.sfg.io/matches/today';
            break;
        default:
            url = 'http://api.football-data.org/v1/competitions/467/fixtures';
    }
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, false, null, null);
    xhr.send(null);
    if (xhr.status === 200 && xhr.responseText !== null) {
        return xhr.responseText;
    }
    return null;
}

function processWorldCup(pad, result) {
    for (let i=0; i<result.length; i++){
        let r = result[i];
        console.log(r);
        if (r.status !== 'in progress') {
            continue;
        }
        //displayTeam(pad, r.home_team.country + ' vs ' + r.away_team.code);
        if (team1 !== r.home_team.country) {
            team1 = r.home_team.country;
            displayTeam1(pad, team1);
        }
        if (team2 !== r.away_team.country) {
            team2 = r.away_team.country;
            displayTeam2(pad, team2);
        }


        displayScoreTeam1(pad, r.home_team.goals);
        displayScoreTeam2(pad, r.away_team.goals);
    }
}

function processApifootball(pad, result) {
    let matchs = result.fixtures;
    for (let i=0; i<matchs.length; i++){
        let r = matchs[i];
        if (r.status !== 'IN_PLAY') {
            continue;
        }

        //displayTeam(pad, r.home_team.country + ' vs ' + r.away_team.code);
        if (team1 !== r.homeTeamName) {
            team1 = r.homeTeamName;
            displayTeam1(pad, team1);
        }
        if (team2 !== r.awayTeamName) {
            team2 = r.awayTeamName;
            displayTeam2(pad, team2);
        }


        displayScoreTeam1(pad, r.result.goalsHomeTeam);
        displayScoreTeam2(pad, r.result.goalsAwayTeam);

    }
}

function displayTeam1(pad, text) {
    char.displayZone1(pad, text, pad.green.full, 500, -1);
}

function displayTeam2(pad, text) {
    char.displayZone2(pad, text, pad.red.full, 500, -1);
}

function displayScoreTeam1(pad, score) {
    if (score > 7) {
        score = 7;
    }
    for(let i=0; i<score; i++) {
        pad.col(pad.green.full, [i, 8]);
    }
}
function displayScoreTeam2(pad, score) {
    if (score > 7) {
        score = 7;
    }
    for(let i=0; i<score; i++) {
        pad.col(pad.red.full, [8, i]);
    }
}



