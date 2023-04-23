const {defaultError} = require("../errors");
const {sprintf} = require("sprintf-js");
const moment = require('moment');
const path = require('path');
const fs = require('fs');
const Chart = require('chart.js/auto');
const { createCanvas } = require('canvas');

class chartServices {
	createLineChart(worldRecordData, width, height){
		const canvas = createCanvas(width, height);
  		const ctx = canvas.getContext('2d');
  		let xData = [], yData = [], listAthleteName = {};
  		if(worldRecordData){
  			for(var i in worldRecordData){
  				yData.push(worldRecordData[i].height);
  				xData.push(worldRecordData[i].year);
  				listAthleteName[sprintf('%s-%s', worldRecordData[i].year, worldRecordData[i].height)] = worldRecordData[i].athlete;
  				//listAthleteName[]
  			}
  		}
  		const data = {
			labels: xData,
			datasets: [
				{
					label: 'World record',
					data: yData,
					pointBackgroundColor: 'red',
					pointBorderColor: 'black',
					pointRadius: 5,
					pointLabelFont: {
					  family: 'Arial',
					  size: 20,
					  weight: 'bold',
					  color: 'black'
					}
				}
			]
		};
		var pointLabelPlugin = {
		    id: 'pointLabel',
		    afterDatasetsDraw: function(chart) {
		        var ctx = chart.ctx;
		        chart.data.datasets.forEach(function(dataset, datasetIndex) {
		            var meta = chart.getDatasetMeta(datasetIndex);
		            meta.data.forEach(function(point, index) {
		                var value = dataset.data[index];
		                const athleteKey = sprintf('%s-%s', chart.data.labels[index], value);
		                console.log("athleteKey", athleteKey)
		                var x = point.x;
		                var y = point.y - 10;
		                ctx.fillStyle = 'black';
		                ctx.font = '12px Arial';
		                ctx.fillText(listAthleteName[athleteKey], x, y);
		            });
		        });
		    }
		};
		Chart.register(pointLabelPlugin);
		// create chart options
		const options = {
			plugins: {
				legend: {
				  position: 'top',
				},
			}
		};
		const chart = new Chart(ctx, {
			type: 'line',
			data: data,
			options: options,
		});
		return canvas;
	}

}

module.exports = chartServices;	