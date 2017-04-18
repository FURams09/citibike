import React, { Component} from 'react';
import Config from '../Config'
import Scripts from 'react-load-script';
import StationManager from '../actions/StationManager';

const googleMapsAPI = Config.googleMapsKey;

class Map extends Component {

constructor(props) {
    super(props);
    this.state= {
        googleMapsKey: googleMapsAPI,
        map: 0,
        googleObj: 0,
        mapsAPILoaded: false,
        markers: []
    }
}



componentDidUpdate(props) {
    
    const  { station_id, name, bikes, racks, lng, lat, sortOrder} = this.props.current_station;
    if (!this.state.map && this.state.googleObj && this.props.stations.length > 0) {
        const map = new this.state.googleObj.maps.Map(document.getElementById('stationMap'),
                        {
            zoom: 15,
            center: { lng: lng, lat: lat }
        });
        
        const current_station_index = this.props.stations.findIndex(station => station.station_id === this.props.current_station.station_id);
        let first_marker = current_station_index < 25 ? 0 :  current_station_index - 25;
        let last_marker = current_station_index > this.props.length - 26 ? this.props.length : current_station_index + 25;
    var markers = [];
   
        this.props.stations.forEach((station, i)=>{
            var marker = new this.state.googleObj.maps.Marker({
                position: { lat: Number(station.lat), lng: Number(station.lng) },
                title: station.name,
                label: station.bikes.toString()
            })
            marker.addListener('click', () =>{
                this.updateMarkers.call(this, map, i);
                this.props.changeStation(station);
                

            })
            if ((i >  first_marker) && (i < last_marker )) {
                marker.setMap(map);
            }
            markers.push(marker);     
            
        })
        
        this.setState({ map: map, markers: markers });
    } 

}

addMarkers(map, current_index) {
    for (let i = 0; i < this.state.markers.length -1; i++) {
        if (i > current_index - 25 && i < current_index + 25) {
            this.state.markers[i].setMap(map);
        } else {
            this.state.markers[i].setMap(null);
        }
        
    }
}

updateMarkers(props) {
    this.state.map.setCenter({ lat: this.props.current_station.lat, lng: this.props.current_station.lng})
    this.addMarkers(this.state.map, this.props.current_station.sortOrder);
}

render(props) {
    var mapScript = <div />

    if (this.state.mapsAPILoaded === false) {
        //never loaded the script. 
        mapScript = <Scripts url= { 'https://maps.googleapis.com/maps/api/js?key=' + this.state.googleMapsKey }
        onLoad={
            () => {
                if (this.state.mapsAPILoaded === false) {
                    window.buildMap.call(this);
                }
            }
        }
        onError = {() => { }}
        />
    } 
    if (this.state.map) {
        this.updateMarkers()
    };
    return (
    <div>
    <div style={this.props.style} id="stationMap" ref="map">
    </div>

    {mapScript}
    </div>
    );
    }   


};

export default Map;