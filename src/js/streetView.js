$(function() {
  // init mapbox

  var transform = function(point) {
    var magic = Math.PI * 3000.0 / 180.0;
    var x = point[0] - 0.0065,
      y = point[1] - 0.006;
    var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * magic);
    var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * magic);
    var lat = z * Math.sin(theta);
    var lon = z * Math.cos(theta);
    return GCJ02.gcj2wgsEx(lat, lon);
  };

  var northWest = [119.506633, 32.218283],
    southEast = [119.536241, 32.197997],
    center = [119.520705, 32.205663];

  northWest = transform(northWest);
  southEast = transform(southEast);

  var bounds = L.latLngBounds(northWest, southEast);

  var retina = function(tileSource) {
    return window.devicePixelRatio > 1.5 ? tileSource.replace('.png', '@2x.png') : tileSource;
  };

  L.Icon.Default.imagePath = 'images/leaflet/';

  var map = L.map('map', {
    attributionControl: false,
    center: transform(center),
    // maxBounds: bounds,
    zoom: 15,
    minZoom: 14
  });

  L.tileLayer(retina(
    'http://{s}.tiles.mapbox.com/v4/codecolorist.le813p3d/{z}/{x}/{y}.png?' +
    'access_token=pk.eyJ1IjoiY29kZWNvbG9yaXN0IiwiYSI6Ik9qT0hDa1EifQ.jQqEGsy46F77OL0m7E6xIA'), {
    detectRetina: true
  }).addTo(map);

  // show pins
  $.getJSON('data/scenes.json', function(data) {
    var html = data.map(function(e) {
      // add marker
      var innerHTML = '<a class="place" href="' + e.src + '"><img src="' + e.thumbs +
        '"><span>' + e.title + '</span></a>';

      if (e.location && e.location.length) {
        // console.log(e.location, transform(e.location));
        L.marker(transform(e.location))
          .bindPopup(innerHTML)
          .addTo(map);
      }
      return '<li>' + innerHTML + '</li>';
    });

    $('#gallery-list').html(html);
    $('.leaflet-popup-pane, #gallery-list').on('click', 'a.place', function(e) {
      e.preventDefault();
      loadScene(this.href);
    });

  });

  // 3d

  var canvas = document.createElement('canvas'),
    canvasContext = canvas.getContext("2d");

  var container = document.querySelector('#viewport'),
    w = container.offsetWidth,
    h = container.offsetHeight;

  var radius = 400;

  var camera = new THREE.PerspectiveCamera(60, w / h, 100, 10000),
    scene = new THREE.Scene(),
    projector = new THREE.Projector();

  var sphere = new THREE.SphereGeometry(radius, 32, 32);
  var texture = new THREE.Texture(canvas);
  var material = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.BackSide
  });

  var mesh = new THREE.Mesh(sphere, material);
  mesh.matrixAutoUpdate = false;
  mesh.rotation.phi = Math.PI;
  scene.add(mesh);

  var renderer = new THREE.WebGLRenderer({
    antialias: true
  });
  renderer.setClearColor(0x000000, 0);
  renderer.setSize(w, h);
  renderer.domElement.style.position = 'absolute';

  var controls;
  if ("onorientationchange" in window) {
    // mobile devices
    controls = new DeviceOrientationController(camera, renderer.domElement);
    controls.connect();
    camera.position.z = 10;
  } else {
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    camera.position.z = -100;
    controls.rotateSpeed = -1.0;
    controls.minDistance = -500;
    controls.maxDistance = 500;
    window.camera = camera;
  }

  controls.addEventListener('change', render);
  container.appendChild(renderer.domElement);
  animate();

  function animate() {
    controls.update();
    // Todo: tween animation between scenes
    requestAnimationFrame(animate);
  }

  function render() {
    renderer.render(scene, camera);
  }

  window.addEventListener('resize', function onWindowResize() {
    var w = container.offsetWidth,
      h = container.offsetHeight;

    camera.aspect = w / h;
    camera.updateProjectionMatrix();

    renderer.setSize(w, h);
    render();

  }, false);

  function loadScene(src) {
    $('#map').fadeOut();
    $('#gallery-list, #gallery-stage').addClass('off');

    var img = new Image();
    img.onload = function() {
      var aspect = img.width / img.height;

      // var maxWidth = screen.width * 2;
      canvas.width = Math.min(screen.width * 2, (img.width | 1) - 1);
      canvas.height = canvas.width >> 1;

      var polarAngle = Math.PI * 2 * aspect - camera.fov;
      console.log(aspect, camera.fov);

      controls.minPolarAngle = 0;
      // controls.maxPolarAngle = polarAngle;
      console.log(polarAngle);

      var h = (canvas.width / aspect) >> 0,
        top = (canvas.height - h) >> 1;

      canvasContext.save();
      canvasContext.translate(canvas.width, 0);
      canvasContext.scale(-1, 1);
      canvasContext.drawImage(img, 0, top, canvas.width, h);
      canvasContext.restore();

      texture.needsUpdate = true;
      render();
    }
    img.src = src;

  }

  $('#gallery-stage').on('mouseenter', function() {
    $('#gallery-stage, #gallery-list').removeClass('off');
  });
});
