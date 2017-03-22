import React from 'react';
import CesiumComponent from "./cesium"

export default class CesiumLayout extends React.Component {
    
    render() {
        return (
            <div>
                <div ref="map">
                </div>
                <CesiumComponent mapRef={this.refs.map} cities={this.props.cities}></CesiumComponent>
            </div>
        );
    }
}

