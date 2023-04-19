const express = require("express");
const router = express.Router();

const { defaultError } = require("../errors");
//const { constants, stripeConstants } = require("../../utils");
const moment = require('moment');
const { TNXServices, elasticSearchTNXServices } = require("../services");

router
    .post("/request1", async (req, res, next) => {
        try{
            const es = new elasticSearchTNXServices({
                index: process.env.ES_INDEX
            });
            const update = await es.updateTNX();
            res.send('done');
        }catch(ex){
            
        }
        
    })

module.exports = router;