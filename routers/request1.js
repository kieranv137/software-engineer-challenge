const express = require("express");
const router = express.Router();

const { defaultError } = require("../errors");
//const { constants, stripeConstants } = require("../../utils");
const moment = require('moment');
const { TNXServices, elasticSearchTNXServices } = require("../services");

router
    .post("/request1", async (req, res, next) => {
        let {page} = req.body;
        try{
            page = page ? page : 1;
            const es = new elasticSearchTNXServices({
                index: process.env.ES_INDEX
            });
            const update = await es.updateTNX(page);
            res.send('done');
        }catch(ex){
            
        }
        
    })

module.exports = router;