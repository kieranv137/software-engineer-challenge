const TNXServices = require("./TNXServices");
const {sprintf} = require("sprintf-js");
const moment = require('moment');
const client = require('./elasticSearch/connection.js');
class elasticSearchTNXServices {
	constructor(params) {
        this.index = params.index;
    }

    async createNewIndex(){
        if(!this.index){
            console.log('empty index');
            return false;
        }
        let checkExist = await this.checkExist(this.index);
        if(checkExist){
            await this.deleteIndex(this.index);
        }

        try {
            this.createIndex(this.index);
            return true;
        } catch (ex) {
            console.log('ex >>>>>', ex.message);

            return false;
        }
        return 'DONE!!';
    }

    createIndex(){
        let params = {
            index: this.index,
            body: {
                setting: {
                    number_of_shards: 3,
                    number_of_replicas: 2,
                    index: {
                        mapping: {
                            total_fields: {
                                limit: 3000
                            }
                        }
                    },
                    analysis: {
                        analyzer: {
                            whitespace_lowercase: {
                                tokenizer: 'whitespace',
                                filter: 'lowercase'
                            }
                        }
                    }
                },
                mappings: {
                    properties: {
                        name_noaccent: {
                            type: 'text',
                            analyzer: 'whitespace_lowercase'
                        }
                    }
                }
            }
        };
        try{
            client.indices.create({
                index: this.index
            }, function(err, resp, status){
                if(err){
                    throw new Error(err);
                }
                return true;
            })
        }catch(ex){
            console.log('ex >>>>>>', ex.message);
            return false;
        }
    }

    getDocId(type, id){
        return sprintf('%s%s', type, id);
    }

    async checkExist(){

        let params = {
            index: this.index,
            // client: {
            //     timeout: 0.5,
            //     connection_timeout: 0.5
            // }
        };
        let checkIndexExist = false;
        try{
            checkIndexExist = await client.indices.exists(params);
        }catch(ex){
            console.log('ex >>>', ex.message);
            throw new Error('can not connect')
        }
        return checkIndexExist;
    }

    async deleteIndex(){

        if(!this.index){
            return false;
        }
        let params = {
            index: this.index
        }
        return await client.indices.delete(params);
    }

    async updateTNX(page) {
        if (!this.checkExist(this.index)) {
            throw new Error("Index not exist");
            return false;
        }
        
        let list = await this._getListTNX(page);
        console.log("list", list);
        if(list){
            let timeStart = Date.now();
            console.log(sprintf('Found %s TNX >>>>>', list.length));
            let docId = '';
            let existParams, updateParams = {};
            let checkExistRecord = false;
            let success = 0;
            let item = {};
            for(var i in list){
                item = {
                    ts: list[i].ts,
                    username: list[i].username,
                    point: list[i].point
                };
                
                docId = this.getDocId('tnx_', list[i].ts);
                
                updateParams = {
                    index: this.index,
                    id: docId
                }
                try {
                    existParams = {
                        index: this.index,
                        body: {
                            query: {
                                match: {
                                    _id: docId
                                }
                            }
                        }
                    }
                    checkExistRecord = await client.count(existParams);
                    if(checkExistRecord.count){
                        console.log('do update >>>');
                        updateParams.body = {
                            doc: item
                        };
                        client.update(updateParams);
                        success++;
                        continue;
                    }
                    updateParams.body = item;
                    client.index(updateParams);

                    success++;
                } catch (ex) {
                    console.log("error while update >>>", ex.message);
                    continue;
                }
            }
            console.log(sprintf('Updated %s TNX', success));
            let timeEnd = Date.now();
            let executionTime = (timeEnd - timeStart)/60;
            console.log(sprintf('Total Execution Time: %s Mins', executionTime));
            return true;
        }
        console.log('no TNX found >>>>');
    }

    async _getListTNX(page){
        const TNXSv = new TNXServices();
        const {startDate, endDate} = await TNXSv.getDurationPerPage(page);
        const timestamps = await TNXSv.getRandomTimeByDuration(startDate, endDate);
        const list = await TNXSv.generateTNXObject(timestamps);
        return list;
    }
    async search(data) { 
        if (!this.checkExist(this.index)) {
            throw new Error("Index not exist");
            return false;
        }
        console.log("data", data);
        const {ts, username, duration} = data;
        let offset = data.offset ?? 0;
        let limit = data.$limit ?? 20;
        
        let params = {
            index: this.index,
            body: {
                query: {
                    bool: {
                        should: []
                    }
                },
                _source: true,
                //size: limit,
                from: offset
            }
        }
        params.body.query.bool.should[0] = {
            bool: {
                must: [
                ]
            }
        };
        if(ts){
            let searchByTs = {
                bool: {
                    must: {
                        query_string: {
                            query: ts,
                            type: 'phrase',
                            fields: ['ts'],
                        }
                    }
                }   
            }
            params.body.query.bool.should[0].bool.must.push(searchByTs);
        }else if(username){
            let searchByUsername = {
                bool: {
                    must: {
                        query_string: {
                            query: username,
                            type: 'phrase_prefix',
                            fields: ['username'],
                            //phrase_slop: 10
                        }
                    }
                }   
            }
            params.body.query.bool.should[0].bool.must.push(searchByUsername);
        }else if(duration){
            let searchByDuration = {
                bool: {
                    must: {
                        query_string: {
                            "query": "ts:["+duration.start+" TO "+duration.end+"]",
                            "default_field": "ts"
                        }
                    }
                }   
            }
            params.body.query.bool.should[0].bool.must.push(searchByDuration);
        }else{
            return {
                item: [],
                total: 0,
                totalPage: 0
            }
        }
        let result = {};
        try {
            result = await client.search(params);
        } catch (ex) {
            console.log("es search error >>>>", ex.message);
        }
        let item = this.reFormat(data, result.hits.hits, 'en');
        return {
            item: item,
            total: result.hits.total.value,
            totalPage: Math.ceil(result.hits.total.value / limit)
        }
    }
    reFormat(params, items, lang){
        let formatArr = [];
        let val = {};
        for(var i in items){
            val = items[i]._source;
            formatArr.push(val);
        }
        return formatArr;
    }
}

module.exports = elasticSearchTNXServices;