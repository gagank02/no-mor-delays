var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql2');
var path = require('path');
var connection = mysql.createConnection({
                host: '34.28.67.54',
                user: 'root',
                password: 'flannel',
                database: 'full'
});
var cors = require('cors');

connection.connect;


var app = express();

// set up ejs view engine 
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
 
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '../public'));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

/* GET home page, respond by rendering index.ejs */
app.get('/', function(req, res) {
  res.render('index', { title: 'Mark Attendance' });
});

app.get('/success', function(req, res) {
      res.send({'message': 'Attendance marked successfully!'});
});
 
// this code is executed when a user clicks the form submit button
app.post('/mark', function(req, res) {
  var netid = req.body.netid;
   
  var sql = `INSERT INTO attendance (netid, present) VALUES ('${netid}',1)`;

console.log(sql);
  connection.query(sql, function(err, result) {
    if (err) {
      res.send(err)
      return;
    }
    res.redirect('/success');
  });
});

app.get('/airports', function(req, res) {
	var sql = 'SELECT * FROM Airports';
	console.log(sql);
	connection.query(sql, function(err, result) {
		if (err) {
			res.send(err);
			return;
		}
		if (result[0] != null) {
			console.log('Found Airport Data');
			console.log(result);
			res.json({'success': true, 'result': result})
		} else {
			console.log('No Data Found');
			res.json({'success': false, 'result': 'No Data was found!'})
		}
	});
});

app.listen(80, function () {
    console.log('Node app is running on port 80');
});
