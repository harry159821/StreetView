$(function() {

  // load baidu map
  var map = new BMap.Map("baidu-map", {
    minZoom: 16
  });
  map.centerAndZoom(new BMap.Point(119.520705, 32.205663), 17);
  map.enableScrollWheelZoom(true);

  var bound = new BMap.Bounds(new BMap.Point(119.506633, 32.218283), new BMap.Point(119.536241, 32.197997));  
  BMapLib.AreaRestriction.setBounds(map, bound);

  $.getJSON('data/scenes.json', function(data) {
    var html = data.map(function(e) {
      // add marker
      var point = new BMap.Point(e.location[0], e.location[1]);
      var infoWindow = new BMap.InfoWindow('', {
        title: e.title
      });
      var marker = new BMap.Marker(point, {
        title: e.title
      });
      marker.addEventListener('click', function() {
        loadScene(e.src);
      });
      map.addOverlay(marker);

      //
      return '<li><a href="' + e.src + '"><img src="' + e.thumbs +
        '"><span>' + e.title + '</span></a></li>';
    });

    $('#gallery-list').html(html).on('click', 'a', function(e) {
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

  var controls = new DeviceOrientationController( camera, renderer.domElement );
  // controls.rotateSpeed = -0.5;
  // controls.zoomSpeed = 3;
  // controls.minDistance = -radius;
  // controls.maxDistance = radius >> 1;
  controls.addEventListener('change', render);
  controls.connect();

  container.appendChild(renderer.domElement);

  camera.position.z = 10;
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
    
  }, false);


  function loadScene(src) {
    $('#baidu-map').fadeOut();

    var img = new Image();
    img.onload = function() {
      var ratio = img.width / img.height;

      // var maxWidth = screen.width * 2;
      canvas.width = Math.min(3200, (img.width | 1) - 1);
      canvas.height = canvas.width >> 1;

      var h = (canvas.width / ratio) >> 0,
        top = (canvas.height - h) >> 1;

      canvasContext.save();
      canvasContext.translate(canvas.width, 0);
      canvasContext.scale(-1, 1);
      canvasContext.drawImage(img, 0, top, canvas.width, h);
      canvasContext.restore();

      this.minPolarAngle = 0;
      this.maxPolarAngle = Math.PI;

      texture.needsUpdate = true;
      render();
    }
    img.src = src;

  }

});
