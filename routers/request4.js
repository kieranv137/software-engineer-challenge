const express = require("express");
const router = express.Router();
const { defaultError } = require("../errors");
const moment = require('moment');
const { TNXServices, elasticSearchTNXServices } = require("../services");

/*
    Calculate total points, group by username is not difficult.
    But the difficult is currently the data is so heavy with 50 milions record
    So My idea is reuse the list for check no more 200 unique username.
    With this list we can apply pagination for response data (limit the number of username per request).
    Now I will limit 20 username per request, then loop search by username and calculate point for each username. 
    You can use "page" parameter to get data of next page 
*/
router
    .post("/request4", async (req, res, next) => {
        try{
            const {page} = req.body;
            const limit = 20;
            const offset = (page - 1) * limit;
            const startPosition = offset, endPosition = offset + limit;

            const TNXSv = new TNXServices();
            let listUsername = await TNXSv.getLimitUsername();
            listUsername = listUsername ? Object.keys(listUsername).map((key) => key) : [];
            const numUser = listUsername ? listUsername.length : 0;
            const totalPage = Math.ceil(numUser/limit);
            const pagination = {
                totalPage, 
                currentPage: page, 
                totalItem: numUser
            };
            if(!numUser){
                res.send({data: null, pagination});
                return;
            }
            const listItem = listUsername.slice(startPosition, endPosition);
            if(!listItem.length){
                res.send({data: null, pagination});
                return;
            }

            const es = new elasticSearchTNXServices({
                index: process.env.ES_INDEX
            });
            let esResult = {}, result = [], username = '', totalPoint = 0;
            for(var i in listItem){
                username = listItem[i];
                esResult = await es.search({
                    username
                });
                if(!esResult.total){
                    continue;
                }
                for(var j in esResult.item){
                    totalPoint += esResult.item[j].point;
                }
                result.push({
                    username,
                    totalPoint
                })
            }
            res.send({data: result, pagination});
        }catch(ex){
            res.send(ex.message);
        }
        
    })

module.exports = router;