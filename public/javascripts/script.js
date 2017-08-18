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
		alert("User exists!");
		// await swal("Oops...", "User exists!", "error");
	});

	socket.on("user_registered", () => {
		alert("User registered! Please login");
		// swal("Time to make some $$$$", "User Registered!", "success");
	});

	socket.on("invalid_login", () => {
		alert("Invalid user credentials!");
		// swal("Oops...", "Invalid Login!", "error");
	});
});
