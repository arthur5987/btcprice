

$(document).ready(function(){
	var actived = false;
	if (localStorage["btcDisp"] == "false"){
		$("#btcTab").hide();
		$("#btc").hide();
	}
	else if (!actived) {
		$("#btcTab").addClass("active");
		$("#btc").addClass("active");
		actived = true;
	}
	if (localStorage["ltcDisp"] == "false"){
		$("#ltcTab").hide();
		$("#ltc").hide();
	}
	else if (!actived) {
		$("#ltcTab").addClass("active");
		$("#ltc").addClass("active");
		actived = true;
	}
	//显示竞争币
	if (localStorage["altDisp"] == "true"){
		var altDispHTML = "";
		var altCoins = JSON.parse(localStorage["altDispArr"]);
		for(var i=0; i<altCoins.length; i++){
			//console.log("coin:"+altCoins[i]+" "+coinNameInfo[altCoins[i]]);
			var btc38url = "-";
			var bterurl = "-";
			//console.log(relationInfo[altCoins[i]]);
			if ($.inArray("btc38", relationInfo[altCoins[i]]) != -1) {
				//console.log("btc38 in array");
				btc38url = '<a id="btc38_' + altCoins[i] + '" target="_blank" href="http://www.btc38.com/trade.html?btc38_trade_coin_name=' + 
							altCoins[i] + '" onclick="chrome.tabs.create({url:this.href})">waiting</a>';
			}
			if ($.inArray('bter', relationInfo[altCoins[i]]) != -1) {
				//console.log("bter in array");
				bterurl = '<a id="bter_' + altCoins[i] + '" target="_blank" href="http://bter.com/trade/' + 
							altCoins[i] + '_cny" onclick="chrome.tabs.create({url:this.href})">waiting</a>';
			}
			altDispHTML += '<tr><td>' + coinNameInfo[altCoins[i]] + '</td>'+
              '<td>' + btc38url + '</td>'+
              '<td>' + bterurl + '</td></tr>'
		}
		altDispHTML += '<tr><td><a target="_blank" href="options.html" id="moreCoin">'+
						'<span class="glyphicon glyphicon-plus-sign"></span> 更多</a></td><td></td><td></td></tr>';
		var table = $("#altCoinTable");
		table.append(altDispHTML);
		$("#moreCoin").click(function(){
			localStorage["fromPopup"]="true";
		//	alert(localStorage["fromPopup"]);
		//	chrome.tabs.create({url:this.href});
		});
		if (!actived) {
			$("#altTab").addClass("active");
			$("#altcoin").addClass("active");
			actived = true;
		}
	}
	else{
		$("#altTab").hide();
		$("#altcoin").hide();
	}
	
	
	
  /********BTC Price********/
  //getMTPrice();
  getBtcPrice("https://www.bitstamp.net/api/ticker/","bitstamp");
  getBtcPrice("https://data.btcchina.com/data/ticker?market=btccny","btcchina");
  getBtcPrice("https://www.okcoin.com/api/ticker.do","okcoin");
  getBtcPrice("http://www.btctrade.com/api/ticker","btctrade");
 // getBtcPrice("http://www.btcclubs.com/api/ticker","btctrade");
  getBtcPrice("http://api.796.com/v3/futures/ticker.html?type=weekly","796");
  getHBPrice();
  //get796Price();
  getFxbtcPrice();
  /********LTC Price********/
  getLtcPrice("https://data.btcchina.com/data/ticker?market=ltccny","btcchina");
  getLtcPrice("https://www.okcoin.com/api/ticker.do?symbol=ltc_cny","okcoin");
  getHBLtcPrice();
  getFxbtcLtcPrice();
  getBtc38AltPrice("ltc");
  getLtcPrice("https://bter.com/api/1/ticker/ltc_cny","bter");
  
  //竞争币
  var altCoins = JSON.parse(localStorage["altDispArr"]);
  for (var i=0; i<altCoins.length; i++) {
    getBterAltPrice(altCoins[i]);
  }
  getBtc38AltPrice();
});
