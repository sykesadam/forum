const uri = "http://localhost:3000/";

async function deleteProfile() {
	let action = await fetch(uri + "profile", {
		method: "delete",
		mode: "cors",
		credentials: "same-origin",
	});
	let data = await action.json();
	console.log(data);
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
function search() {
	const searchInput = document.querySelector(".search__input");
	const li = document.createElement("li");
	const box = document.querySelector(".search__results");
	const ul = box.querySelector("ul");

	searchInput.addEventListener("keyup", (e) => {
		if (searchInput.value.length > 0) {
			setTimeout(() => {
				box.classList.add("show");
			}, 0);
			box.style.display = "initial";
			const data = fetchSearch(searchInput.value);
			console.log(data);
			// data.forEach((d) => {
			ul.appendChild(li).innerText = data;
			// });
		} else {
			box.classList.remove("show");
			setTimeout(() => {
				box.style.display = "none";
			}, 300);
		}
	});
}
search();
// mass problem här med grejer.
function fetchSearch(searchvalue) {
	fetch(uri + "search/" + searchvalue, {
		method: "get",
		mode: "no-cors",
		credentials: "same-origin",
	}).then((response) => {
		return response.json();
	});
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

async function deletePost(id) {
	let response = await fetch(uri + "posts/" + id, {
		method: "DELETE",
	});
	let data = await response.json();

	console.log(data);
}
