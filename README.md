A. How to run this test
	1. After download this resource, install package via cmd: npm install
	2. Run app via cmd: node app.js
	3. Check .env to see which PORT in running
B. I made 5 restfull api for 5 request, you can import postman json file to test it. The postman json is include in this resource at location tmpData/postman/test.postman_collection.
	I also capture the screen of each request in postman in there.
	All request is located at routers/index.js
C. Explain for each request
	As the requirement, there are 50 million TNX objects. When think more about big data and optimize search speed, I decide to use ELASTIC SEARCH instead of database

	Request 1: with function generate 50 million TNX objects, I think that it can not use 1 request to generate 50 million objects. My solution is apply PAGINATION idea (instead of use 1 request for generate 50 million object, I use 500 request and each request generate 100,000 object)
	The function of each request is same just only different is page args.
	Ex: 
		when send request with args page = 1. I calculate to import the object from 1 to 100,000
		when send request with args page = 2. I calculate to import the object from 100,001 to 200,000
		limit = 100000
		offset = (page - 1)*limit
		etc...
		With requirement sort asc by timestamp, I make an an algorithm getDurationPerPage that generate startDate, endDate by increase 2 days continuously and use it to generate ts.
		Why 2days? Just thought that from 2019-2021. 3years: 365*3 = 1095 days. So with 500 pages, each page is generate ts between 1095/500 ~ 2days.

	Request2: simple, no need explain
	Request3: simple, no need explain
	Request4: Also thinking about big data, can not group by username and response all in 1 request. I still apply PAGINATION to response limit 20 username per page.
	The list username for pagination is reused by the list for check no more 200 unique username in request 1
	Request3: simple, no need explain
