const { HLTV } = require('hltv')
const SHLTV = require('hltv-api').default
const axios = require('axios')
const cheerio = require('cheerio')

// get upcoming matches
const getUpcomingMatches = async (req, res) => {
    const matches = await HLTV.getMatches();
    res.status(200).send(matches);
}

// send back past month games
const getPastResults = async (req, res) => {
    try {
        // const results = await SHLTV.getResults()
        const results = await SHLTV.getResults()
        res.status(200).send(results);
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: "getPastResults ran into an error", error });
    }

}

// get past results base on team name
const getPastResultsByTeam = async (req, res) => {
    let { teamName } = req.params;
    teamName = teamName.toLowerCase()
    try {
        let results = await SHLTV.getResults()
        results = results.filter(match => {
            return (match.teams[0].name.toLowerCase() == teamName || match.teams[1].name.toLowerCase() == teamName)
        })
        res.status(200).send(results);
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: "getPastResultsByTeam ran into an error", error });
    }
}

const getMapStatsByTeam = async (req, res) => {
    try {
        const { map, team } = req.body;
        const { data } = await axios.get(`https://www.hltv.org/stats/teams/map/${mapDict[map]}/${teamDict[team]}?startDate=2021-09-23&endDate=2021-12-23`)
        const $ = cheerio.load(data)
        const stats = $(".stats-rows")
        let statsArr = [];
        let isFirst = true
        stats.find('span').each((i, elem) => {
            attr = $(elem).text()
            if (!isFirst) {
                statsArr.push(attr);
                console.log(attr)
            }
            isFirst = !isFirst
        })
        const gameChangers = $(".large-strong")
        gameChangers.each((i, elem) => {
            statsArr.push($(elem).text());
        })
        const result = {
            team,
            map,
            timesPlayed: statsArr[0],
            winsDrawLoss: statsArr[1],
            totalPlayed: statsArr[2],
            totalWon: statsArr[3],
            winPercent: statsArr[4],
            pistolRounds: statsArr[5],
            pistolWon: statsArr[6],
            pistolWinPercent: statsArr[7],
            ctWinPercent: statsArr[8],
            tWinPercent: statsArr[9],
            winAfterFirstKill: statsArr[10],
            winAfterFirstDeath: statsArr[11]
        }

        res.status(200).send(result)

    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
}

const getMapStats = async (req, res) => {
    try {
        const result = await HLTV.getMatchMapStats({ id: req.params.id });
        res.status(200).send(result);
    } catch (error) {
        console.log(error)
        res.status(500).send("Error fetching match stats.");
    }

}

const getMapIdFromMatchId = async (req, res) => {
    try {
        const result = await SHLTV.getMatchById(req.params.matchId);
        res.status(200).send(result);
    } catch (error) {
        console.log(error)
        res.status(500).send("Error fetching match stats.");
    }

}

module.exports = {
    getUpcomingMatches,
    getPastResults,
    getPastResultsByTeam,
    getMapStatsByTeam,
    
}

