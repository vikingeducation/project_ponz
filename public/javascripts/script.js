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

	const socket = io.connect("http://localhost:3000");

	//  socket.on('happyStuff', (data) => {
	// 	console.log(data);
	// });

	socket.on("user_exists", () => {
		swal("Oops...", "User exists!", "error");
	});

	socket.on("user_registered", () => {
		swal("Time to make some $$$$", "User Registered!", "success");
	});

	socket.on("invalid_login", () => {
		swal("Oops...", "Invalid Login!", "error");
	});
});
