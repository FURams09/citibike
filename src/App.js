import React, { Component } from 'react';
import { Line } from 'rc-progress';
import StationManager from './actions/StationManager';
import Map from './actions/Maps';
import Config from './Config';
import './App.css';


class App extends Component {
    state = {
        stations: [],
        stations_dictionary: [{bikes: 0, racks: 0, name: 'Station', lng: 11, lat: 11, sortOrder: 0}],
        station: {bikes: 0, racks: 0, name: 'Station', lng: 11, lat: 11, sortOrder: 0}
    };
    constructor() {
        super();
        StationManager.getStations.call(this);
    }

    selectStation(event) {
        let current_station = this.state.stations_dictionary[event.target.value]
        this.changeStation(current_station )
    }
    changeStation(station) {
        this.setState( {station })
    }
    

    render() {
        const {bikes, racks, name, station_id} = this.state.station;
        let percentFull = StationManager.getPercentageFull(bikes, racks)
        let meterColor = StationManager.getMeterColor(percentFull) 

    return (
        <div id="stationStatusAndSelector" className="App">
            <label >{`Racks Available: ${racks}`}</label>
            <label >{`Bikes Available: ${bikes}`} </label>
            <select id='station' value={station_id}
                onChange={this.selectStation.bind(this)}>
               { this.state.stations.map(function (station, key) {
                    return <option value={station.station_id}>{station.name}</option>
                })
                }
            </select>
            <button onClick={() => this.setState({ station: this.state.stations_dictionary[Config.homeStation] })} >Home</button>
            <button onClick={() => this.setState({ station: this.state.stations_dictionary[Config.workStation] })} >Work</button>
            <Line percent={percentFull} strokeWidth="4" strokeColor={meterColor}  />
            <Map style={{ width: '300px', height: '500px' }} current_station={this.state.station} stations={this.state.stations} changeStation={this.changeStation.bind(this)} />
           
           
        </div>
    );
    }
}


export default App;
