# PythiaCS

this repo serves as backend for training the prediction algorithm.

# Setup

1. To start, make sure you are at the directory folder do `npm install` for setup installations
2. Then, start the backend services -> make sure you are at the directory folder and run command `node index.js` in terminal (you can also use `nodemon index.js` for easier usage)

# API endpoints:

```js
`http://localhost:1400/api/upcomingMatch`; // parses data from https://www.hltv.org/matches

`http://localhost:1400/api/pastMatches`; // parses data from https://www.hltv.org/results

`http://localhost:1400/api/pastMatches/${teamName}`; // parses same as above but with team name filter

`http://localhost:1400/api/teamMapStats`      // get team map stats, request body outlined below.
    red.body = {
        map: "mirage",
        team: "navi"    
    }

`http://localhost:1400/api/getMapIdFromMatch/${matchId}`; // get map ids from a given match id (in progress).
```

## TODOs;

implement team map stats endpoint
implement match map stats endpoint
implement player stats endpoint
