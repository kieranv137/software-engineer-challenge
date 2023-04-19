const express = require("express");
const router = express.Router();
const { defaultError } = require("../errors");
const moment = require('moment');
const { TNXServices, elasticSearchTNXServices } = require("../services");
const {sprintf} = require("sprintf-js");
router
    .post("/request5", async (req, res, next) => {
        const {date} = req.body;
        try{
            if(!date){
                throw new Error('date is required');
            }
            const es = new elasticSearchTNXServices({
                index: process.env.ES_INDEX
            });
            const duration = {
                start: moment(sprintf('%s 00:00:00', date)).unix(),
                end: moment(sprintf('%s 23:59:59', date)).unix(),
            }
            const esResult = await es.search({
                duration
            });
            if(!esResult.total){
                res.send(null);
                return;
            }
            let result = {};
            for(var i in esResult.item){
                if(result[esResult.item[i].username]){
                    result[esResult.item[i].username].totalPoint += esResult.item[i].point;
                }else{
                    result[esResult.item[i].username] = {
                        username: esResult.item[i].username,
                        totalPoint: esResult.item[i].point
                    }
                }
            }
            result = Object.values(result);
            res.send(result);
        }catch{
            res.send(ex.message);
        }
        
    })

module.exports = router;