var Frames = {
  element: {},
  targetFrame: document.getElementById("index-main-frame"),
  storyFrame: [],

  init: function(element_) {
    this.element = element_;
  },

  goFrame: function(frame, $this, _frameEnd = null) {
    var idFrame = document.getElementById(frame);
    window.scrollTo(0, 0);
    this.targetFrame.classList.remove("frame--show");
    idFrame.classList.add("frame--show");

    this.storyFrame.push(this.targetFrame);
    this.targetFrame = idFrame;

    _frameEnd;
  },

  backFrame: function(_e) {
    var idFrame = this.storyFrame.pop();

    idFrame.classList.add("frame--show");
    this.targetFrame.classList.remove("frame--show");

    this.targetFrame = idFrame;
  }
};
