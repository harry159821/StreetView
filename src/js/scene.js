'use strict';

/**
 * Scene Types
 * @type Enum
 */
var SceneType = Object.freeze({
  SKYBOX: 0,
  SPHERE: 1
});

/**
 * Render Modes
 * @type Enum
 */
var RenderMode = Object.freeze({
  CSS3D: 0,
  WEBGL: 1
});

/**
 * Scene class
 * @type Scene
 */
var Scene = function Scene() {
  this.markerSpace = new MarkerSpace();
  this.scene = new THREE.Scene();
};

/**
 * load configuration
 */
Scene.prototype.load = function() {
  var root = this;
  $.getJSON(root.src).success(function(data) {
    root.configuration = data;
    // load textures
    

  }).error(function() {
    console.warn('Failed to load scene file:', root.src);
  });
};

/**
 * BoxScene class
 * @param Object opt options
 */
var BoxScene = function BoxScene(opt) {
  Scene.call(this, opt);

  opt = Object.create(opt);

  Object.defineProperties(this, {
    type: {
      value: SceneType.SKYBOX,
      writable: false
    },
    src: {
      value: opt.src,
      writable: false
    }
  });

};

/**
 * SphereScene class
 * @param {Object} opt options for creating a sphere scene
 */
var SphereScene = function SphereScene(opt) {
  Scene.call(this, opt);

  opt = Object.create(opt);

  Object.defineProperties(this, {
    type: {
      value: SceneType.SPHERE,
      writable: false
    },
    src: {
      value: opt.src,
      writable: false
    }
  });

  this.load();
  this.initTHREEObjects();
  
};

SphereScene.prototype = Object.create(Scene.prototype);

/**
 * 
 * @return 
 */
SphereScene.prototype.initTHREEObjects = function() {
  var RADIUS = 1000,
    SEGMENT = 32;

  var scene = this.scene = new THREE.Scene();
  var canvas = this.canvas = document.createElement('canvas');
  var texture = new THREE.Texture(canvas);

  geometry = new THREE.SphereGeometry(RADIUS, SEGMENT, SEGMENT);
  material = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.BackSide
  });

  var mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

};

