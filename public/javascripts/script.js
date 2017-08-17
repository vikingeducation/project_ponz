$(() => {
	$(".signin").hide();
	$(".side-section").on("click", ".register-link", function(e) {
		$(".signin").hide();
		$(".signup").show();
	});

	$(".side-section").on("click", ".login-link", function(e) {
		$(".signin").show();
		$(".signup").hide();
	});
});
