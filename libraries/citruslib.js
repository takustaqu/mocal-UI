//Citrus.lib "under the sea" by Orange Designworks [ow;d]

//fix "console.log problem" of InternetExplorer
if (!('console' in window)) {window.console = {};window.console.log = function(str){return str};}

var _c = new Object();

/* ########## Current Documents status ##########*/

//URLパラメーターをオブジェクトにして返す。
_c.parameter = (function(){
	var hash = new Array();
	var param;
	if(param = location.search){
		var parray = param.replace('?','').split('&');
		for(var i=0;i<parray.length;i++){
			var n = parray[i].split('=');
			hash[n[0]] = n[1];
		}
	}else{
		return false;
	}
	return hash;
})();

//デバイスの種別判定結果
_c.device = (function(){
	var result = {};

	if(_c.parameter.mode){
		var tmp = _c.parameter.mode.toLowerCase();
		if(tmp == "sp"){
			result = {platform:"forcemode",type:"phone"}
		}else if(tmp == "tab"){
			result = {platform:"forcemode",type:"tablet"}
		}else{
			result = {platform:"forcemode",type:"pc"}
		}
	}else {
		var _UA = navigator.userAgent;
		if (_UA.indexOf('iPhone') > -1 || _UA.indexOf('iPod') > -1) {
			result = {
				platform:"iOS",
				type:"phone"
			};
		}else if (_UA.indexOf('iPad') > -1 ) {
			result = {
				platform:"iOS",
				type:"tablet"
			};
		}else if(_UA.indexOf('Android') > -1){
			result.platform = "Android";

			result.type = (function(){
				var result;
				if (_UA.indexOf('Mobile') > 0){
					result = "phone";
				}else{
					result = "tablet";
				}
				return result;
			})()		
		}else{
			result.type = "pc"
		}
	}
	return result;
})();

//現在のページの文字コードを全大文字で返します。
_c.checkPageCharset=function(){
	var tmpCharset = "";
	if (document.all) {tmpCharset = document.charset;}
	else {tmpCharset = document.characterSet;}
	return tmpCharset.toUpperCase
}

_c.lang = (function(){
	
	//各ブラウザ内の言語ロケールを格納するオブジェクトを一通り辺り、存在するものから

	try {
		return (navigator.browserLanguage||navigator.language||navigator.userLanguage);
	} catch(e) {
		return undefined;
	}


})();



//動的ローディング
_c.load = function(filename,type,encode,callback){
	
	var _d = document;

    if (type == "css" || type == "CSS") {
    	var el = _d.createElement('link');
	        el.type = 'text/css';
	        el.rel  = 'stylesheet';
	        el.charset  = encode;
	        el.href = filename ;

    }else{
	    var el = _d.createElement('script');  
	        el.type = 'text/javascript';
	        el.async = true;
	        el.defer = true;
	        el.charset  = encode;
	        el.src = filename;
    }

    if(callback){
    	if ("onreadystatechange" in el) {
			el.onreadystatechange = function (e) {
				if (el.readyState === "loaded" || el.readyState === "complete") {
					return callback(e);
				}
			};
		} else {
			el.onload = callback;
		};	
    }
	_d.getElementsByTagName("head")[0].appendChild(el);

}


//簡易テンプレートエンジン。jQueryオブジェクトをそのままテンプレートに掛けれる。
_c.template = function($mainObj,template,$objArray){
    template = template.split("${").join("<span class='matchtarget' data-targetelm='").split("}").join("'></span>")
    $mainObj.html(template);
    $mainObj.find("span.matchtarget").each(function(){
	        var elm = $(this).data('targetelm').split(".");
	        var obj = $objArray;
	        for(i=0,il=elm.length;i<il;i++){
	            console.log(elm[i])
	            obj = obj[elm[i]]
	            console.log(obj)
	        }
	        $(this).before(obj).remove()
	    })
    return $mainObj;
};


//Viewportをいつもの設定でhead内に設定
_c.setViewport = function(){
	var meta = document.createElement('meta');
	meta.setAttribute('name', 'viewport');
	meta.setAttribute('content', 'width=initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, width=device-width, user-scalable=0');
	document.getElementsByTagName('head')[0].appendChild(meta);
}


/* #################### String control  ####################*/

//数値をカンマ区切りの文字列にして返す
_c.devideComma = function(value){
	var result = String(value).replace( /(\d)(?=(\d\d\d)+(?!\d))/g, '$1,' ); 
	return result;
	};

//指定桁数の0埋め
_c.padZero = function(value,length){
	var zero = (function(){var tmp = "";for(i=0;i<length;i++){tmp = tmp + "0";};return tmp;})();
	var tmp = (zero + value).slice(length*-1);
	return tmp;
	}


/* #################### Date-time  ####################*/

//date型を渡すと、現在の年月日からの逆算値をオブジェクトで返す。
_c.dayRemain = function(target,minus){
	var now = new Date();
	var tmp = target - now;

	tmphh = tmp%(1000*60*60*24);
	tmpmm = tmphh%(1000*60*60);
	tmpss = tmpmm%(1000*60);  

	result = {
		dd:parseInt(tmp/(1000*60*60*24)),
		hh:parseInt(tmphh/(1000*60*60)),
		mm:parseInt(tmpmm/(1000*60)),
		ss:parseInt(tmpss/(1000)),
	};


	if(!minus){
		if(result.dd < 0) result.dd = 0;
		if(result.hh < 0) result.hh = 0;
		if(result.mm < 0) result.mm = 0;
		if(result.ss < 0) result.ss = 0;
	}

	return result;
	};


//日付をパースして、オブジェクトで返します。
_c.parseDate = function(input){
		/*
		日付をある程度ラフに扱えるよう、通すとYYYY,MM,DDを分離してオブジェクトにして戻します。
		YYYY-MM-DDであったり、YYYYMMDDであったり、YYMMDDであったり、YYYY/MM/DDであったりをある程度を吸収します。

		yy: , mm: , dd: - それぞれ日付をスライスして、数値として返します。ddが存在しない場合はfalseになります。
		padZero > yy: , mm: , dd: - それぞれ日付を0パティングして文字列として返します。DDが未指定の場合は00で返します。
		flatten : YYYYMMDDを8桁の数値として返します。
		gap : 使いがちなのでここに加えています。現在の日付からのギャップを返します。過去の場合はマイナス値になります。
		      日付系による計算ではなくあくまで8ケタの整数に直した上での差異を見ているので、日数の差異を正確に計るのには不向きです。
		      また例外としてdd指定の無い日付を渡された場合は、末尾2桁を双方共に0とみなして差を取るため、日数では無く
		      開いている月*100を返します。


		※あくまで引き渡しの推奨形式はハイフン区切りのYYYYMMDD形式です。
		*/

		var result = {};

		if (input.match(/[0-9]*[\-/][0-9]*[\-/][0-9]*/i)){
		//YYYY-MM-DD型全般、スラッシュまたはハイフン区切りでマッチ　/[0-9]*[\-/][0-9]*[\-/][0-9]*/　でマッチ

			var sliced = $.grep(input.match(/[0-9]*/g), function(e){return e !== "";});
			result.yy = sliced[0];
			result.mm = sliced[1];
			result.dd = sliced[2];

		}else if (input.match(/[0-9]*[\-/][0-9]*/i)){
		//YYYY-MM-DD型全般、スラッシュまたはハイフン区切りでマッチ　/[0-9]*[\-/][0-9]*[\-/][0-9]*/　でマッチ

			var sliced = $.grep(input.match(/[0-9]*/g), function(e){return e !== "";});
			result.yy = sliced[0];
			result.mm = sliced[1];

		}else if(input.match(/[0-9]{8}/i)){
			result.yy = input.slice(0,4);
			result.mm = input.slice(4,6);
			result.dd = input.slice(6,8);

		}else if(input.match(/[0-9]{6}/i)){
			//6文字区切り無しは、YYMMDD形式とみなす。
			result.yy = input.slice(0,2);
			result.mm = input.slice(2,4);
			result.dd = input.slice(4,6);
		}else{
			return false;
		}

		result.yy = parseInt(result.yy);
		result.mm = parseInt(result.mm);
		result.dd = parseInt(result.dd);

		result.padZero = {};
		result.padZero.yy = ("0"+result.yy).slice(-4);
		result.padZero.mm = ("0"+result.mm).slice(-2);
		result.padZero.dd = ("0"+result.dd).slice(-2);

		result.strings = {month:(function(mm){

			var tmp = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

			return tmp[mm-1];

			})(result.mm)}


		var tmpNow = {};
		tmpNow.nowDate = new Date();
		tmpNow.yy = tmpNow.nowDate.getFullYear();
		tmpNow.mm = ("0"+(tmpNow.nowDate.getMonth()+1)).slice(-2);
		tmpNow.dd = ("0"+tmpNow.nowDate.getDate()).slice(-2);

		if (isNaN(result.dd)) {
			result.dd = false;
			result.padZero.dd = "00";
			tmpNow.dd = "00";
		};	

		result.flatten = result.padZero.yy + result.padZero.mm + result.padZero.dd;
		tmpNow.flatten = parseInt(tmpNow.yy + tmpNow.mm + tmpNow.dd);

		result.gap = parseInt(result.flatten) - tmpNow.flatten;

		return result;
	}

//HHMMなどの時間をパースして、オブジェクトで返します。
_c.parseTime=function(input){
		console.log(input)
		var result = {};
		var sliced = $.grep(input.match(/[0-9]*/g), function(e){return e !== "";});
		
		if (sliced.length == 1){
			if(sliced[0].length == 0){
				return false;
			}else{
				result.hh = sliced[0].slice(0,2)
				result.mm = sliced[0].slice(2,4)
			}
		}else if(sliced.length == 2){
			result.hh = sliced[0];
			result.mm = sliced[1];
		}
		result.padZero = {};
		result.padZero.hh = ("0"+result.hh).slice(-2);
		result.padZero.mm = ("0"+result.mm).slice(-2);
		result.flatten = result.padZero.hh + result.padZero.mm;
		return result;
	},


/* ## ものぐさツールその１・指定範囲でランダムに返す。第2引数にtrueを指定すると、先頭から0埋めしてくれます##*/
_c.dice = function(range,withPadding){
	var tmp = Math.floor(Math.random() * range);
	if(withPadding){
		tmp = _c.padZero(tmp,(range+"").length);
	}
	return tmp;
	}



/* #################### Form-elements support ####################*/

//一定の範囲の連続したoption>selectを生成してjQueryオブジェクトとして返す。
_c.$generateOptionList = function(range,param){

		var defaults = {
			caption:{
				zeroPadding : false, //先頭を0パディングするかどうか
				withComma : false,
				setLength:"auto", //桁数を予約。0パディング時に未指定の場合、最大値を自動検出。
				step:1, //1段階進める毎に増やす数値　(1,2,3 や、 0 5 10 15等)
				prefix:"", //値の接頭辞を指定。(No.---等)
				suffix:""  //値の接尾辞 (--日 , --円等)
			},
			value:{
				zeroPadding : false, //先頭を0パディングするかどうか
				withComma : false,
				setLength:"auto", //桁数を予約。0パディング時に未指定の場合、最大値を自動検出。
				step:1, //1段階進める毎に増やす数値　(1,2,3 や、 0 5 10 15等)
				prefix:"", //値の接頭辞を指定。(No.---等)
				suffix:""  //値の接尾辞 (--日 , --円等)
			},
			outputElem:$("<select />")

		}
		var intnlOpt = {};

		var options=$.extend(true,defaults, param);


		if(range instanceof Array){
			intnlOpt.range = [parseInt(range[0]),parseInt(range[1])];
		}else{
			intnlOpt.range = [0,parseInt(range)];
		};

		var result = $();

		intnlOpt.captionMaxLength = ((intnlOpt.range[1] * options.caption.step)+"").length;
		intnlOpt.valueMaxLength = ((intnlOpt.range[1] * options.value.step)+"").length;

		intnlOpt.zeroPadPlaceholderCapt = "";
		intnlOpt.zeroPadPlaceholderValue = "";

		if ((options.caption.setLength == "auto")||(options.caption.setLength < intnlOpt.captionMaxLength)){
			options.caption.setLength = intnlOpt.captionMaxLength;
			for(i=0,il=options.caption.setLength;i<il;i++){
				intnlOpt.zeroPadPlaceholderCapt = intnlOpt.zeroPadPlaceholderCapt + "0";
			}
		}

		if ((options.value.setLength == "auto")||(options.value.setLength < intnlOpt.valueMaxLength)){
			options.value.setLength = intnlOpt.valueMaxLength;
			for(i=0,il=options.value.setLength;i<il;i++){
				intnlOpt.zeroPadPlaceholderValue = intnlOpt.zeroPadPlaceholderValue + "0";
			}
		}


		for(i=0,il=(intnlOpt.range[1]-intnlOpt.range[0]);i<il;i++){

			if(options.caption.zeroPadding){
				var captResult = (intnlOpt.zeroPadPlaceholderCapt+((i+intnlOpt.range[0])*options.caption.step)).slice(options.caption.setLength*-1);
			}else{
				var captResult = options.caption.step*(i+intnlOpt.range[0]);
			}

			if(options.caption.withComma){
				captResult = _c.devideComma(captResult);
			}

			var tmpCaption = options.caption.prefix + captResult + options.caption.suffix;


			if(options.value.zeroPadding){
				var valResult = (intnlOpt.zeroPadPlaceholderValue+((i+intnlOpt.range[0])*options.value.step)).slice(options.value.setLength*-1)
			}else{
				var valResult = options.value.step*(i+intnlOpt.range[0]);
			}

			if(options.value.withComma){
				valResult = _c.devideComma(valResult);
			}

			var tmpValue = options.value.prefix + valResult + options.value.suffix;
			
			var appendElm = $("<option />").val(tmpValue).html(tmpCaption);

			options.outputElem.append(appendElm);

		};

		return options.outputElem;
		};

//特定の要素の配下のチェックボックスの状態をブール型で示し、nameをキーにオブジェクトを生成して返します。
_c.checkboxToBool = function($target){
		var result = {};
		$target.find("input").each(function(){result[$(this).attr("name")] = $(this).prop("checked");});
		return result;
	}




/* #################### Touch control supports ####################*/

//タッチサポート支援
_c.touch = function(elem,options){
	this.stats = {
		// start:[{x:0,y:0,timing:0}],
		emulate:false
	}

	if(this.type == "touch"){

		elem.addEventListener("touchstart", function(){

			console.log("isTouched")

		}, false);

	}else if(this.type == "ms"){

		 // ホールドビジュアルの無効化
		elem.addEventListener("MSHoldVisual", function(e) {e.preventDefault();}, false);
		// コンテクストメニューの無効化
		elem.addEventListener("contextmenu", function(e) {e.preventDefault();}, false);

		elem.addEventListener("touchstart", function(){

			console.log("isTouched")

		}, false);
	}
}
	//_c.touch.typeで、デバイスのタッチAPIの種別を取得できるようにする。
	_c.touch.prototype.type = (function(){if(navigator.msPointerEnabled){return "ms";}else if("ontouchstart" in window){return "touch";}else{return "mouse";}})();


		// jQuery plugins

//tap
(function(a){a.fn.tap=function(b){return this.each(function(){a(this).on("touchstart touchmove touchend click",function(c){if("touchstart"==c.type){a(this).data("isTouch",true)}if("touchmove"==c.type){a(this).data("isTouch",false)}if(a(this).data("isTouch")){c.preventDefault();a(this).data("isTouch",false);return b.call(this)}if("click"==c.type){return b.call(this)}})})}})(jQuery);


 
