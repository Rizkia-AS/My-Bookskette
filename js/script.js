// awal inisialisasi variabel global
const container = document.querySelector(`.container`);
const books = document.querySelector(`.books`);


const reg = document.querySelector(`form`);
const frTitle = document.querySelector(`.title`);
const frAuthor = document.querySelector(`.author`);
const frYear = document.querySelector(`.year`);
const frIsComplete = document.querySelector(`.isComplete`);
const selectLibrary = document.querySelector(`.drop-down`);
const searchInput = document.querySelector(`.search`);


const unreadBtn = document.querySelector(`.unread`);
const readBtn = document.querySelector(`.read`);


const LSUnreadKey = `LSUnreadKey`;
const LSReadKey = `LSReadKey`;
const SSLibraryStateKey = `SSLibraryStateKey`
// akhir inisialisasi variabel global



//awal struktur data
function cForm(title,author,year,isComplete) {
	this.id = new Date().getTime();
	this.title = title;
	this.author = author;
	this.year = parseInt(year);
	this.isComplete = isComplete;
}
//akhir struktur data



// awal load event
let bookList = [];
window.addEventListener(`load`, function() {

	if(checkStorage()) {
		if(loadData(activeLibraryState()) !== null) {
			bookList = loadData(activeLibraryState());
			renderLibrary();
		} else {
			bookList = [];
			renderLibrary(); 
		}

		if(sessionStorage.getItem(SSLibraryStateKey) !== null) {
			if(activeLibraryState() == true || activeLibraryState() == `true`) {
				selectLibrary.value = `read`;
				readBtn.classList.add(`active`);
				unreadBtn.classList.remove(`active`);
				searchInput.setAttribute(`placeholder`, `Search in read`)
			} 
			else {
				selectLibrary.value = `unread`;
				unreadBtn.classList.add(`active`);
				readBtn.classList.remove(`active`);
				searchInput.setAttribute(`placeholder`, `Search in Unread`);
			}

			renderLibrary();
		} else {
			unreadBtn.classList.add(`active`);
			selectLibrary.value = `unread`;
		}
	}
})
// akhir load event



// awal click event
container.addEventListener(`click`, function(e) {
	const p = e.target;

	if(p.innerText == `Unread`) {
		unreadBtn.classList.add(`active`);
		readBtn.classList.remove(`active`);
		sessionStorage.setItem(SSLibraryStateKey, false);

		searchInput.setAttribute(`placeholder`, `Search in Unread`)
		renderLibrary();
	}

	if(p.innerText == `Read`) {
		readBtn.classList.add(`active`);
		unreadBtn.classList.remove(`active`);
		sessionStorage.setItem(SSLibraryStateKey, true);

		searchInput.setAttribute(`placeholder`, `Search in read`)
		renderLibrary();
	}

	if(p.innerText == `delete`){
		const bookData = p.parentNode.parentNode.dataset;
		deleteBook(bookData.id, bookData.status);
		renderLibrary();
		csDialog(`Attention !`,`The book has been deleted`);
	}

	if(p.innerText == `done` || p.innerText == `restore`){
		const bookData = p.parentNode.parentNode.dataset;
		exchange(bookData.id, bookData.status);
		renderLibrary();
		csDialog(`Attention !`,`The book has been moved`);
	}

	if(p.innerText == `edit`){
		window.scrollTo(0,0);
		const bookData = p.parentNode.parentNode.dataset;
		editBook(bookData.id, bookData.status);
		renderLibrary();
	}
})
// akhir click event



// awal change event
selectLibrary.addEventListener(`change`, function() {
	let state = null;
	if(selectLibrary.value === `read`) {
		searchInput.setAttribute(`placeholder`, `Search in read`)
		state = true;  
	} else {
		searchInput.setAttribute(`placeholder`, `Search in Unread`)
		state = false; 
	}

	sessionStorage.setItem(SSLibraryStateKey,state);
	renderLibrary();
})
// akhir change event



// awal submit event
reg.addEventListener(`submit`, function(e) {
	e.preventDefault()

	bookList = loadData(frIsComplete.checked) || [];
	writeData(frTitle.value, frAuthor.value, frYear.value, frIsComplete.checked);
	upData(bookList,frIsComplete.checked);
	renderLibrary();

	frTitle.value = ``;
	frAuthor.value = ``;
	frYear.value = ``;
	frIsComplete.checked = false;
})
// akhir submit event



// awal input event
searchInput.addEventListener(`input`, function(e) {
	const data = loadData(activeLibraryState())
	let searchResult = [];

	for(let i = 0; i < data.length; i++) {
		if(data[i].title.includes(searchInput.value || !``) ) {
			searchResult.unshift(data[i]);  } 
	}

	if(searchResult[0] == undefined && searchInput.value != ``) {
		searchInput.classList.add(`search-not-found`);
		setTimeout(()=> {
			searchInput.classList.remove(`search-not-found`);
		},200)
	}

	renderLibrary(searchResult);
})
// akhir input event



// tambahan
frYear.setAttribute(`min`,1000);
frYear.setAttribute(`max`, new Date().getFullYear());
frYear.setAttribute(`placeholder`, `1000 - ${new Date().getFullYear()}`)