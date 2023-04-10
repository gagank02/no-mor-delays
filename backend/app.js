var express = require('express')
var bodyParser = require('body-parser');
var mysql = require('mysql2');
const path = require('path');


var connection = mysql.createPool({
                host: '34.28.67.54',
                user: 'root', 
                password: 'root@123',  // confirm this??
                database: 'cs411teamflannel:us-central1:teamflannelproject'
});

var app = express();

// ejs view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(__dirname + '../public'));

app.get('/airports/IATA', function(req, res) {
	var sql = 'SELECT IATACode FROM Airports';
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

app.listen(5001, function () {
    console.log('Node app is running on port 5001');
});