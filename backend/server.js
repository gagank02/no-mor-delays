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

/* endpoints for page 1 */
app.get('/airports', function(req, res) {
	var sql = 'SELECT * FROM Airports;';
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

app.get('/delays', function(req, res) {
	var sql = `SELECT * FROM Delays WHERE OriginAirportIATACode=${req.body.org} AND DestinationAirportIATACode=${req.body.dest} SORT BY Data DESC;`;
	console.log(sql);
	connection.query(sql, function(err, result) {
		if (err) {
			res.send(err);
			return;
		}
		if (result[0] != null) {
			console.log('Found Delay Data');
			console.log(result);
			res.json({'success': true, 'result': result})
		} else {
			console.log('No Delays Between These Airports Found');
			res.json({'success': false, 'result': 'No Delays Between These Airports Found!'})
		}
	});
});

app.put('/delays', function(req, res) {
  var sql = `UPDATE Delays SET IsCanceled=${req.body.iscanceled} WHERE FlightNum=${req.body.flightnum} AND Date=${req.body.date} AND ScheduledDepartureTime=${req.body.depttime} AND OriginAirportIATACode=${req.body.org} AND DestinationAirportIATACode=${req.body.dest};`;
	console.log(sql);
	connection.query(sql, function(err, result) {
		if (err) {
			res.send(err);
			return;
		}
		if (result[0] != null) {
			console.log('Succesfully Updated Delay Status');
			console.log(result);
			res.json({'success': true, 'result': result})
		} else {
			console.log('Could Not Update Delays Status');
			res.json({'success': false, 'result': 'Could Not Update Delays Status!'})
		}
	});
});

app.delete('/delays', function(req, res) {
  var sql = `DELETE FROM Delays WHERE FlightNum=${req.body.flightnum} AND Date=${req.body.date} AND ScheduledDepartureTime=${req.body.depttime} AND OriginAirportIATACode=${req.body.org} AND DestinationAirportIATACode=${req.body.dest};`;
	console.log(sql);
	connection.query(sql, function(err, result) {
		if (err) {
			res.send(err);
			return;
		}
		if (result[0] != null) {
			console.log('Succesfully Deleted Delay');
			console.log(result);
			res.json({'success': true, 'result': result})
		} else {
			console.log('Could Not Delete Delay');
			res.json({'success': false, 'result': 'Could Not Delete Delay!'})
		}
	});
});

/* endpoints for page 2 - advanced queries */
app.get('/adv1', function (req, res) {
  var sql = `SELECT d.AirlineIATA, a.Airline, AVG(d.DepartureDelay) AS avgDepartureDelay
  FROM Delays d JOIN Airlines a ON (d.AirlineIATA = a.IATACode)
  WHERE d.IsCanceled LIKE 0
  GROUP BY d.AirlineIATA
  ORDER BY avgDepartureDelay DESC
  LIMIT 15;`

  console.log(sql);
  connection.query(sql, function(err, result) {
      if (err) {
          res.send(err)
          return;
      }
      
      if (result[0] != null) {
          console.log('Found Advanced Query 1 Data');
          console.log(result);
          res.json({'success': true, 'result': result});
      } else {
          console.log('No Data Found for AQ1');
          res.json({'success': false, 'result': 'No Data was found!'})
      }
  })
});

app.get('/adv2', function (req, res) {
  var PlayerName = req.query.name;

  var sql = `SELECT r.AirlineIATA, a.Airline, COUNT(*) AS FlightCount
  FROM FlightPath p 
      JOIN FlightRoutes r ON (p.FlightNumber = r.FlightNumber) 
      JOIN Airlines a ON (r.AirlineIATA = a.IATACode) 
  WHERE p.OriginAirportIATACode LIKE "ORD"
  GROUP BY r.AirlineIATA
  ORDER BY FlightCount DESC
  LIMIT 15;`

  console.log(sql);
  connection.query(sql, function(err, result) {
      if (err) {
          res.send(err)
          return;
      }
      console.log(result);
      if (result[0] != null) {
          console.log('Found Advanced Query 2 Data');
          console.log(result);
          res.json({'success': true, 'result': result});
      } else {
          console.log('No Data Found for AQ2');
          res.json({'success': false, 'result': 'No Data was found!'})
      }
  })
});

/* endpoints for page 3 */
app.post('/delays', function(req, res) {
  var sql = `INSERT INTO Delays (FlightNum, ScheduledDepartureTime, Date, OriginAirportIATACode, DestinationAirportIATACode, DepartureDelay, IsCanceled, DelayCancellationReason, AirlineIATA) VALUES (${req.body.flightnum}, ${req.body.depttime}, ${req.body.date}, ${req.body.org}, ${req.body.dest}, ${req.body.deptdelay}, ${req.body.canceled}, ${req.body.cancelreason}, ${req.body.iata});`;
	console.log(sql);
	connection.query(sql, function(err, result) {
		if (err) {
			res.send(err);
			return;
		}
		if (result[0] != null) {
			console.log('Succesfully Updated Delay Status');
			console.log(result);
			res.json({'success': true, 'result': result})
		} else {
			console.log('Could Not Update Delays Status');
			res.json({'success': false, 'result': 'Could Not Update Delays Status!'})
		}
	});
});

app.listen(80, function () {
    console.log('Node app is running on port 80');
});
