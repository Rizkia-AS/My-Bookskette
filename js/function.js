// FUNCTION MODULE



function checkStorage() {
	return typeof(Storage) !== `undefined`;
}


function writeData(title,author,year,isComplete) {
	const form = new cForm(title,author,year,isComplete);
	bookList.unshift(form);
}


function upData(data, formState) {
	if(formState == `true` || formState == true) {
		localStorage.setItem(LSReadKey, JSON.stringify(data));
	} else { localStorage.setItem(LSUnreadKey, JSON.stringify(data)); }
}


function loadData(State) {
	if(State == true || State == `true`) {
		return JSON.parse(localStorage.getItem(LSReadKey))
	} else { return JSON.parse(localStorage.getItem(LSUnreadKey)) }
}


function activeLibraryState() {
	return sessionStorage.getItem(SSLibraryStateKey);
}


function renderLibrary(dataIntern) {
	let data = null;

	if(dataIntern != undefined && dataIntern.length > 0) { data = dataIntern; }
	else { data = loadData(activeLibraryState()); }

	if(data) {
	const bookHTML = data.map(book => 
	`<div class="book" data-id="${book.id}" data-status="${book.isComplete}">
		<h3>${book.title}</h3>
		<article>
			<p>Author : <span>${book.author}</span></p>
			<p>Year : <span>${book.year}</span></p>
		</article>
		<div class="book-settings">
			<span class="material-icons">delete</span>
			<span class="material-icons">edit</span>
			${(() => {
				if(book.isComplete === true) {return `<span class="material-icons">restore</span>` }
				return `<span class="material-icons">done</span>`
			})()}
		</div>
	</div>`).join(``)

	books.innerHTML = bookHTML || `<div class="book"><h3>No books saved yet</h3></div>`;

	} else { books.innerHTML = `<div class="book"><h3>No books saved yet</h3></div>` }
}


function deleteBook(target, status) {
	const data = loadData(status);

	let pos = null;
	for(let i = 0; i < data.length; i++) {
		if(data[i].id === parseInt(target)) { pos = i; }
	}

	data.splice(pos,1);
	upData(data,status);
}


function editBook(target, status) {
	const data = loadData(status);

	let pos = null;
	for(let i = 0; i < data.length; i++) {
		if(data[i].id === parseInt(target)) { pos = i; }
	}

	frTitle.value = data[pos].title;
	frAuthor.value = data[pos].author;
	frYear.value = data[pos].year;
	
	renewAnim(frTitle);
	renewAnim(frAuthor);
	renewAnim(frYear);

	data.splice(pos,1);
	upData(data,status);
}


function renewAnim(element) {
	element.classList.add(`changeAnim`);
		setTimeout(()=> { 
			element.classList.remove(`changeAnim`);
		},200)
}


function exchange(target, status) {
	const state = JSON.parse(status);
	const dataOrigin = loadData(state);
	dataDN = loadData(!state);

	let pos = null;
	for(let i = 0; i < dataOrigin.length; i++) {
		if(dataOrigin[i].id === parseInt(target)) {
			pos = i;
		}
	}

	covertBeforeExchange(dataOrigin[pos]);
	dataDN.unshift(dataOrigin[pos]);
	upData(dataDN,!state);
	dataOrigin.splice(pos,1);
	upData(dataOrigin,state);
}


function covertBeforeExchange(data) {
	data.isComplete = !data.isComplete;
}



function csDialog(title, message) {
	const modal = document.querySelector(`.modal`);
	const h3 = modal.querySelector(`.cs-dialog h3`);
	const p = modal.querySelector(`.cs-dialog p`);
	const oke =  document.querySelector(`.ok-button`);
	const cancel = document.querySelector(`.cancel-button`);
	modal.classList.add(`modal-on`);
	h3.innerText = title;
	p.innerText = message;


	oke.classList.add(`button-on`);
	oke.addEventListener(`click`, function() {stopCsDialog();})
}


function stopCsDialog() {
	const modal = document.querySelector(`.modal`);
	modal.classList.remove(`modal-on`);
} 