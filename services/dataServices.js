const {defaultError} = require("../errors");
const {sprintf} = require("sprintf-js");
const moment = require('moment');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');

class dataServices {
	async get(url){
		let result = [];
		try{
			const response = await axios.get(url);
		    const $ = cheerio.load(response.data);
		    const tableData = [];
		    $('table.wikitable tr').each((i, elem) => {
				const rowData = [];
				$(elem).find('td').each((j, cell) => {
					rowData.push($(cell).text().trim());
				});
				if (rowData.length > 0) {
					tableData.push(rowData);
				}
		    });
		    if(tableData && tableData.length){
		    	let height = '', year = '', athlete = '';
		    	for(var i in tableData){
		    		height = tableData[i][0].split(' ')[0];
		    		height = parseFloat(height);
		    		year = moment(tableData[i][2]).format('YYYY');
		    		athlete = tableData[i][1];
		    		result.push({
		    			height,
		    			year,
		    			athlete
		    		});
		    	}
		    }
		}catch(ex){
			console.log(ex.message);
		}finally{
			return result;
		}
		

	}
}

module.exports = dataServices;	