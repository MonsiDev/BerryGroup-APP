(function() {
  "use strict";

  window["appInit"] = function() {
    navInit("nav-button-show");
    View.init();
    Frames.init(document.getElementById("frames"));
  };

  window["testEvent"] = function(elem, event, fun) {
    var events = $._data(elem, "events");

    return (
      !!events &&
      !!(events = events[event]) &&
      (!fun ||
        events.some(function(data) {
          return data.handler == fun;
        }))
    );
  };

  window['animate'] = function(duration, endAnimation) {
    var startTime = performance.now();
    requestAnimationFrame(function measure(time) {
      var timePassed = time - startTime;
      if (timePassed > duration) {
        endAnimation();
        timePassed = duration;
      }
      if (timePassed < duration) {
        requestAnimationFrame(measure);
      }
    });
  }

  function navInit(id) {
    var buttonNav = document.getElementById(id);
    var idNav = document.getElementById(buttonNav.getAttribute("data-nav"));

    buttonNav.addEventListener("click", function(_e) {
      idNav.style.visibility = "visible";
      idNav.classList.add("index-nav--show");
    });

    idNav.addEventListener("click", function(_e) {
      if (_e.target == this) {
        this.classList.remove("index-nav--show");
        animate(230, function() {
          idNav.style.visibility = "";
        });
      }
    });
  }
})();
