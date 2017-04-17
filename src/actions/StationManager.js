import axios from   'axios';

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
    station_information = sortStations(station_information);
    for (let i = 0; i < station_information.length; i++) {
        let this_station = station_information[i];
        for (let j = 0; j < station_status.length; j++) {
            let this_station_status = station_status[j];
            if (this_station.station_id === this_station_status.station_id) {
                //station_list[this_station.station_id] = { station_id: this_station.station_id, name: this_station.name, bikes: this_station_status.num_bikes_available, racks: this_station_status.num_docks_available, gps: { coordinates: [this_station.lon, this_station.lat] } };
                station_list.push( { station_id: this_station.station_id, name: this_station.name, bikes: this_station_status.num_bikes_available, racks: this_station_status.num_docks_available, gps: [this_station.lon, this_station.lat] });
            }
        }
    };
    let first_station = station_list[0]; 
    let percentage_full = getPercentageFull(first_station.bikes, first_station.racks);
    state.setState({ stations: station_list, station_id: first_station.station_id, bikes: first_station.bikes, racks: first_station.racks, percentFull: percentage_full, gps: first_station.gps });
}

function getPercentageFull(bikes, racks) {
    return Math.floor(bikes / (bikes + racks) * 100);
}
function sortStations(stations, sortField = 'name') {
    function compare(a, b) {
        if (a[sortField] < b[sortField])
            return -1;
        if (a[sortField] > b[sortField])
            return 1;
        return 0;
    }

    return stations.sort(compare);
};

export default StationManager;