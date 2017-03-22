import React from 'react';
import BuildModuleUrl from 'cesium/Source/Core/buildModuleUrl';
BuildModuleUrl.setBaseUrl('./');
import CesiumViewer from 'cesium/Source/Widgets/Viewer/Viewer';
import Entity from 'cesium/Source/DataSources/Entity';
import CesiumPatcher from './cesium.patcher.js';
import Cartesian3 from 'cesium/Source/Core/Cartesian3';
import TileMapServiceImageryProvider from 'cesium/Source/Scene/TileMapServiceImageryProvider';
import ProviderViewModel from 'cesium/Source/Widgets/BaseLayerPicker/ProviderViewModel'
import CreateOpenStreetMapImageryProvider from 'cesium/Source/Scene/createOpenStreetMapImageryProvider'
import '../styles/cesium.css';

let cesiumViewerOptions = {
    animation: false,
    baseLayerPicker: false,
//     selectedImageryProviderViewModel: new ProviderViewModel({
//      name : 'Open\u00adStreet\u00adMap',
//      iconUrl : BuildModuleUrl('Widgets/Images/ImageryProviders/openStreetMap.png'),
//      tooltip : 'OpenStreetMap (OSM) is a collaborative project to create a free editable \
// map of the world.\nhttp://www.openstreetmap.org',
//      creationFunction : function() {
//          return new TileMapServiceImageryProvider({
//              url : BuildModuleUrl('Assets/Textures/NaturalEarthII')
//          });
//      }
//  }),
    fullscreenButton: false,
    geocoder: false,
    homeButton: false,
    infoBox: false,
    sceneModePicker: false,
    selectionIndicator: false,
    timeline: false,
    navigationHelpButton: false,
    navigationInstructionsInitiallyVisible: false,
    automaticallyTrackDataSourceClocks: false,
    imageryProvider : new TileMapServiceImageryProvider({url : BuildModuleUrl('Assets/Textures/NaturalEarthII')})
};

class CesiumComponent extends React.Component {
    shouldComponentUpdate() {
        return false;
    }

    componentDidMount() {
        // Create the Cesium Viewer
        this.viewer = new CesiumViewer(this.refs.map, cesiumViewerOptions);

        // Add the initial points
        this.props.cities.forEach((city) => {
            this.viewer.entities.add(new Entity({
                id: city.id,
                show: city.visible,
                position: new Cartesian3.fromDegrees(city.longitude, city.latitude),
                billboard: {
                    image: require('../../public/images/pin.svg'),
                    width: 30,
                    height: 30
                }
            }));
        });
        this.viewer = new CesiumViewer(this.refs.map, {
          imageryProvider : new TileMapServiceImageryProvider({url :'Assets/Textures/NaturalEarthII'})
        })
    }

    componentWillReceiveProps(nextProps) {
        let patches = CesiumPatcher.calculatePatches(this.props, nextProps);

        // Map patch operations to Cesium's Entity API
        patches.forEach((patch) => {
            if (patch.attribute === 'visible') {
                this.viewer.entities.getById(patch.id).show = patch.nextValue;
            }
            // else if (patch.attribute === 'name') { .. and so on .. }
        });
    }

    render() {
        return (
            <div ref="map">
            </div>
        );
    }
}

export default CesiumComponent;
