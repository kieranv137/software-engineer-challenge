const express = require("express");
const router = express.Router();
const { defaultError } = require("../errors");
const moment = require('moment');
const { TNXServices, elasticSearchTNXServices } = require("../services");

router
    .post("/request3", async (req, res, next) => {
        const {username} = req.body;
        try{
            if(!username){
                throw new Error('username is required');
            }
            const es = new elasticSearchTNXServices({
                index: process.env.ES_INDEX
            });
            const result = await es.search({
                username
            });
            if(!result.total){
                res.send(null);
                return;
            }
            let totalPoint = 0;
            for(var i in result.item){
                totalPoint += result.item[i].point;
            }
            res.send({totalPoint: totalPoint});
        }catch(ex){
            res.send(ex.message);
        }
        
    })

module.exports = router;