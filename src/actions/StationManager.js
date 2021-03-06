﻿import React, { Component } from 'react';
import axios from   'axios';
import geojsonTools from 'geojson-tools';
import Config from '../Config'
const StationManager = {

    getStations() {
        axios.get('https://gbfs.citibikenyc.com/gbfs/en/station_information.json')
            .then((station_information) => {
                axios.get('https://gbfs.citibikenyc.com/gbfs/en/station_status.json')
                    .then((station_status_list) => {
                        var { stations } = station_information.data.data;
                        var station_status = station_status_list.data.data.stations;
                        buildStationList(this, stations, station_status);

                    })
                    .catch((err) => { console.log(err) });
            })
            .catch((err) => {
                console.log(err)
            })
    },

    getPercentageFull(bikes, racks) {
        return getPercentageFull(bikes, racks);
    },

    getMeterColor(pct) {
        if (pct === 0) {
            return '#FF0000'
        }
        let green = Math.floor(255 * (pct / 100))
        let red = Math.floor(255 - green);
        return '#' + red.toString(16).toUpperCase() + green.toString(16).toUpperCase() + '00' ;
    }
};

function buildStationList(state, station_information, station_status) {
    let station_list = [];
    let station_dictionary = {};
    station_information = sortStations(station_information);
    for (let i = 0; i < station_information.length; i++) {
        let this_station = station_information[i];
        for (let j = 0; j < station_status.length; j++) {
            let this_station_status = station_status[j];
            if (this_station.station_id === this_station_status.station_id) {
                station_dictionary[this_station.station_id] = { station_id: this_station.station_id, name: this_station.name, bikes: this_station_status.num_bikes_available, racks: this_station_status.num_docks_available, lng: this_station.lon, lat: this_station.lat, sortOrder: i  };
                station_list.push( { station_id: this_station.station_id, name: this_station.name, bikes: this_station_status.num_bikes_available, racks: this_station_status.num_docks_available, lng: this_station.lon, lat: this_station.lat, sortOrder: i});
            }
        }
    };
    let first_station = station_list[0]; 

    state.setState({ stations: station_list, stations_dictionary: station_dictionary, station: first_station });
}

function getPercentageFull(bikes, racks) {
    return Math.floor(bikes / (bikes + racks) * 100);
}
function sortStations(stations) {
    let starting_station = Config.homeGPS;
    function compare(a, b) {
        let distanceA = geojsonTools.getDistance([starting_station, [a.lat, a.lon]])
        let distanceB = geojsonTools.getDistance([starting_station, [b.lat, b.lon]])
        if (distanceA < distanceB)
            return -1;
        if (distanceA > distanceB)
            return 1;
        return 0;
    }

    return stations.sort(compare);
};

export default StationManager;