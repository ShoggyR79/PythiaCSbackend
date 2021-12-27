const express = require("express");
const { getPastResults, getUpcomingMatches, getPastResultsByTeam, getMapStatsByTeam, getMatch } = require("../controllers/hltv.controllers");

const hltvRouter = express.Router();

hltvRouter.get("/upcomingMatch", getUpcomingMatches)

hltvRouter.get("/pastMatches/:teamName", getPastResultsByTeam)

hltvRouter.get("/pastMatches", getPastResults)

hltvRouter.get("/teamMapStats", getMapStatsByTeam)

// hltvRouter.get("/matchStats/:matchId", getMatch)
module.exports = {
    hltvRouter
}