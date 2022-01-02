const { HLTV } = require('hltv')
const SHLTV = require('hltv-api').default
const axios = require('axios')
const cheerio = require('cheerio')
const {mapDict} = require('../Dictionaries/maps.dict')
const {teamDict} = require('../Dictionaries/teams.dict')

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

const getMapIdFromMatchId = async (req, res) => {
    try {
        const { id } = req.params
        const { data } = await axios.get(`https://www.hltv.org/matches/${id}/_`)
        const $ = cheerio.load(data);
        const links = $('.flexbox-column')
        let mapIds = [];
        links.find('a').each((i, elem) => {
            console.log(elem);
            if (elem) {
                mapIds.push($(elem).attr('href').split('/')[4])
            }
        })
        res.status(200).send(mapIds);
    } catch (error) {
        console.log(error)
        res.status(500).send("Error fetching match stats.");
    }
}

const getMapStatsFromMapId = async (req, res) => {
    try {
        const { id } = req.params
        const { data } = await axios.get(`https://www.hltv.org/stats/matches/mapstatsid/${id}/_`)
        const $ = cheerio.load(data);
        const highlights = $('.match-info-box');


        let result = {
            team1: {
                name: highlights.find('.team-left').find('a').text(),
                result: highlights.find('.team-left').find('div').text()
            },
            team2: {
                name: highlights.find('.team-right').find('a').text(),
                result: highlights.find('.team-right').find('div').text()
            },
            map: highlights.text().split('\n')[2]
        };

        const statTable = $('.stats-table')
        const table = []
        statTable.each((i, elem) => {
            const playerRow = $(elem).find('tbody').find('tr');
            teamArr = [];
            playerRow.each((index, elem) => {
                const statPlayer = $(elem).find('.st-player').find('a');
                const player = {
                    name: $(statPlayer).text(),
                    id: $(statPlayer).attr('href').split('/')[3],
                    kills: $(elem).find('.st-kills').text(),
                    assists: $(elem).find('.st-assists').text(),
                    deaths: $(elem).find('.st-deaths').text(),
                    kdratio: $(elem).find('.st-kdratio').text(),
                    adr: $(elem).find('.st-adr').text(),
                    fkdiff: $(elem).find('.st-fkdiff').text(),
                    rating: $(elem).find('.st-rating').text(),
                }
                teamArr.push(player);
            })
            table.push({
                name: $(elem).find('.st-teamname').text(),
                teamArr
            })
        })

        let statsTable = {
            result,
            table
        }

        res.status(200).send(statsTable);
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
    getMapIdFromMatchId,
    getMapStatsFromMapId

}

