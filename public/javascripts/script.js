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

	const socket = io.connect('http://localhost:3000');

  socket.on('happyStuff', (data) => {
		console.log(data);
	});
});
