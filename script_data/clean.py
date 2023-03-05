import numpy as np
import pandas as pd
import os
import math

airlines_df = pd.read_csv('./data/airlines.csv', delimiter=',')
airports_df = pd.read_csv('./data/airports.csv', delimiter=',')
flights_df = pd.read_csv('./data/flights.csv', delimiter=',')


def create_insert_queries(table_name, fields, data, output_path):
    if os.path.exists(output_path):
        os.remove(output_path)

    # assert len(fields) == len(data.columns)

    insert_query = "insert into\n`{}`(".format(table_name)
    for idx, field in enumerate(fields):
        insert_query += '`{}`'.format(field['val'])
        if idx != len(fields) - 1:
            insert_query += ','
    insert_query += ') values\n'

    with open(output_path, 'w') as f:
        f.write(insert_query)
        last_index = len(data.index) - 1
        for index, row in data.iterrows():
            row_string = '('
            date_str = ""
            j = 0
            for i, val in enumerate(row.values):
                col_name = data.columns[i]
                if col_name in ['YEAR', 'MONTH', 'DAY']:

                    date_str += "{:02d}".format(val)
                    if col_name != 'DAY':
                        date_str += '-'
                    else:
                        j += 1
                else:
                    type = fields[j]['type']
                    if not isinstance(val, str) and (math.isnan(val) or len(str(val)) == 0):
                        row_string += 'NULL'
                    elif type == 'bool':
                        if val == 0:
                            row_string += 'FALSE'
                        else:
                            row_string += 'TRUE'
                    elif type == 'int':
                        row_string += str(val)
                    else:
                        row_string += "'" + str(val) + "'"

                    j += 1

                if i != len(row.values) - 1:
                    row_string += ","

            row_string += ')'

            if index == last_index:
                f.write(row_string + ';')
            else:
                f.write(row_string + ',\n')


airlines_fields = [
    {
        'val': 'IATACode',
        'type': 'str'
    },
    {
        'val': 'AirlineName',
        'type': 'str'
    },
]
create_insert_queries('Airlines', airlines_fields,
                      airlines_df, './data/airlines_out.txt')

airports_fields = [
    {
        'val': 'IATACode',
        'type': 'str'
    },
    {
        'val': 'AirportName',
        'type': 'str'
    },
    {
        'val': 'City',
        'type': 'str'
    },
    {
        'val': 'State',
        'type': 'str'
    },
    {
        'val': 'Latitude',
        'type': 'float'
    },
    {
        'val': 'Longitude',
        'type': 'float'
    },
]
airports_data = airports_df.loc[:, [
    'IATA_CODE', 'AIRPORT', 'CITY', 'STATE', 'LATITUDE', 'LONGITUDE']]
create_insert_queries('Airports', airports_fields,
                      airports_data, './data/airports_out.txt')

flight_routes_fields = [
    {
        'val': 'FlightNumber',
        'type': 'int'
    },
    {
        'val': 'ScheduledDepartureTime',
        'type': 'time'
    },
    {
        'val': 'Date',
        'type': 'date'
    },
    {
        'val': 'AirlineIATA',
        'type': 'str'
    },
    {
        'val': 'ScheduledFlightDuration',
        'type': 'int'
    }
]
flight_routes_data = flights_df.loc[:, [
    'FLIGHT_NUMBER', 'SCHEDULED_DEPARTURE', 'YEAR', 'MONTH', 'DAY', 'AIRLINE', 'SCHEDULED_TIME']]
create_insert_queries('FlightRoutes', flight_routes_fields,
                      flight_routes_data, './data/flight_routes_out.txt')


flight_path_fields = [
    {
        'val': 'FlightNumber',
        'type': 'int'
    },
    {
        'val': 'ScheduledDepartureTime',
        'type': 'time'
    },
    {
        'val': 'Date',
        'type': 'date'
    },
    {
        'val': 'OriginAirportIATACode',
        'type': 'str'
    },
    {
        'val': 'DestinationAirportIATACode',
        'type': 'str'
    }
]
flight_path_data = flights_df.loc[:, ['FLIGHT_NUMBER', 'SCHEDULED_DEPARTURE',
                                      'YEAR', 'MONTH', 'DAY', 'ORIGIN_AIRPORT', 'DESTINATION_AIRPORT']]
create_insert_queries('FlightPath', flight_path_fields,
                      flight_path_data, './data/flight_path_out.txt')


delays_fields = [
    {
        'val': 'FlightNumber',
        'type': 'int'
    },
    {
        'val': 'ScheduledDepartureTime',
        'type': 'time'
    },
    {
        'val': 'Date',
        'type': 'date'
    },
    {
        'val': 'OriginAirportIATACode',
        'type': 'str'
    },
    {
        'val': 'DestinationAirportIATACode',
        'type': 'str'
    },
    {
        'val': 'DepartureDelay',
        'type': 'int'
    },
    {
        'val': 'IsCanceled',
        'type': 'bool',
    },
    {
        'val': 'DelayCancellationReason',
        'type': 'str',
    },
    {
        'val': 'AirlineIATA',
        'type': 'str'
    }
]
delays_data = flights_df.loc[:, ['FLIGHT_NUMBER', 'SCHEDULED_DEPARTURE', 'YEAR', 'MONTH', 'DAY',
                                 'ORIGIN_AIRPORT', 'DESTINATION_AIRPORT', 'DEPARTURE_DELAY', 'CANCELLED', 'CANCELLATION_REASON', 'AIRLINE']]
create_insert_queries('Delays', delays_fields,
                      delays_data, './data/delays_out.txt')
