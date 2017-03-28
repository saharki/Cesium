import React from 'react';
import BuildModuleUrl from 'cesium/Source/Core/buildModuleUrl';
BuildModuleUrl.setBaseUrl('./');
import CesiumViewer from 'cesium/Source/Widgets/Viewer/Viewer';
import Entity from 'cesium/Source/DataSources/Entity';
import CesiumPatcher from './cesium.patcher.js';
import Cartesian3 from 'cesium/Source/Core/Cartesian3';
import TileMapServiceImageryProvider from 'cesium/Source/Scene/TileMapServiceImageryProvider'
import KmlDataSource from 'cesium/Source/DataSources/KmlDataSource'
// import ProviderViewModel from 'cesium/Source/Widgets/BaseLayerPicker/ProviderViewModel'
// import CreateOpenStreetMapImageryProvider from 'cesium/Source/Scene/createOpenStreetMapImageryProvider'
// import { DrawHelper as cesiumDrawHelperModule } from './cesiumDrawHelperModule.js'
import '../styles/cesium.css';
import '../styles/cesiumDrawHelper.css';

console.log(new TileMapServiceImageryProvider({url : BuildModuleUrl('Assets/Textures/NaturalEarthII')}))

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
    navigationInstructionsInitiallyVisible: true,
    automaticallyTrackDataSourceClocks: false,
    imageryProvider : new TileMapServiceImageryProvider({url : BuildModuleUrl('Assets/Textures/NaturalEarthII')})
};


const setToolarsHandlers = (toolbar, scene, logging) => {

    toolbar.addListener('markerCreated', (event) =>  {
        logging.innerHTML = 'Marker created at ' + event.position.toString()
        // create one common billboard collection for all billboards
        var b = new Cesium.BillboardCollection();
        scene.primitives.add(b);
        var billboard = b.add({
            show : true,
            position : event.position,
            pixelOffset : new Cesium.Cartesian2(0, 0),
            eyeOffset : new Cesium.Cartesian3(0.0, 0.0, 0.0),
            horizontalOrigin : Cesium.HorizontalOrigin.CENTER,
            verticalOrigin : Cesium.VerticalOrigin.CENTER,
            scale : 1.0,
            image: './img/glyphicons_242_google_maps.png',
            color : new Cesium.Color(1.0, 1.0, 1.0, 1.0)
        });
        billboard.setEditable();
    });
    toolbar.addListener('polylineCreated', (event) =>  {
        logging.innerHTML = 'Polyline created with ' + event.positions.length + ' points'
        var polyline = new DrawHelper.PolylinePrimitive({
            positions: event.positions,
            width: 5,
            geodesic: true
        });
        scene.primitives.add(polyline);
        polyline.setEditable();
        polyline.addListener('onEdited', (event) =>  {
            logging.innerHTML = 'Polyline edited, ' + event.positions.length + ' points'
        });
    });
    toolbar.addListener('polygonCreated', (event) =>  {
        logging.innerHTML = 'Polygon created with ' + event.positions.length + ' points'
        var polygon = new DrawHelper.PolygonPrimitive({
            positions: event.positions,
            material : Cesium.Material.fromType('Checkerboard')
        });
        scene.primitives.add(polygon);
        polygon.setEditable();
        polygon.addListener('onEdited', (event) =>  {
            logging.innerHTML = 'Polygon edited, ' + event.positions.length + ' points'
        });
    });
    toolbar.addListener('circleCreated', (event) =>  {
        logging.innerHTML = 'Circle created: center is ' + event.center.toString() + ' and radius is ' + event.radius.toFixed(1) + ' meters'
        var circle = new DrawHelper.CirclePrimitive({
            center: event.center,
            radius: event.radius,
            material: Cesium.Material.fromType(Cesium.Material.RimLightingType)
        });
        scene.primitives.add(circle);
        circle.setEditable();
        circle.addListener('onEdited', (event) =>  {
            logging.innerHTML = 'Circle edited: radius is ' + event.radius.toFixed(1) + ' meters'
        });
    });
    toolbar.addListener('extentCreated', (event) =>  {
        var extent = event.extent;
        logging.innerHTML = 'Extent created (N: ' + extent.north.toFixed(3) + ', E: ' + extent.east.toFixed(3) + ', S: ' + extent.south.toFixed(3) + ', W: ' + extent.west.toFixed(3) + ')'
        var extentPrimitive = new DrawHelper.ExtentPrimitive({
            extent: extent,
            material: Cesium.Material.fromType(Cesium.Material.StripeType)
        });
        scene.primitives.add(extentPrimitive);
        extentPrimitive.setEditable();
        extentPrimitive.addListener('onEdited', (event) =>  {
            logging.innerHTML = 'Extent edited: extent is (N: ' + event.extent.north.toFixed(3) + ', E: ' + event.extent.east.toFixed(3) + ', S: ' + event.extent.south.toFixed(3) + ', W: ' + event.extent.west.toFixed(3) + ')'
        });
    });
}

class CesiumComponent extends React.Component {
    shouldComponentUpdate() {
        return false;
    }

    componentDidMount() {
        // Create the Cesium Viewer
        this.viewer = new CesiumViewer(this.refs.map, cesiumViewerOptions);

        // var viewer = new Cesium.Viewer('cesiumContainer');
        this.viewer.dataSources.add(KmlDataSource.load(BuildModuleUrl('Assets/boundaries.kml'),
            {
                  camera: this.viewer.scene.camera,
                  canvas: this.viewer.scene.canvas
            })
        )
        // this.viewer.dataSources.add(KmlDataSource.load(BuildModuleUrl('Assets/populated_places.kml'),
        //     {
        //           camera: this.viewer.scene.camera,
        //           canvas: this.viewer.scene.canvas
        //     })
        // )
        // const layers = this.viewer.scene.imageryLayers;
        // const blackMarble = layers.addImageryProvider(new Cesium.TileMapServiceImageryProvider({
        //     url : '//cesiumjs.org/tilesets/imagery/blackmarble',
        //     maximumLevel : 8,
        //     credit : 'Black Marble imagery courtesy NASA Earth Observatory'
        // }));

        // blackMarble.alpha = 0.5; // 0.0 is transparent.  1.0 is opaque.

        // blackMarble.brightness = 2.0; // > 1.0 increases brightness.  < 1.0 decreases.

        this.drawHelper = new window.DrawHelper(this.viewer.cesiumWidget)
        this.toolbar = this.drawHelper.addToolbar(this.refs.toolbar, {
          buttons: ['marker', 'polyline', 'polygon', 'circle', 'extent']
        });
        setToolarsHandlers(this.toolbar, this.viewer.cesiumWidget.scene, this.refs.logging)
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
        // this.viewer = new CesiumViewer(this.refs.map, {
        //   imageryProvider : new TileMapServiceImageryProvider({url :'Assets/Textures/NaturalEarthII'})
        // })
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
            // <CesiumDrawHelper cesiumWidget={this.viewer.cesiumWidget}/>
    
    render() {
        return (
            <div>
                <div ref="toolbar" class="toolbar">
                </div>
                <div ref="map">
                </div>
                <div ref="logging">
                </div>
            </div>
        );
    }
}

export default CesiumComponent;
