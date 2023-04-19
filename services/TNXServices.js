const {defaultError} = require("../errors");
const {sprintf} = require("sprintf-js");
const moment = require('moment');
const path = require('path');
const fs = require('fs');

class TNXServices {
	constructor(){
		this.fileName = path.join(__dirname, "../tmpData/limitUsername.json");
		this.limitRecord = 20;
		this.dayPerPage = 2;
		this.limitDuplicateUsername = 20;
	}
    async getDurationPerPage(page){
    	const firstDate = '2019-01-01 00:00:00';
    	const startDate = moment(firstDate).add('days', (page - 1)*this.dayPerPage);
    	const endDate = moment(firstDate).add('days', page*this.dayPerPage);
    	return {
    		startDate,
    		endDate
    	}
    }
    async getRandomTimeByDuration(startDate, endDate){
    	const startTimestamp = startDate.unix();
        const endTimestamp = endDate.unix();
        const timestamps = [];
        for (let i = 0; i < this.limitRecord; i++) {
        	const randomTimestamp = Math.floor(Math.random() * (endTimestamp - startTimestamp + 1)) + startTimestamp;
         	timestamps.push(randomTimestamp);
        }
        timestamps.sort((a, b) => a - b);
        return timestamps;
    }
    async generateTNXObject(timestamps){
    	let limitUsername = await this.getLimitUsername();
    	let username = null, point = 0, result = [], checkData = {};
    	timestamps.forEach((timestamp) => {
        	checkData = this.checkLimitUsername(limitUsername);
        	username = checkData.username;
        	limitUsername = checkData.limitUsername;
        	point = this.generatePoint();
        	result.push({
        		ts: timestamp,
        		username,
        		point
        	})
        });
        await this.writeNewLimitUserName(this.fileName, JSON.stringify(limitUsername));
        return result;
    }
    async getLimitUsername(){
    	let result = {};
    	try{
    		result = await fs.readFileSync(
			    this.fileName,
			    "utf8"
			);
			result = result ? JSON.parse(result) : {};

    	}catch(ex){

    	}finally{
    		return result;
    	}
    }
    async writeNewLimitUserName(filename, data){
    	try{
    		await fs.unlink(filename, async(err) => {
    			await fs.writeFile(filename, data, (err) => {

				});
    		});

    	}catch(ex){
    		console.log("ex", ex)
    	}
    }
    generateUsername(){
		const length = Math.floor(Math.random() * 5) + 6;
	  	const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
	    let result = '';
		for (let i = 0; i < length; i++) {
			result += charset.charAt(Math.floor(Math.random() * charset.length));
		}
	  return result;
	}
	generatePoint(){	
		return Math.floor(Math.random() * 61) - 30;
	}
	checkLimitUsername(limitUsername){
		let username = this.generateUsername();
    	if(limitUsername[username]){
    		if(limitUsername[username] >= this.limitDuplicateUsername){
    			const checkData = this.checkLimitUsername(limitUsername);
    			username = checkData.username;
    			limitUsername = checkData.limitUsername;
    		}else{
    			limitUsername[username] += 1;
    		}
    		
    	}else{
    		limitUsername[username] = 1;
    	}

    	return {
    		username,
    		limitUsername
    	};
	}
}

module.exports = TNXServices;	