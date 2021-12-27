const express = require("express");
const app = express()
const cors = require('cors');
const { hltvRouter } = require("./routers/hltv.routers");

app.use(cors());
app.use(express.json())

app.use("/api", hltvRouter)

const port = 1400;
app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})
