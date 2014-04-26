// This THREEx helper makes it easy to handle window resize.
// It will update renderer and camera when window is resized.
//
// # Usage
//
// **Step 1**: Start updating renderer and camera
//
// ```var windowResize = THREEx.WindowResize(aRenderer, aCamera)```
//    
// **Step 2**: Start updating renderer and camera
//
// ```windowResize.stop()```
// # Code

//

/** @namespace */
var THREEx = window.THREEx || {};

/**
 * Update renderer and camera when the window is resized
 *
 * @param {Object} renderer the renderer to update
 * @param {Object} camera the camera to update
 * @param {HTMLElement} container parent element for canavas
 */
THREEx.WindowResize = function(renderer, camera, container) {
  var w, h;
  if (container) {
    w = container.offsetWidth;
    h = container.offsetHeight;
  } else {
    w = window.innerWidth;
    h = window.innerHeight;
  }

  var callback = function() {
      // notify the renderer of the size change
      renderer.setSize(w, h);
      // update the camera
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    // bind the resize event
  window.addEventListener('resize', callback, false);
  // return .stop() the function to stop watching window resize
  return {
    /**
     * Stop watching window resize
     */
    stop: function() {
      window.removeEventListener('resize', callback);
    }
  };
}
