function changeBackground(e) {
	e.preventDefault();

	const file = document.getElementById("newImage").files[0];

	if (file) {
		const reader = new FileReader();

		reader.onload = function (e) {
			const imageUrl = e.target.result;

			document.body.style.backgroundImage = "url('" + imageUrl + "')";
		};

		reader.readAsDataURL(file);
	}
}
