var Basket = {
  goods: {},
  totalCount: 0,
  totalPrice: 0,
  delivery: true,

  addGoods: function(name, title, weight, price, id, path) {
    $this = document.getElementById(id);
    if (Basket.goods[name] == undefined) {
      Basket.goods[name] = {
        title: title,
        weight: weight,
        price: parseInt(price),
        count: 0,
        path : path,
      };
    }
    Basket.goods[name]["count"]++;
    Basket.totalCount++;
    Basket.totalPrice += parseInt(price);
    View.refreshGood(
      $this,
      Basket.goods[name],
      Basket.totalCount,
      Basket.totalPrice
    );
  },
  subGoods: function(name, id) {
    $this = document.getElementById(id);
    if (Basket.goods[name] != undefined) {
      Basket.goods[name]["count"]--;
      Basket.totalCount--;
      Basket.totalPrice -= parseInt(Basket.goods[name]["price"]);
      View.refreshGood(
        $this,
        Basket.goods[name],
        Basket.totalCount,
        Basket.totalPrice
      );
      if (Basket.goods[name]["count"] <= 0) {
        Basket.goods[name] = undefined;
      }
    }
  },
  sendDelivery: function($this) {
    if (Basket.totalPrice > 0 && Basket.totalCount > 0) {
      var $preloader = document.getElementById("delivery-preloader");
      $preloader.style.display = "flex";
      $preloader.classList.add("preloader--show");
      var _e = event || window.event;
      var i = 0;
      var formSend = {};
      for (i = 0; i < _e.target.length; i++) {
        if (_e.target[i].name == "delivery") {
          formSend[_e.target[i].name] = Basket.delivery;
        } else {
          formSend[_e.target[i].name] = _e.target[i].value;
        }
      }
      formSend["totalCount"] = Basket.totalCount;
      formSend["totalPirce"] = Basket.totalPrice;
      formSend["goods"] = Basket.goods;
      WSocket.send("delivery=" + JSON.stringify(formSend));
      WSocket.onmessage = function(_e) {
        $preloader.classList.remove("preloader--show");
        Basket.goods = {};
        Basket.totalCount = 0;
        Basket.totalPrice = 0;
        Basket.goodsRefresh();
        Basket.basketRefresh();
        animate(2000, function() {
          $preloader.style.display = "";
        });
      };
    }
    return false;
  },
  goodsRefresh: function() {
    var basketGoods = document.getElementById("basket-goods");
    basketGoods.innerHTML = "";
    for (goodID in Basket.goods) {
      var _each = Basket.goods[goodID];
      var bg = document.createElement("DIV");
      var bgi = document.createElement("DIV");
      var bgin = document.createElement("DIV");
      var bgt = document.createElement("DIV");
      var bgw = document.createElement("DIV");
      var bgc = document.createElement("DIV");
      var bgp = document.createElement("DIV");

      bg.classList.add("basket-good");
      bgi.classList.add("basket-good__img");
      bgin.classList.add("basket-good__info");
      bgt.classList.add("basket-good__title");
      bgw.classList.add("basket-good__weight");
      bgc.classList.add("basket-good__count");
      bgp.classList.add("basket-good__price");

      bg.style.backgroundImage = "url(" + View.restUrl + _each["path"] + ")";
      bgt.innerHTML = _each["title"];
      bgw.innerHTML = "200 г";
      bgc.innerHTML =
        '<span data-text="Количество"></span><span data-text="' +
        _each["count"] +
        ' шт."></span>';
      bgp.innerHTML =
        '<span data-text="Цена"></span><span data-text="' +
        _each["count"] * _each["price"] +
        ' руб."></span>';

      bgin.appendChild(bgt);
      bgin.appendChild(bgw);
      bgin.appendChild(bgc);
      bgin.appendChild(bgp);
      bg.appendChild(bgi);
      bg.appendChild(bgin);
      basketGoods.appendChild(bg);
    }
  },
  basketRefresh: function() {
    var totalPrice = document.querySelectorAll("#basket-total-price");
    var infoDelivery = document.querySelectorAll("#basket-info-delivery");
    totalPrice.forEach(function(_each) {
      var totalPrice = Basket.totalPrice;
      if (Basket.delivery == true && Basket.totalPrice < 1000) {
        totalPrice = Basket.totalPrice + 100;
      }
      _each.children[1].innerHTML = String(totalPrice) + " руб.";
    });
    infoDelivery.forEach(function(_each) {
      var msg = "самовывоз";
      if (Basket.delivery == true) {
        msg = "курьером";
        if (Basket.totalPrice > 1000) {
          msg = "бесплатно";
        }
      }
      _each.children[1].innerHTML = msg;
    });
  },
  goBasket: function($this) {
    if (Basket.totalCount > 0) {
      Basket.goodsRefresh();
      Basket.basketRefresh();
      Frames.goFrame("index-basket-frame");
    }
  }
};
