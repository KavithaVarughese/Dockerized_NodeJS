var express = require("express");
var bodyParser = require("body-parser");

var app = express();
var urlencodedParser = bodyParser.urlencoded({extended: false});

var handlebars = require("express-handlebars");
app.engine("handlebars", handlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');


/* set up sql connection */
var mysql = require("mysql");
var connection = mysql.createConnection({
    host            : process.env.DATABASE_HOST,
    port            : process.env.MYSQL_PORT,
    user            : process.env.MYSQL_USER,
    password        : process.env.MYSQL_PASSWORD,
    database        : process.env.MYSQL_DATABASE
});

/* throw an error if sql connect fails. it should fail a couple times in docker 
 before successfully connecting. the container takes longer to boot up, essentially.
 */
connection.connect(function(err){
	if(err){
		console.error("error connecting: " + err.stack);
		return process.exit(22); //consistently exit so the Docker container will restart until it connects to the sql db
	}
	console.log("connected as id " + connection.threadId);
});


/* -------------------------------------- */
/* Get routes below */

app.get('/', function(req, res){
	
	var q = 'SELECT * from announce';

	connection.query(q, function(error, results, fields){
		if(error) throw error;
		console.log("rendering home page . . .");
		res.render('home', {
			title: "Traffic Generator Home Page",
			results: results,
		});
	});
});

app.get('/announce', function(req, res){
	var announceQuery = 'SELECT * from announce';
	
	connection.query(announceQuery, function(error, results, fields){
		if(error) throw error;
		console.log("rendering characters page . . .");

		res.render('announce', {
			title: "Announcement",
			results: results
		});
	});
});

/* -------------------------------------- */
/* Post routes below */


app.post('/announce', urlencodedParser,function(req, res){
	console.log("adding a character with the following details below: ");
	console.log(req.body);		//midware urlencodedParser is doing this
	var announceExists = 'select * from announce where serv_name = ? and serv_type = ? and `desc` = ? and ipv4 = ? and ipv6 = ? and host = ? and mac = ? and ttl = ?';
	var checks = [req.body.serv_name, req.body.serv_type, req.body.desc, req.body.ipv4, req.body.ipv6, req.body.host, req.body.mac, 4500];

	connection.query(announceExists, checks, function(error, result, fields){
		if (error) throw error;
		if (result.length == 0){
			
			console.log("Test"+result.length+"and"+result);
			
			var addannounce = 'insert into announce (serv_name, serv_type, `desc`, ipv4, ipv6, host, mac, ttl) VALUES (?, ?, ?, ?, ?, ?, ?, 4500)';
			var inserts = [req.body.serv_name, req.body.serv_type, req.body.desc, req.body.ipv4, req.body.ipv6, req.body.host, req.body.mac];
			
			connection.query(addannounce, inserts, function(error, results, fields){
				if (error) throw error;
				
				res.redirect('announce');	
			});
		}
		else
			res.redirect('announce');
	});	
});

/* Port and listening info below */
/* might want to set up argv for easily changing the port */
var port = 3257;

app.listen(port, function(){
	console.log("app listening on port: " + port);
});
