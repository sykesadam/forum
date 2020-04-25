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

function timeSince(date) {
	const seconds = Math.floor((new Date() - date) / 1000);

	let interval = Math.floor(seconds / 31536000);

	if (interval > 1) {
		return interval + " years";
	}
	interval = Math.floor(seconds / 2592000);
	if (interval > 1) {
		return interval + " months";
	}
	interval = Math.floor(seconds / 86400);
	if (interval > 1) {
		return interval + " days";
	}
	interval = Math.floor(seconds / 3600);
	if (interval > 1) {
		return interval + " hours";
	}
	interval = Math.floor(seconds / 60);
	if (interval > 1) {
		return interval + " minutes";
	}
	return Math.floor(seconds) + " seconds";
}

function dateFormat() {
	const dates = document.querySelectorAll(".date");

	dates.forEach((date) => {
		date.innerText = timeSince(new Date(date.innerText)) + " ago";
	});
}

dateFormat();
