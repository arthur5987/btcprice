var id=0;

function saveOptions(){
	//get rules from table
	var rules={};
	var hasError = false;
	
	var rows = $("#rulesTable .tableRow");
	for (var i = 0; i < rows.length; i++) {
		var row=rows[i];
		var idSuffix=row.id.substr(7);
		var rule={};
		//console.log("ID:"+$("[name='coinName']",row)[0].id);
		rule.coinName=$("[name='coinName']",row)[0].value;
		rule.platform=$("[name='platform']",row)[0].value;
		rule.onPrice=$("[name='onPrice']",row)[0].value;
		rule.belowPrice=$("[name='belowPrice']",row)[0].value;
		//判断输入格式是否正确
		if(rule.coinName in coinNameInfo){
			$("#coinName"+id).parent().removeClass('has-error');
		}else{
			hasError = true;
			$("#coinName"+id).parent().addClass('has-error');
		}
			
		if(rule.platform in platNameInfo){
			$("#platform"+id).parent().removeClass('has-error');
		}else{
			hasError = true;
			$("#platform"+id).parent().addClass('has-error');
		}
		
		var hexStrReg=/^\d+$/;
		if(!hexStrReg.test(rule.onPrice)){
			hasError = true;
			$("#onPrice"+id).parent().addClass('has-error');
		}else
			$("#onPrice"+id).parent().removeClass('has-error');
		
		if(!hexStrReg.test(rule.belowPrice)){
			hasError = true;
			$("#belowPrice"+id).parent().addClass('has-error');
		}else
			$("#belowPrice"+id).parent().removeClass('has-error');
		rules["newRule"+i]=rule;
	}
	if (!hasError){
		localStorage["priceNotification"]=JSON.stringify(rules);
		$("#status").html("<div class='alert alert-success'>"+
			" 保存成功.</div>");
		setTimeout(function() {
		  $("#status").html("");
		}, 3500);
	}
	else{
		$("#status").html("<div class='alert alert-danger'>"+
			"保存失败，请检查输入错误.</div>");
	}
	
	//console.log(localStorage["priceNotification"]);
	// localStorage["warningBtcPrice"] = $("#priceBox").val();
	// console.log($("#priceBox").val());	
	
	
}

function newPriceRow(){
	//console.log("BBB");
	id++;

	var coinOptionsHtml='<option value ="null">please select</option>';
	var platOptionsHtml='<option value ="null">please select</option>';
	for(coinType in relationInfo){
		coinOptionsHtml+='<option value ="'+coinType+'">'+coinNameInfo[coinType]+'</option>';
	}
	var templateRow= '<tr class="tableRow" id="ruleRow'+id+'">'+
        '<td><select name="coinName" class="form-control" id="coinName'+id+'">'+coinOptionsHtml+'</select></td>'+
        '<td><select name="platform" class="form-control" id="platform'+id+'">'+platOptionsHtml+'</select></td>'+
        '<td><input name="belowPrice" class="form-control" id="belowPrice'+id+'" /></td>'+
        '<td><input name="onPrice" class="form-control" id="onPrice'+id+'" /></td>'+
        '<td><button class="btn btn-primary" id="delRule'+id+'">删除</button></td>'+
      '</tr>';
	var table = $("#rulesTable");
	table.append(templateRow);
	$("#coinName"+id).change(coinTypeChange);
	$("#delRule"+id).click(deleteRule);

	if (arguments.length == 1) {
		//console.log("ARGS");
		var rule=arguments[0];
		//console.log("rule:"+JSON.stringify(rule))
		$("#coinName"+id).val(rule.coinName);
		$("#coinName"+id).change();
		$("#platform"+id).val(rule.platform);
		$("#onPrice"+id).val(rule.onPrice);
		$("#belowPrice"+id).val(rule.belowPrice);
       // return arguments[0] + arguments[1];
    }
}

function coinTypeChange(){
	//console.log("coin type change!");
	//console.log(this.value);
	var idSuffix=this.id.substr(8);
	$("#platform"+idSuffix).removeAttr("disabled");
	var platOptionsHtml='<option value ="null">please select</option>';
	for(platform in relationInfo[this.value]){
		platOptionsHtml+='<option value ="'+relationInfo[this.value][platform]+'">'+platNameInfo[relationInfo[this.value][platform]]+'</option>';
	}
	$("#platform"+idSuffix).html(platOptionsHtml);
}

function deleteRule(){
	var idSuffix=this.id.substr(7);
	$("#ruleRow"+idSuffix).remove();
}

//保存显示设置
function dispSaveOptions(){
	var selectedAlt = [];
	var altNodes = $("#altSelection").children("input");
	//console.log($("#btcDisp").prop("checked"));
	
	if ($("#btcDisp").prop("checked") || $("#ltcDisp").prop("checked") || $("#altDisp").prop("checked")){
		localStorage["btcDisp"] = $("#btcDisp").prop("checked");
		localStorage["ltcDisp"] = $("#ltcDisp").prop("checked");
		localStorage["altDisp"] = $("#altDisp").prop("checked");
		if ($("#altDisp").prop("checked")) {
			for (var i = 0; i < altNodes.length; i++){
				if (altNodes[i].checked)
				  	selectedAlt.push(altNodes[i].value);
			}
			localStorage["altDispArr"] = JSON.stringify(selectedAlt);
			//console.log(localStorage["altDispArr"]);		
		}
		$("#dispStatus").html("<div class='alert alert-success'>"+
			" 保存成功.</div>");
		setTimeout(function() {
		  $("#dispStatus").html("");
		}, 3500);
	}
	else{
		$("#dispStatus").html("<div class='alert alert-danger'>"+
			"至少选择一个显示币种.</div>");
	}
	localStorage["badgeCoin"] = $("#dispCoinName").val();
	localStorage["badgePlat"] = $("#dispPlatform").val();
}

function altCkeckBoxClick(){
	if ($(this).prop("checked"))
		$("#altSelection").show();
	else
		$("#altSelection").hide();
}

function initBadgeDisp(){

	var coinOptionsHtml='';
	var platOptionsHtml='';
	for(coinType in relationInfo){
		coinOptionsHtml+='<option value ="'+coinType+'">'+coinNameInfo[coinType]+'</option>';
	}
	$("#dispCoinName").html(coinOptionsHtml);
	$("#dispPlatform").html(platOptionsHtml);
	$("#dispCoinName").change(dispCoinTypeChange);

	$("#dispCoinName").val(localStorage["badgeCoin"]);
	$("#dispCoinName").change();
	$("#dispPlatform").val(localStorage["badgePlat"]);
       // return arguments[0] + arguments[1];
//    }
}

function dispCoinTypeChange(){
	//console.log("coin type change!");
	//console.log(this.value);
	$("#dispPlatform").removeAttr("disabled");
	var platOptionsHtml='';
	for(platform in relationInfo[this.value]){
		platOptionsHtml+='<option value ="'+relationInfo[this.value][platform]+'">'+platNameInfo[relationInfo[this.value][platform]]+'</option>';
	}
	$("#dispPlatform").html(platOptionsHtml);
}

$(document).ready(function(){
	//console.log("from:"+localStorage["fromPopup"]);
	if (localStorage["fromPopup"] == "true") {
		$(".active").removeClass("active");
		$("#dispTab").addClass("active");
		$("#display").addClass("active");
		localStorage["fromPopup"] = "false";
	}
	$("#saveBtn").click(saveOptions);
	$("#addPriceRuleBtn").click(newPriceRow);
	$("#dispSaveBtn").click(dispSaveOptions);
	$("#altDisp").click(altCkeckBoxClick);
	var rules={};
	if (localStorage["priceNotification"]){
		rules=JSON.parse(localStorage["priceNotification"]);
		for (key in rules){
			//console.log(key);
			newPriceRow(rules[key]);
		}	
	}
	//显示设置
	var altStr = "";
	var altNodes = JSON.parse(localStorage["altDispArr"]);
	if (localStorage["btcDisp"] == "true")
		$("#btcDisp").attr("checked",'true');
	if (localStorage["ltcDisp"] == "true")
		$("#ltcDisp").attr("checked",'true');
	if (localStorage["altDisp"] == "true")
		$("#altDisp").attr("checked",'true');
	else
		$("#altSelection").hide();
	for (key in coinNameInfo){
		if (key != "btc" && key != "ltc"){
			var checkedStr = '';
			if ($.inArray(key, altNodes) != -1)
				checkedStr = 'checked';
			altStr += ' <input type="checkbox" name="' + key + 'Disp" value="' + key + '"' + checkedStr +'>' + coinNameInfo[key];			
		}	
	}
	//console.log("altStr:"+altStr);
	$("#altSelection").html(altStr);
	
	initBadgeDisp();
});
