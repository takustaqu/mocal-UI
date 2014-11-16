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

	$("#search-submit").click(function(){
		console.log("foo")
		
		$(".mainvis").slideUp("normal","swing",function(){
			$("#result").find(".card").each(function(i){
				var $target = $(this)
				
				setTimeout(function(){
					$target.addClass("active");
				},i*100)
				console.log(i);
			});
		})
		return false;
	})



var render = {
		asahiArticle:function(input){
			return "<h3>"+input.title + "</h3>" + 
			"<p>" + input.body + "</p>"
		},
		asahiWords:function(input){
			return "<ol><li>"+input[0]+"</li><li>"+input[1]+"</li><li>"+input[2]+"</li><li>"+input[3]+"</li><li>"+input[4]+"</li></ol>"
		}		
	}


$.ajax({
  type: "GET",
  url: "http://mocal.cloudapp.net/api/asahi?q=%E3%83%AF%E3%82%A4%E3%83%BB%E3%83%86%E3%82%A3%E3%83%BC%E3%83%BB%E3%82%A8%E3%83%AB%E3%83%BB%E3%82%B3%E3%83%BC%E3%83%9D%E3%83%AC%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3%E3%83%BB%E3%83%90%E3%83%BC%E3%83%8F%E3%83%83%E3%83%89&callback=foo",
  dataType: "JSON",
  success: function(json){
  	var $asahi = $("#asahi");

  	$asahi.find(".positive-article").append(render.asahiArticle(json.positiveArticle))
  	$asahi.find(".negative-article").append(render.asahiArticle(json.negativeArticle))
  	$asahi.find(".positive-word").append(render.asahiWords(json.positiveWord))
  	$asahi.find(".negative-word").append(render.asahiWords(json.negativeWord))
    
  }
});