var Net = {
  getCategory: function(_func, name) {
    WSocket.send("category=" + name);
    WSocket.onmessage = function(_e) {
      _func(JSON.parse(_e.data));
    };
  },
  getFoods: function(_func, id) {
    WSocket.send("goods=" + id);
    WSocket.onmessage = function(_e) {
      _func(JSON.parse(_e.data));
    };
  },
  getStars: function(param, _func) {
    WSocket.send("stars=" + param);
    WSocket.onmessage = function(_e) {
      _func(parseInt(_e.data));
    }
  }
};
