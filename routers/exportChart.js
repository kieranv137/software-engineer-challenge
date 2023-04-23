const express = require("express");
const router = express.Router();

const { defaultError } = require("../errors");
const moment = require('moment');
const { chartServices, dataServices } = require("../services");
const fs = require('fs');
const path = require('path');



router
    .get("/exportChart", async (req, res, next) => {
    //step 1: get data from url and customize
    const url = 'https://en.wikipedia.org/wiki/Women%27s_high_jump_world_record_progression';
    const dataSv = new dataServices();
    const worldRecordData = await dataSv.get(url);

    //step 2: use customize data to build line chart and res as image
    const chartSv = new chartServices();
    const canvas = chartSv.createLineChart(worldRecordData, 2000, 1500);
    res.set('Content-Type', 'image/png');
    canvas.createPNGStream().pipe(res);
})

module.exports = router;
