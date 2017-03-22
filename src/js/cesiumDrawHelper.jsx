import React from 'react';
import BuildModuleUrl from 'cesium/Source/Core/buildModuleUrl';
BuildModuleUrl.setBaseUrl('./');
import CesiumDrawHelperPatcher from './cesiumDrawHelper.patcher.js'
import CesiumWidget from 'cesium/Source/Widgets/CesiumWidget/CesiumWidget'
import '../styles/cesium.css';

export default class CesiumDrawHelper extends React.Component {
  // shouldComponentUpdate() {
  //   return false;
  // }

  componentDidMount() {
    // Create the Cesium Viewer
    this.drawHelper = new CesiumDrawHelperPatcher(this.props.cesiumWidget)
    this.toolbar = this.drawHelper.addToolbar(document.getElementById("toolbar"), {
      buttons: ['marker', 'polyline', 'polygon', 'circle', 'extent']
    });
    // this.viewer = new CesiumViewer(this.refs.map, {
    //   imageryProvider : new TileMapServiceImageryProvider({url :'Assets/Textures/NaturalEarthII'})
    // })
  }

  // componentWillReceiveProps(nextProps) {
  //   let patches = CesiumPatcher.calculatePatches(this.props, nextProps);

  //   // Map patch operations to Cesium's Entity API
  //   patches.forEach((patch) => {
  //     if (patch.attribute === 'visible') {
  //       this.viewer.entities.getById(patch.id).show = patch.nextValue;
  //     }
  //   // else if (patch.attribute === 'name') { .. and so on .. }
  // });
  // }

  render() {
    return (
      <div ref="toolbar">
      </div>
      );
  }
}

