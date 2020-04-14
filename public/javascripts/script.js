function deleteProfile() {
	fetch("http://localhost:3000/profile", {
		method: "delete",
		mode: "cors",
		credentials: "same-origin",
	}).then((response) => response.json());
}

function toggleCategories() {
	const box = document.querySelector(".search__categories");

	if (box.classList.contains("show")) {
		box.classList.remove("show");
		setTimeout(() => {
			box.style.display = "none";
		}, 300);
	} else {
		setTimeout(() => {
			box.classList.add("show");
		}, 0);
		box.style.display = "initial";
	}
}
