import React, { Component } from 'react';
import Scripts from 'react-load-script';

import StationManager from './actions/StationManager';
import Map from './actions/Maps';
import './App.css';
import { Line } from 'rc-progress';
import Config from './Config'

const googleMapsAPI = Config.googleMapsKey;


function buildMap() {
     const map = new this.state.googleObj.maps.Map(document.getElementById('stationMap'),
                    {
                        zoom: 15,
                        center: { lng: this.state.lng, lat: this.state.lat}
                    });
     console.log(this.state);
     let markers = [];
     this.state.stations.forEach(station => {
         let marker = new this.state.googleObj.maps.Marker({
             position: { lat: Number(station.lat), lng: Number(station.lng) },
             title: station.name,
             label: station.bikes.toString(),
             map: this.state.map
         });
         marker.addListener('click', function () {
             this.state.map.setCenter({ lat: station.lat, lng: station.lng });
         });
         markers.push(marker);
     });
     this.setState({ map: map , markers: markers })
}

class App extends Component {
    state = {
        stations: [],
        station_id: 0,
        bikes: 0,
        racks: 0,
        percentFull: 0,
        lng: 11,
        lat: 11,
        map: 0,
        markers: [],
        googleMapsKey: googleMapsAPI,
        mapsAPILoaded: false,
        googleObj: 0,
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
        this.state.map.setCenter({
            lng: current_station.lng, lat: current_station.lat
        });
        this.setState({ station_id: current_station.station_id, bikes: current_station.bikes, racks: current_station.racks,lng: current_station.lng, lat: current_station.lat, percentFull: percentage_full} );
    }


    render() {
        
        let meterColor = StationManager.getMeterColor(this.state.percentFull)
        var mapScript = <div />
        if (this.state.mapsAPILoaded === false) {
            //never loaded the script. 
            mapScript = <Scripts url={'http://maps.googleapis.com/maps/api/js?key=' +  Config.googleMapsKey }
                onLoad={() => {

                    if (this.state.mapsAPILoaded === false) {
                        window.buildMap.call(this);
                    }
                }
                }
                onError={() => { } } />
        } else {
            if (!this.state.map && this.state.mapsAPILoaded) {
                //the script has been loaded but the map hasn't been built. 
                buildMap.call(this);
            } else {
                //center the map
                this.state.map.setCenter({ lng: this.state.lng, lat: this.state.lat });
            }
        }
        


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
            
            <Map center={{ lat: this.state.lat, lng: this.state.lng }} style={{ width: '300px', height: '500px' }} googleObj={this.state.googleObj} />
            {mapScript}
           
        </div>
    );
    }
}


export default App;
