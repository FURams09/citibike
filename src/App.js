import React, { Component } from 'react';
import StationManager from './actions/StationManager';
import Map from './actions/Maps';
import Config from './Config';
import './App.css';
import { Line } from 'rc-progress';

class App extends Component {
    state = {
        stations: [],
        stations_dictionary: [{bikes: 0, racks: 0, name: 'Station', lng: 11, lat: 11}],
        station: {bikes: 0, racks: 0, name: 'Station', lng: 11, lat: 11}
    };
    constructor() {
        super();
        StationManager.getStations.call(this);
    }

    changeStation(event) {
        let current_station = this.state.stations_dictionary[event.target.value]
        this.setState({ station: current_station })
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
                onChange={this.changeStation.bind(this)}>
               { this.state.stations.map(function (station, key) {
                    return <option value={station.station_id}>{station.name}</option>
                })
                }
            </select>
            <button onClick={() => this.setState({ station: this.state.stations_dictionary[Config.homeStation] })} >Home</button>
            <button onClick={() => this.setState({ station: this.state.stations_dictionary[Config.workStation] })} >Work</button>
            <Line percent={percentFull} strokeWidth="4" strokeColor={meterColor}  />
            <Map style={{ width: '300px', height: '500px' }} current_station={this.state.station} stations={this.state.stations} />
           
           
        </div>
    );
    }
}


export default App;
