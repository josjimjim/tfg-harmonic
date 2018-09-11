import * as THREE from 'three'
window.THREE = THREE;
require('three/examples/js/controls/OrbitControls.js');

export const CANVAS_WIDTH = 500;
export const CANVAS_HEIGHT = 400;
export const MAX_TRAIL_POINTS = 5000;
export const MAX_CHART_POINTS = 1000;

/**
 * Three.js context initializer.
 * 
 * @param {THREE.Vector3} position Camera position. Default = (0, 0, 100).
 * @param {THREE.Vector3} lookAt Camera look at point. Default = (0, 0, 0).
 * @param {Boolean} rotation Enable controls rotation. Default = false.
 * @param {Number} width Render and canvas width. Default = CANVAS_WIDTH.
 * @param {Number} height Render and canvas height. Default = CANVAS_HEIGHT.
 * @return Renderer, Camera, Controls and Canvas.
 */
export function initContext(canvasID, position = new THREE.Vector3(0, 0, 100), lookAt = new THREE.Vector3(0, 0, 0), rotation = false, width = CANVAS_WIDTH, height = CANVAS_HEIGHT) {
    let renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
    renderer.sortObjects = false;

    let camera = new THREE.PerspectiveCamera(20, width / height, 0.1, 1000);
    camera.position.set(position.x, position.y, position.z);
    camera.lookAt(lookAt);

    let controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.minDistance = 1;
    controls.maxDistance = 900;
    controls.enableRotate = rotation;

    let canvas = document.getElementById(canvasID);
    canvas.appendChild(renderer.domElement);

    return {
        renderer: renderer,
        camera: camera,
        controls: controls,
        canvas: canvas
    };
}

/**
 * 3D axis initializer
 * 
 * @param {Number} x X axis length [-x, +x].
 * @param {Number} y Y axis length [-y, +y].
 * @param {Number} z Z axis length [-z, +z].
 * @param {Number} offset XZ height
 * @return 3D axis
 */
export function initAxis(x = 500, y = 500, z = 0, offset = 0) {
    let materialAxisX = new THREE.LineBasicMaterial({ color: 0x0000ff });
    let geometryAxisX = new THREE.Geometry();
    geometryAxisX.vertices.push(new THREE.Vector3(-x, offset, 0));
    geometryAxisX.vertices.push(new THREE.Vector3(x, offset, 0));

    let materialAxisY = new THREE.LineBasicMaterial({ color: 0xff0000 });
    let geometryAxisY = new THREE.Geometry();
    geometryAxisY.vertices.push(new THREE.Vector3(0, -y, 0));
    geometryAxisY.vertices.push(new THREE.Vector3(0, y, 0));

    let materialAxisZ = new THREE.LineBasicMaterial({ color: 0x00ff00 });
    let geometryAxisZ = new THREE.Geometry();
    geometryAxisZ.vertices.push(new THREE.Vector3(0, offset, -z));
    geometryAxisZ.vertices.push(new THREE.Vector3(0, offset, z));

    let axisX = new THREE.Line(geometryAxisX, materialAxisX);
    let axisY = new THREE.Line(geometryAxisY, materialAxisY);
    let axisZ = new THREE.Line(geometryAxisZ, materialAxisZ);

    let axis = new THREE.Object3D();
    axis.add(axisX);
    axis.add(axisY);
    axis.add(axisZ);

    return axis;
}

/**
 * 3D axis initializer for charts
 * 
 * @param {Number} x X axis length [-x, +x].
 * @param {Number} y Y axis length [-y, +y].
 * @param {Number} z Z axis length [-z, +z].
 * @param {Number} offset XZ height
 * @return 3D axis
 */
export function initChartAxis(x = 500, y = 500, z = 0, offset = 0) {
    let materialAxis = new THREE.LineBasicMaterial({ color: 0xd3d3d3 });

    let geometryAxisX = new THREE.Geometry();
    geometryAxisX.vertices.push(new THREE.Vector3(-x, offset, 0));
    geometryAxisX.vertices.push(new THREE.Vector3(x, offset, 0));

    let geometryAxisY = new THREE.Geometry();
    geometryAxisY.vertices.push(new THREE.Vector3(0, -y, 0));
    geometryAxisY.vertices.push(new THREE.Vector3(0, y, 0));

    let geometryAxisZ = new THREE.Geometry();
    geometryAxisZ.vertices.push(new THREE.Vector3(0, offset, -z));
    geometryAxisZ.vertices.push(new THREE.Vector3(0, offset, z));

    let axisX = new THREE.Line(geometryAxisX, materialAxis);
    let axisY = new THREE.Line(geometryAxisY, materialAxis);
    let axisZ = new THREE.Line(geometryAxisZ, materialAxis);

    for(let i = -x; i < x; i+=0.5){
        let geometryMarkX = new THREE.Geometry();
        geometryMarkX.vertices.push(new THREE.Vector3(i,  0.05, 0));
        geometryMarkX.vertices.push(new THREE.Vector3(i, -0.05, 0));
        let markX = new THREE.Line(geometryMarkX, materialAxis);
        axisX.add(markX)
    } 

    for(let i = -y; i < y; i+=0.5){
        let geometryMarkY = new THREE.Geometry();
        geometryMarkY.vertices.push(new THREE.Vector3( 0.05, i, 0));
        geometryMarkY.vertices.push(new THREE.Vector3(-0.05, i, 0));
        let markY = new THREE.Line(geometryMarkY, materialAxis);
        axisY.add(markY)
    } 

    let axis = new THREE.Object3D();
    axis.add(axisX);
    axis.add(axisY);
    axis.add(axisZ);

    return axis;
}

/**
 * Pendulum trail initializer.
 * 
 * @param {Number} position - Initial trail position points.
 * @return Trail object.
 */
export function initTrail(position, color = 0xff8800){
    let lineMaterial = new THREE.MeshBasicMaterial({color: color});
    let geometry = new THREE.Geometry();
    for (let i=0; i < MAX_TRAIL_POINTS; i++){
        geometry.vertices.push(new THREE.Vector3(position.x, position.y, position.z));
    }
    let trailLine = new THREE.Line(geometry, lineMaterial);
    trailLine.geometry.dynamic = true;

    return trailLine;
}

/**
 * Add a new point to the trail. If trail is not enabled then points are reloaded.
 * 
 * @param {Number[]} trailLine - Pendulum trail line.
 * @param {THREE.Vector3} position - New point to add.
 * @param {Boolean} trailReload - Reload trail line.
 * @return Object with the complete list of vertices and the next status of trailReload.
 */
export function updateTrail(trailLine, position, trailReload){
    if(trailReload) {
        for (let i=0; i < MAX_TRAIL_POINTS; i++){
            trailLine.geometry.vertices[i] = new THREE.Vector3(position.x, position.y, position.z);
        }
        trailReload = false;
    }
    trailLine.geometry.vertices.push(trailLine.geometry.vertices.shift());
    trailLine.geometry.vertices[MAX_TRAIL_POINTS - 1] = new THREE.Vector3(position.x, position.y, position.z);
    trailLine.geometry.verticesNeedUpdate = true;

    return {
        vertices: trailLine.geometry.vertices,
        trailReload: trailReload
    }
}

/**
 * Detect a collision between two pendulum objects if the distance is less than both radius added
 * 
 * @param {Object} ball1 Pendulum one
 * @param {Object} ball2 Pendulum two
 * @param {Numbre} penetration Pentration index in colision.
 * @return True if colides. False otherwise.
 */
export function circleColisionDetection(ball1, ball2, penetration = 0){
    let dx = Math.abs(ball1.circle.position.x - ball2.circle.position.x);
    let dy = Math.abs(ball1.circle.position.y - ball2.circle.position.y);
    let distance = Math.sqrt(dx * dx + dy * dy);
  
    return distance - penetration < ball1.radius + ball2.radius;
  }

