function getBtcPrice(url, plat, rule){
	//console.log("arg len:"+arguments.length);
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      // JSON.parse does not evaluate the attacker's scripts.
      var resp = JSON.parse(xhr.responseText);
      var price=resp.ticker?parseFloat(resp.ticker.last):parseFloat(resp.last);
      badgeDisplay("btc", plat, price);
      if (rule)
      	showNotice(price, rule);
      else {
      	var moneySymbol = "￥";
      	if (plat == "796" || plat == "bitstamp")
      		moneySymbol = "$ ";
      	$("#"+plat+"_price").html(moneySymbol+price);
	  }
    }
  }
  xhr.send(); 
}

function badgeDisplay(coinName, plat, price){
	if (coinName == localStorage["badgeCoin"] && plat == localStorage["badgePlat"]) {
          //设置角标颜色
	      	if (localStorage["badgePrice"] && localStorage["badgePrice"] > price)
	      		chrome.browserAction.setBadgeBackgroundColor({color: getBadgeColor(localStorage["downColor"])});
	      	else
	      		chrome.browserAction.setBadgeBackgroundColor({color: getBadgeColor(localStorage["upColor"])});
	        chrome.browserAction.setBadgeText({text: ""+price});
          var moneySymbol = "￥";
          if (plat == "796" || plat == "bitstamp")
             moneySymbol = "$ ";
          chrome.browserAction.setTitle({'title': coinNameInfo[coinName]+": "+moneySymbol+price});
	        localStorage["badgePrice"] = price;
	}
}

function getBadgeColor(color){
  if(color == "red"){
    return [255, 0, 0, 255];
  } 
  if(color == "green"){
    return [0, 255, 0, 255];
  } 
}

function showNotice(price, rule){
	var onPrice = parseFloat(rule.onPrice);
	var belowPrice = parseFloat(rule.belowPrice);
	if (price>onPrice||price<belowPrice) {
		var icon, curPrice;
		if (price > onPrice) {
			icon = "img/"+localStorage["upColor"]+"_up.png";
			curPrice = onPrice;
		} else{
			icon = "img/"+localStorage["downColor"]+"_down.png";
			curPrice = belowPrice;
		}
  		var time = new Date().valueOf();
		if(!rule.noticeTime)
			rule.noticeTime = 0;
		//console.log("notice!!--time gap:"+(time - rule.noticeTime));
		//提醒间隔15分钟
		if(time - rule.noticeTime > 900000){
			var moneySymbol = "￥";
			if (rule.platform == "796" || rule.platform == "bitstamp")
				moneySymbol = "$";
	        var notification = webkitNotifications.createNotification(
	                icon,  // 图标 URL，可以是相对路径
	                platNameInfo[rule.platform],  // 通知标题
	                coinNameInfo[rule.coinName]+'价格超过警戒值'+moneySymbol+curPrice+',当前价格：'+moneySymbol+price  // 通知正文文本
	        );
	        notification.show(); 
			rule.noticeTime = time;
			localStorage["priceNotification"] = JSON.stringify(rules);
		}
	}
}

function getMTPrice(){
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "http://data.mtgox.com/api/2/BTCUSD/money/ticker_fast?pretty", true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      // JSON.parse does not evaluate the attacker's scripts.
      var resp = JSON.parse(xhr.responseText);
      $("#mtgox_price").html(resp.data.last_local.display);
      //chrome.browserAction.setBadgeText({text: ""+parseInt(resp.data.last_local.value)});
    }
  }
  xhr.send(); 
}

function getHBPrice(rule){
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "http://market.huobi.com/staticmarket/detail.html", true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      //console.log("huobi:"+xhr.responseText);
      var jsonStr=xhr.responseText.substring(12,xhr.responseText.length-1);
      //console.log("after:"+jsonStr);
      // JSON.parse does not evaluate the attacker's scripts.
      var resp = JSON.parse(jsonStr);
      var price = parseFloat(resp.trades[0].price);
      badgeDisplay("btc", "huobi", price);
      if (rule)
      	showNotice(price, rule);
      else
      	$("#huobi_price").html("￥"+price);
    }
  }
  xhr.send(); 
}

function getHBLtcPrice(rule){
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "https://market.huobi.com/staticmarket/detail_ltc.html", true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      //console.log("huobi:"+xhr.responseText);
      var jsonStr=xhr.responseText.substring(12,xhr.responseText.length-1);
      //console.log("after:"+jsonStr);
      // JSON.parse does not evaluate the attacker's scripts.
      var resp = JSON.parse(jsonStr);
      var price = parseFloat(resp.trades[0].price);
      badgeDisplay("ltc", "huobi", price);
      if (rule)
      	showNotice(price, rule);
      else
      	$("#huobi_ltc").html("￥"+price);
    }
  }
  xhr.send(); 
}

//LTC
function getLtcPrice(url, plat, rule){
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      // JSON.parse does not evaluate the attacker's scripts.
      var resp = JSON.parse(xhr.responseText);
      var price=resp.ticker?parseFloat(resp.ticker.last):parseFloat(resp.last);
      badgeDisplay("ltc", plat, price)
      if (rule) 
      	showNotice(price, rule);
      else
      	$("#"+plat+"_ltc").html("￥"+price);
    }
  }
  xhr.send(); 
}

//altcoin
function getBtc38AltPrice(type,rule){
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "http://www.btc38.com/httpAPI.php?" + Math.random().toString(), true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      // JSON.parse does not evaluate the attacker's scripts.
      var resp = JSON.parse(xhr.responseText);
      if (rule) {
      	showNotice(parseFloat(resp[type+'2cny']), rule);
      	badgeDisplay(type, "btc38", parseFloat(resp[type+'2cny']));
      }
      else if (type) {
        $("#btc38_"+type).html("￥"+parseFloat(resp[type+"2cny"]).toString());
      }
      else{
      	var altCoins = JSON.parse(localStorage["altDispArr"]);
      	for (var i=0; i<altCoins.length; i++){
      		$("#btc38_"+altCoins[i]).html("￥"+parseFloat(resp[altCoins[i]+"2cny"]).toString());
        }      	
      }
    }
  }
  xhr.send(); 
}

function getBterAltPrice(type,rule){
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "https://bter.com/api/1/ticker/"+(type=="dog"?"doge":type)+"_cny", true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      // JSON.parse does not evaluate the attacker's scripts.
      var resp = JSON.parse(xhr.responseText);
      var price=parseFloat(resp.last);
      badgeDisplay(type, "bter", price);
      if (rule) {
      	showNotice(price, rule);
      } else
      	$("#bter_"+type).html("￥"+price);
    }
  }
  xhr.send(); 
}