var express = require('express');
var app = express();
var Client = require('instagram-private-api').V1;
var device = new Client.Device('tk.thilagaraj');
var storage = new Client.CookieFileStorage(__dirname + '/cookies/tk.thilagaraj.json');

var _ = require('underscore');
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
app.get('/user/media/:userid/:cursor', function(request, response) {
		
	var session = new Client.Session(device, storage);		
	var feed = new Client.Feed.UserMedia(session, request.params.userid);
	if(request.params.cursor!==null){
		feed.setCursor(request.params.cursor);
	}
	feed.get().then(function(results) {			
		var searchList=_.map(results,function(list){
			return list._params;
		});
		var configParams={};
		configParams.hasMore=feed.isMoreAvailable();
		configParams.cursor=feed.getCursor();
		new Client.Account.getById(session, request.params.userid)
		  .then(function(account) {
			var accountParams=account._params;
			response.send({"postList":searchList,"userInfo":accountParams,"config":configParams});
		  })
		
	})
});
app.get('/media/:mediaId', function(request, response) {
		
	var session = new Client.Session(device, storage);		
	var feed = new Client.Media.getById(session, request.params.mediaId);
	feed.then(function(results) {
		var commentsList=_.map(results.comments,function(list){
			return {"text":list._params,"userInfo":list.account._params};
		});
		var locationDetails=(results.location ? results.location._params : {});
		response.send({"postInfo":results._params,"location":locationDetails,"userInfo":results.account._params,"comments":commentsList});
	})
});
app.get('/media/comments/:mediaId', function(request, response) {
		
	var session = new Client.Session(device, storage);		
	var feed = new Client.Feed.MediaComments(session, request.params.mediaId);
	feed.get().then(function(results) {
		var commentsList=_.map(results,function(list){
			return {"text":list._params,"userInfo":list.account._params};
		});
		response.send(commentsList);
	})
});
app.get('/search/hastag/:q', function(request, response) {
		
	var session = new Client.Session(device, storage);		
	var feed = new Client.Hashtag.search(session, request.params.q);
	feed.then(function(results) {			
		var searchList=_.map(results,function(list){
			return list._params;
		});
		response.send(searchList);
	}); 
});
app.get('/search/location/:q', function(request, response) {
		
	var session = new Client.Session(device, storage);		
	var feed = new Client.Location.search(session, request.params.q);
	feed.then(function(results) {			
		var searchList=_.map(results,function(list){
			return list._params;
		});
		response.send(searchList);
	}); 
});
app.get('/hashtag/media/:tag/:cursor', function(request, response) {
		
	var session = new Client.Session(device, storage);		
	var feed = new Client.Feed.TaggedMedia(session, request.params.tag);
	if(request.params.cursor!==null){
		feed.setCursor(request.params.cursor);
	}
	feed.get().then(function(results) {		
		var searchList=_.map(results,function(list){
			return {"post":list._params,"userInfo":list.account._params};
		});
		console.log(results);
		var configParams={};
		configParams.hasMore=feed.isMoreAvailable();
		configParams.cursor=feed.getCursor();
		response.send({"postList":searchList,"config":configParams});
		
	})
});
app.get('/location/media/:id/:cursor', function(request, response) {
		
	var session = new Client.Session(device, storage);		
	var feed = new Client.Feed.LocationMedia(session, request.params.id);
	if(request.params.cursor!==null){
		feed.setCursor(request.params.cursor);
	}
	feed.get().then(function(results) {	
		var searchList=_.map(results,function(list){
			return {"post":list._params,"userInfo":list.account._params,"location":list.location._params};
		});
		console.log(results);
		var configParams={};
		configParams.hasMore=feed.isMoreAvailable();
		configParams.cursor=feed.getCursor();
		response.send({"postList":searchList,"config":configParams});
		
	})
});
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
  


