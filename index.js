var express = require('express');
var app = express();
var Client = require('instagram-private-api').V1;
var device = new Client.Device('tk.thilagaraj');
var storage = new Client.CookieFileStorage(__dirname + '/cookies/tk.thilagaraj.json');

var _ = require('underscore');
var Promise = require('bluebird');
app.set('port', (process.env.PORT || 5000));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.get('/search/user/:q', function(request, response) {
	var session = new Client.Session(device, storage);
	var feed = new Client.Account.search(session, request.params.q);	
	feed.then(function(results) {			
		var searchList=_.map(results,function(list){
			return list._params;
		});
		response.send(searchList);
	})
});
app.get('/user/media/:userid', function(request, response) {
		
	var session = new Client.Session(device, storage);		
	var feed = new Client.Feed.UserMedia(session, request.params.userid);
	feed.get().then(function(results) {			
		var searchList=_.map(results,function(list){
			return list._params;
		});
		new Client.Account.getById(session, request.params.userid)
		  .then(function(account) {
			var accountParams=account._params;
			response.send({"postList":searchList,"userInfo":accountParams});
		  })
		
	})
});
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
  


