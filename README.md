A. How to run this test

	1. After download this resource, install package via cmd: npm install
	
	2. Run app via cmd: node app.js
	
	3. Check .env to see which PORT in running
	
B. I made a get route exportChart to process the requirement, it located at routes/index.js

The format restfull api is: [domain name]/exportChart

Ex: https://devapi.teefi.io/khanh/exportChart

C. How to do: I divide 2 step

	Step 1: get data from wiki page and customize for line chart data
	
	Step 2: Build line chart data depend on customize data and response as image

D. Result: I also capture my result and put it in location tmpData/postman.
