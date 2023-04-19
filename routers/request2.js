const express = require("express");
const router = express.Router();
const { defaultError } = require("../errors");
const moment = require('moment');
const { TNXServices, elasticSearchTNXServices } = require("../services");

router
    .post("/request2", async (req, res, next) => {
        const {ts} = req.body;
        try{
            if(!ts){
                throw new Error('ts is required');
            }
            const es = new elasticSearchTNXServices({
                index: process.env.ES_INDEX
            });
            const result = await es.search({
                ts
            });
            if(!result.total){
                res.send(null);
                return;
            }
            res.send(result.item[0]);
        }catch(ex){
            res.send(ex.message);
        }
        
    })

module.exports = router;