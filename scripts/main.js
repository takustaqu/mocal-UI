
//Search-form
var query = "";


$(function(){


(function(){

	$searchInput = $("#search-input");	
	$searchInput.on({
		"focusin":function(){
			$("#search-area .inputbox").addClass("inputed active");
		},
		"focusout":function(){
			if($(this).val() == ""){
				$("#search-area .inputbox").removeClass("inputed");
			}
			$("#search-area .inputbox").removeClass("active");
		}
	})

	

	$("#search-form").on({
		"submit":function(){
			$(".mainvis").slideUp("normal","swing",function(){
				$("#result").find(".card").each(function(i){
					var $target = $(this)
					setTimeout(function(){
						$target.addClass("active");
					},i*100)
					console.log(i);
				});

				


			});


			query = $("#search-input").val();
			if(query.match(/\ \([0-9]*[\ ,]( )?[0-9]*\)/i)){
				$(this).attr("data-currentquery",query.split(" ")[0])
			}else{
				$(this).attr("data-currentquery",query)
			}


			$.ajax({
			  type: "GET",
			  url: "http://mocal.cloudapp.net/api/asahi?q="+encodeURI($("#search-form").attr("data-currentquery")),
			  dataType: 'json',
			  success: function(json){
			  	console.log(json)
			  	var $asahi = $("#asahi")
			  	$asahi.find(".positive-article").append(render.asahiArticle(json.positiveArticle))
			  	$asahi.find(".negative-article").append(render.asahiArticle(json.negativeArticle))
			  	$asahi.find(".positive-word").append(render.asahiWords(json.positiveWord))
			  	$asahi.find(".negative-word").append(render.asahiWords(json.negativeWord))
			    
			  }
			});

			$.ajax({
			  type: "GET",
			  url: "http://mocal.cloudapp.net/api/companyDetail?q="+encodeURI($("#search-form").attr("data-currentquery")),
			  dataType: 'json',
			  success: function(json){
			  	var $result = $("#result")
				var $ul = $("<ul />").addClass()
				console.log($("#result").find(".name"))
				$ul.append('<li class="name">'+ json.name +' <small class="badge">証券番号:'+ json.stock_code +'</small></li>');
				$ul.append('<li class="stockPrice">&yen;'+_c.devideComma(json.price)+' <small class="timestamp">0000/00/00 00:00現在</small></li>');
				$ul.append('<li><div class="">▼</div></li>');
				$("#overview .card").append($ul);
			  }
			});

			$.ajax({
			  type: "GET",
			  url: "http://mocal.cloudapp.net/api/social?q="+encodeURI($("#search-form").attr("data-currentquery")),
			  dataType: 'json',
			  success: function(json){
			  	//{positiveComment: null, negativeComment: null, socialTrend: Object}
			  	console.log(json)
			  	// $asahi.find(".positive-article").append(render.asahiArticle(json.positiveArticle))
			  	// $asahi.find(".negative-article").append(render.asahiArticle(json.negativeArticle))
			  	// $asahi.find(".positive-word").append(render.asahiWords(json.positiveWord))
			  	// $asahi.find(".negative-word").append(render.asahiWords(json.negativeWord))
			    
			  }
			});


			$("#judgements").find(".graph").each(function(){
			var geom = {
			w:$(this).children("img").width(),
			h:$(this).children("img").height()
			}
			$(this).children("img").css("opacity",0)
			$(this).children("canvas").width(geom.w).width(geom.h).css({"top":0,"left":0,"position":"absolute"})
			})
			var doughnutData = [
			{value: 30,color:"#aaf2fb"},
			{value: 50,color: "#ffb6b9"},
			{value: 120,color: "#ffe361"},
			{value: 170,color: "#fbaa6e"},
			{value: 70,color: "#A8BECB"}];


			$("canvas.chart").each(function(){
			var myDoughnut = new Chart($(this)[0].getContext("2d")).Doughnut(doughnutData);
			})

			return false;
		}
	})

})()//Search-form


var render = {
		asahiArticle:function(input){
			return "<h3>"+input.title + "</h3>" + 
			"<p>" + input.body + "</p>"
		},
		asahiWords:function(input){
			return "<ol><li>"+input[0]+"</li><li>"+input[1]+"</li><li>"+input[2]+"</li><li>"+input[3]+"</li><li>"+input[4]+"</li></ol>"
		}		
	}





})//ready