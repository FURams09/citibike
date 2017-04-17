import React, {Component} from 'react';


class Map extends Component {
    
    render() {
        return (
            <div>
                <div style={this.props.style} id="stationMap" ref="map">
                </div>
                
            </div>
        );
    }
  
    
}

export default Map;