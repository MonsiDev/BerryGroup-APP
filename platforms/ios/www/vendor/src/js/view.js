var View = {
  idList: document.getElementById("index-category-list"),
  categoryName: "",
  restName: "",
  restUrl : "",

  init: function() {
    var starsList = document.querySelectorAll("#index-category-stars>svg");
    starsList.forEach(function(_each) {
      _each.addEventListener("click", function(_e) {
        Net.getStars(
          View.categoryName + ":" + _each.getAttribute("data-star"),
          function(count) {
            View.refreshStars(count);
          }
        );
      });
    });
  },

  renderCategory: function(bg, logo, title, name, url) {
    Net.getCategory(function(json) {
      View.categoryName = name;
      View.restUrl = url;

      document.getElementById("index-category-head").style.backgroundImage = bg;
      document.getElementById("index-category-logo").src = logo;
      document.getElementById("index-category-title").innerHTML = title;

      json["data"].forEach(function(_each) {
        var item = document.createElement("BUTTON");
        item.classList.add("category__item");
        item.setAttribute(
          "onclick",
          "Frames.goFrame('index-foods-frame', this, View.renderFoods(" +
            _each["id"] +
            ",'" +
            _each["name"] +
            "'))"
        );
        item.innerHTML = _each["name"];

        View.idList.appendChild(item);
      });
      Net.getStars(name + ":true", function(count) {
        View.refreshStars(count);
      });
    }, name);
  },
  renderFoods: function(id, title) {
    document.getElementById("foods-header-title").innerHTML = title;
    var goodsList = document.getElementById('index-foods-list');
    goodsList.innerHTML = '';
    Net.getFoods(function(json) {
      json['data'].forEach(function(_each) {
        var food = Basket.goods[View.categoryName + "-" + id + "-" + _each['good_id']];
        var html = "<div class=\"foods-item\" id=\"good-" + _each['good_id'] + "\" style=\"background-image: url('" + View.restUrl + _each['path'] + "');\">" +
        "<div class=\"foods-item__info\">" +
        "<div class=\"foods-item__title\">" + _each['name'] + "</div>" +
        "<div class=\"foods-item__description\">" + _each['description'] + "</div>" +
        "</div>" +
        "<div class=\"foods-item__panel\">" +
        "<div class=\"foods-item__price\">" + _each['price'] + " руб.</div>" +
        "<div class=\"foods-item__weight\">г.</div>" +
        "<div class=\"foods-item__button\">" +
        "<button class=\"foods-item__button-delivery " + (food ? "foods-item__button-calc--hidden" : "") + "\" id=\"good-delivery-button\" onclick=\"Basket.addGoods('" + View.categoryName + "-" + id + "-" + _each['good_id'] + "', '" + _each['name'] + "', '200 г.', '" + _each['price'] + " руб.', 'good-" + _each['good_id'] + "','" + _each['path'] + "')\">" +
        "<svg width=\"15px\" height=\"15px\" stroke=\"#fff\">" +
        "<use xlink:href=\"img/icons-pack.svg#svg-item-cart-icon\"></use>" +
        "</svg>" +
        "<span>Заказать</span>" +
        "</button>" +
        "<div class=\"foods-item__button-calc " + (food ? "" : "foods-item__button-calc--hidden") + "\" id=\"good-delivery-calc\">" +
        "<div class=\"foods-item__button-ct\" id=\"good-calc-count\">" + (food ? food['count'] : '0') + " шт</div>" +
        "<button class=\"foods-item__button-pm\" onclick=\"Basket.subGoods('" + View.categoryName + "-" + id + "-" + _each['good_id'] + "', 'good-" + _each['good_id'] + "')\">" +
        "<svg width=\"14px\" height=\"14px\">" +
        "<use xlink:href=\"img/icons-pack.svg#svg-minus-icon\"></use>" +
        "</svg>" +
        "</button>" +
        "<button class=\"foods-item__button-pm\" onclick=\"Basket.addGoods('" + View.categoryName + "-" + id + "-" + _each['good_id'] + "', '" + _each['name'] + "', '200 г.', '" + _each['price'] + " руб.', 'good-" + _each['good_id'] + "','" +  _each['path']+ "')\">" +
        "<svg width=\"14px\" height=\"14px\">" +
        "<use xlink:href=\"img/icons-pack.svg#svg-plus-icon\"></use>" +
        "</svg>" +
        "</button>" +
        "</div>" +
        "</div>" +
        "</div>" +
        "</div>";
        goodsList.innerHTML += html;
      });
    }, View.categoryName + ":" + id);
  },
  refreshStars: function(count) {
    var starsList = document.querySelectorAll("#index-category-stars>svg");
    var i = 0;
    starsList.forEach(function(_each) {
      _each.classList.remove("category-info__stars--active");
    });
    for (i = 0; i < count; i++) {
      starsList[i].classList.add("category-info__stars--active");
    }
  },
  refreshGood: function($this, good, totalCount, totalPrice) {
    var deliveryButton = $this.querySelector("#good-delivery-button");
    var deliveryCalc = $this.querySelector("#good-delivery-calc");
    if (good["count"] > 0) {
      deliveryButton.classList.add("foods-item__button-delivery--hidden");
      deliveryCalc.classList.remove("foods-item__button-calc--hidden");
    } else {
      deliveryButton.classList.remove("foods-item__button-delivery--hidden");
      deliveryCalc.classList.add("foods-item__button-calc--hidden");
    }
    $this.querySelector("#good-calc-count").innerHTML = good['count'] + " шт";
  }
};
