var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql2');
var path = require('path');
var cors = require('cors');
require('dotenv').config()

let connection = mysql.createConnection({
	host: process.env.host,
	user: process.env.user,
	password: process.env.password,
	database: process.env.database,
	dateStrings: true
});

connection.connect(function (err) {
	if (err) {
		console.error('Error connecting: ' + err.stack);
		return;
	}
	console.log('Connected as thread id: ' + connection.threadId);
});


var app = express();

// set up ejs view engine 
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '../public'));
app.use(cors())
app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader(
		"Access-Control-Allow-Methods",
		"OPTIONS, GET, POST, PUT, PATCH, DELETE"
	);
	res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
	next();
});

/* endpoints for page 1 */
app.get('/airports', function (req, res) {
	var sql = 'SELECT * FROM Airports;';
	console.log(sql);
	connection.query(sql, function (err, result) {
		if (err) {
			res.send(err);
			return;
		}
		if (result[0] != null) {
			console.log('Found Airport Data');
			console.log(result);
			res.json({ 'success': true, 'result': result })
		} else {
			console.log('No Data Found');
			res.json({ 'success': false, 'result': 'No Data was found!' })
		}
	});
});

app.get('/airlines', function (req, res) {
	var sql = 'SELECT * FROM Airlines;';
	console.log(sql);
	connection.query(sql, function (err, result) {
		if (err) {
			res.send(err);
			return;
		}
		if (result[0] != null) {
			console.log('Found Airline Data');
			console.log(result);
			res.json({ 'success': true, 'result': result })
		} else {
			console.log('No Data Found');
			res.json({ 'success': false, 'result': 'No Data was found!' })
		}
	});
});

app.get('/delays', function (req, res) {
	var sql = `SELECT * FROM Delays WHERE OriginAirportIATACode LIKE "${req.query.origin}" AND DestinationAirportIATACode LIKE "${req.query.dest}" ORDER BY Date DESC;`;
	console.log(sql);
	connection.query(sql, function (err, result) {
		if (err) {
			res.send(err);
			return;
		}
		if (result[0] != null) {
			console.log('Found Delay Data');
			res.json({ 'success': true, 'result': result })
		} else {
			console.log('No Delays Between These Airports Found');
			res.json({ 'success': false, 'result': [] })
		}
	});
});

app.put('/delays', function (req, res) {
	var sql = `
        UPDATE Delays 
        SET DepartureDelay = ${req.body.DepartureDelay}, 
            IsCanceled = ${req.body.IsCanceled}, 
            DelayCancellationReason = ${req.body.DelayCancellationReason} 
        WHERE FlightNum = ${req.body.FlightNum} 
        AND DATE_FORMAT(Date, '%Y-%m-%d') = DATE_FORMAT(STR_TO_DATE('${req.body.Date}', '%Y-%m-%dT%H:%i:%s.%fZ'), '%Y-%m-%d')
            AND ScheduledDepartureTime LIKE "${req.body.ScheduledDepartureTime}"
            AND OriginAirportIATACode LIKE "${req.body.OriginAirportIATACode}" 
            AND DestinationAirportIATACode LIKE "${req.body.DestinationAirportIATACode}";
    `;
	console.log(sql);
	connection.query(sql, function (err, result) {
		if (err) {
			res.send(err);
			return;
		}
		console.log(result)
		if (result.changedRows > 0) {
			console.log('Succesfully Updated Delay Status');
			console.log(result);
			res.json({ 'success': true, 'result': result })
		} else {
			console.log('Could Not Update Delays Status');
			res.json({ 'success': false, 'result': 'Could Not Update Delays Status!' })
		}
	});
});

app.delete('/delays', function (req, res) {
	var sql = `
        DELETE FROM Delays 
        WHERE FlightNum = ${req.body.FlightNum} 
        AND DATE_FORMAT(Date, '%Y-%m-%d') = DATE_FORMAT(STR_TO_DATE('${req.body.Date}', '%Y-%m-%dT%H:%i:%s.%fZ'), '%Y-%m-%d')
            AND ScheduledDepartureTime LIKE "${req.body.ScheduledDepartureTime}"
            AND OriginAirportIATACode LIKE "${req.body.OriginAirportIATACode}" 
            AND DestinationAirportIATACode LIKE "${req.body.DestinationAirportIATACode}";
    `;

	console.log(sql);
	connection.query(sql, function (err, result) {
		if (err) {
			res.send(err);
			return;
		}
		console.log(result)
		if (result.affectedRows === 1) {
			console.log('Succesfully Deleted Delay');
			console.log(result);
			res.json({ 'success': true, 'result': result })
		} else {
			console.log('Could Not Delete Delay');
			res.json({ 'success': false, 'result': 'Could Not Delete Delay!' })
		}
	});
});

/* endpoints for page 2 - advanced queries */
// Average Delay by Airline of non-cancelled flights
app.get('/adv1', function (req, res) {
	var sql = `SELECT d.AirlineIATA, a.Airline, AVG(d.DepartureDelay) AS avgDepartureDelay
  FROM Delays d JOIN Airlines a ON (d.AirlineIATA = a.IATACode)
  WHERE d.IsCanceled LIKE 0
  GROUP BY d.AirlineIATA
  ORDER BY avgDepartureDelay
  LIMIT 15;`

	console.log(sql);
	connection.query(sql, function (err, result) {
		if (err) {
			res.send(err)
			return;
		}

		if (result[0] != null) {
			console.log('Found Advanced Query 1 Data');
			console.log(result);
			res.json({ 'success': true, 'result': result });
		} else {
			console.log('No Data Found for AQ1');
			res.json({ 'success': false, 'result': 'No Data was found!' })
		}
	})
});

// Most popular airlines from Chicago O'Hare Airport (ORD)
app.get('/adv2', function (req, res) {
	console.log(req.body)
	var sql = `SELECT r.AirlineIATA, a.Airline, COUNT(*) AS FlightCount
  FROM FlightPath p 
      JOIN FlightRoutes r ON (p.FlightNumber = r.FlightNumber) 
      JOIN Airlines a ON (r.AirlineIATA = a.IATACode) 
  WHERE p.OriginAirportIATACode LIKE "${req.query.airport}"
  GROUP BY r.AirlineIATA
  ORDER BY FlightCount DESC
  LIMIT 15;`

	console.log(sql);
	connection.query(sql, function (err, result) {
		if (err) {
			res.send(err)
			return;
		}
		console.log(result);
		if (result[0] != null) {
			console.log('Found Advanced Query 2 Data');
			console.log(result);
			res.json({ 'success': true, 'result': result });
		} else {
			console.log('No Data Found for AQ2');
			res.json({ 'success': false, 'result': 'No Data was found!' })
		}
	})
});

/* endpoints for page 3 */
app.post('/delays', function (req, res) {
	var flightNum = req.body.FlightNum;
	var scheduledDepartureTime = req.body.ScheduledDepartureTime;
	var date = req.body.Date;
	var originAirportIATACode = req.body.OriginAirportIATACode;
	var destinationAirportIATACode = req.body.DestinationAirportIATACode;
	var departureDelay = req.body.DepartureDelay;
	var isCanceled = req.body.IsCanceled;
	var delayCancellationReason = req.body.DelayCancellationReason;
	var airlineIATA = req.body.AirlineIATA;

	// // Check if FlightNum exists in FlightRoutes
	// var checkFlightNumQuery = `SELECT * FROM FlightRoutes WHERE FlightNumber = ${flightNum}`;
	// connection.query(checkFlightNumQuery, function (err, rows, fields) {
	// 	if (err) {
	// 		console.log(err);
	// 		res.send(err);
	// 		return;
	// 	}

	// 	// If FlightNum does not exist, insert it
	// 	if (rows.length == 0) {
	// 		var insertFlightNumQuery = `
    //             INSERT INTO FlightRoutes (
    //                 FlightNumber,
    //                 ScheduledDepartureTime,
    //                 RelevantDate,
    //                 AirlineIATA,
    //                 ScheduledFlightDuration
    //             ) VALUES (
    //                 ${flightNum},
    //                 '${scheduledDepartureTime}',
    //                 '${date}',
    //                 '${airlineIATA}',
    //                 0
    //             )
    //         `;
	// 		connection.query(insertFlightNumQuery, function (err, result) {
	// 			if (err) {
	// 				console.log(err);
	// 				res.send(err);
	// 				return;
	// 			}
	// 			console.log(`FlightNum ${flightNum} inserted successfully`);
	// 			insertDelay();
	// 		});
	// 	} else {
	// 		insertDelay();
	// 	}
	// });

	// function insertDelay() {

	var insertDelayQuery = `
		INSERT INTO Delays (
			FlightNum,
			ScheduledDepartureTime,
			Date,
			OriginAirportIATACode,
			DestinationAirportIATACode,
			DepartureDelay,
			IsCanceled,
			DelayCancellationReason,
			AirlineIATA
		) VALUES (
			${flightNum},
			'${scheduledDepartureTime}',
			'${date}',
			'${originAirportIATACode}',
			'${destinationAirportIATACode}',
			${departureDelay},
			${isCanceled},
			${delayCancellationReason ? "'" + delayCancellationReason + "'" : null},
			'${airlineIATA}'
		)
	`;
	connection.query(insertDelayQuery, function (err, result) {
		if (err) {
			console.log(err)
			res.send(err);
			return;
		}
		console.log(result)
		if (result.affectedRows === 1) {
			console.log('Succesfully Inserted Delay');
			console.log(result);
			res.json({ 'success': true, 'result': result })
		} else {
			console.log('Could not insert delay');
			res.json({ 'success': false, 'result': 'Could not insert delay' })
		}
	});
// }
});

// EC: Visualize API
app.get('/visualize', function (req, res) {
	var sql = `
	SELECT 
		a.IATACode, 
		a.AirportName, 
		COUNT(*) AS totalDelays, 
		AVG(d.DepartureDelay) as avgDelay,
		LargeDelays.numLargeDelays
	FROM 
		Delays d JOIN Airports a ON d.OriginAirportIATACode = a.IATACode, 
		(
			SELECT a2.IATACode, COUNT(*) as numLargeDelays
			FROM Delays d2 JOIN Airports a2 ON d2.OriginAirportIATACode = a2.IATACode
			WHERE d2.DepartureDelay >= 15
			GROUP BY a2.IATACode
		) AS LargeDelays
	WHERE a.IATACode = LargeDelays.IATACode
	GROUP BY a.IATACode
	ORDER BY a.IATACode
  `

	console.log(sql);
	connection.query(sql, function (err, result) {
		if (err) {
			res.send(err)
			return;
		}

		if (result[0] != null) {
			console.log('Found Visualize Data');
			console.log(result);
			res.json({ 'success': true, 'result': result });
		} else {
			console.log('No Data Found for Visualize');
			res.json({ 'success': false, 'result': 'No Visualize Data was found!' })
		}
	})
});

app.get('/login', function (req, res) {
	console.log(req.query)
	var UserName = req.query.UserName;
	var FirstName = req.query.FirstName;
	var LastName = req.query.LastName;
	var Password = req.query.Password;
	if (!FirstName) {
		FirstName = "Default";
	}
	if (!LastName) {
		LastName = "Default";
	}

	var userId_sql = `(SELECT count(*) as ID FROM Users)`;
	connection.query(userId_sql, function (err, r) {
		if (err) {
			res.send(err)
			return;
		}

		let userId = r[0].ID
		console.log(userId)
		var sql = `INSERT INTO Users VALUES ('${userId}', '${UserName}', '${Password}', '${FirstName}', '${LastName}')`;

		console.log(sql);
		connection.query(sql, function (err, result) {
			if (err) {
				if (err.sqlMessage == 'You Are Successfully Logged In') {
					// console.log("here")
					let getUserSQL = `SELECT * FROM Users WHERE UserName LIKE "${UserName}";`;
					connection.query(getUserSQL, function (err, result2) {
						if (result2[0] != null) {
							console.log('Found User Data');
							console.log(result2);
							res.json({ 'success': true, 'result': result2 });
						} else {
							console.log('No Data Found for User');
							res.json({ 'success': false, 'result': 'No User Data was found!' })
						}
					});
				} else {
					// console.log(err)
					res.json({ 'success': false, 'result': 'No User Data was found!' })
					return;
				}
			} else {
				let getUserSQL = `SELECT * FROM Users WHERE UserName LIKE "${UserName}";;`;
				connection.query(getUserSQL, function (err, result2) {
					if (result2[0] != null) {
						console.log('Found User Data');
						console.log(result2);
						res.json({ 'success': true, 'result': result2 });
					} else {
						console.log('No Data Found for User');
						res.json({ 'success': false, 'result': 'No User Data was found!' })
					}
				});
			}
		});
	});
});

//Adding flight to user's itinerary
app.post('/itinerary', function (req, res) {
	var sql = `INSERT INTO Itinerary (UserID, FlightNum, RelevantDate, ScheduledDepartureTime, OriginAirportIATACode, DestinationAirportIATACode) 
	VALUES (${req.body.userid}, ${req.body.flightnum}, "${req.body.date}", "${req.body.depttime}", "${req.body.origin}", "${req.body.dest}");`;
	console.log(sql);
	connection.query(sql, function (err, result) {
		if (err) {
			res.send(err);
			return;
		}
		console.log(result)
		if (result.affectedRows > 0) {
			console.log('Succesfully Added Flight To Your Itinerary');
			// console.log(result);
			res.json({ 'success': true, 'result': result })
		} else {
			console.log('Could Not Add Flight To Itinerary');
			res.json({ 'success': false, 'result': 'Could Not Add Flight To Itinerary' })
		}
	});

});

app.get('/itinerary', function (req, res) {
	var sql = `SELECT * FROM Itinerary WHERE UserID = ${req.query.user_id};`;
	console.log(req.query)
	console.log(sql);
	connection.query(sql, function (err, result) {
		if (err) {
			res.send(err);
			return;
		}
		console.log(result)
		if (result[0] != null) {
			console.log('Succesfully got all itineraries');
			// console.log(result);
			res.json({ 'success': true, 'result': result })
		} else {
			console.log('Could Not get Itinerary');
			res.json({ 'success': false, 'result': [] })
		}
	});

});

// Stored Procedure 
app.get('/procedure', function (req, res) {
	var requestIATA = req.query.IATA;

	var sql = 'CALL Result("' + requestIATA + '")'; // procedure is Result(requestIATA VARCHAR(3))
	console.log(sql);
	connection.query(sql, function (err, result) {
		if (err) {
			res.send(err)
			return;
		}
		console.log(result);
		if (result[0] != null) {
			console.log("Successfully ran stored procedure");
			res.json({ 'success': true, 'result': result });
		} else {
			console.log('Failed run stored procedure');
			res.json({ 'success': true, 'result': 'Failed Stored Procedure' });
		}
	})
});

app.delete('/user', (req, res) => {
	var sql = `
		DELETE FROM Users
		WHERE UserID = ${req.body.UserID};
	`

	connection.query(sql, function (err, result) {
		if (err) {
			res.send(err);
			return;
		}

		if (result.affectedRows === 1) {
			console.log('Succesfully Deleted User');
			console.log(result);
			res.json({ 'success': true, 'result': result })
		} else {
			console.log('Could Not Delete User');
			res.json({ 'success': false, 'result': 'Could Not Delete User!' })
		}
	})
})

app.get('/status', (req, res) => res.send('Working!'));

// Port 8080 for Google App Engine
app.set('port', process.env.PORT || 5001);

app.listen(5001, function () {
	console.log('Node app is running on port 5001');
});