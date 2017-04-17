import React, { Component } from 'react';

import StationManager from './actions/StationManager';
import './App.css';
import { Line } from 'rc-progress';
import ReactTable from 'react-table';


class App extends Component {
    state = {
        stations: [],
        station_id: 0,
        bikes: 0,
        racks: 0,
        percentFull: 0,
        gps: [45, 45],
        refreshList: true,
        idealState: {
            stations: {
                station_id: 'station_info',
                selected_station: 'selected_id'
            }
        }
    };
    constructor() {
        super();
        StationManager.getStations.call(this);
    }

    changeStation(event) {
        let current_station = this.state.stations.find((station) => station.station_id === event.target.value);
        let percentage_full = StationManager.getPercentageFull(current_station.bikes, current_station.racks)
        this.setState({ station_id: current_station.station_id, bikes: current_station.bikes, racks: current_station.racks, gps: current_station.gps, percentFull: percentage_full} );
    }
    

    render() {
        window.buildMap.call(this);
        console.log( this.state.stations );
        let meterColor = StationManager.getMeterColor(this.state.percentFull)
    return (
        <div id="stationStatusAndSelector" className="App">
            <label id='racksAvailable'>{`Racks Available: ${this.state.racks}`}</label>
            <label id='bikesAvailable'>{`Bikes Available: ${this.state.bikes}`} </label>
            <select id='station' data-gps={[{ 45: 45}]}
                value={this.state.station_id}
                onChange={this.changeStation.bind(this)}>
               { this.state.stations.map(function (station, key) {
                    return <option value={station.station_id}>{station.name}</option>
                })
                }
            </select>
            <Line percent={this.state.percentFull} strokeWidth="4" strokeColor={meterColor}  />
        </div>
    );
    }
}


export default App;
