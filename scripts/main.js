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