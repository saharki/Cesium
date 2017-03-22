import React from 'react';
import ReactDOM from 'react-dom';
import CesiumComponent from './cesium.jsx';
import CityList from './cities.jsx';

class Application extends React.Component {
    constructor () {
        super();
        this.state = {
            cities: require('../assets/top10cities.json')
        };
    }

    _onCheckboxChange(event) {
        let cities = this.state.cities;
        let newCities = cities.map((city) => {
            let visible = (city.id === event.target.value) ? event.target.checked : city.visible;
            return {
                id: city.id,
                name: city.name,
                state: city.state,
                latitude: city.latitude,
                longitude: city.longitude,
                visible: visible
            }
        });
        this.setState({
            cities: newCities
        })
    }

    render() {
        return (
            <div>
                <CesiumComponent cities={this.state.cities}></CesiumComponent>
                <CityList cities={this.state.cities} onChange={this._onCheckboxChange.bind(this)}></CityList>
            </div>
        );
    }
}
ReactDOM.render(<Application />, document.getElementById('app'));
