const modal = document.getElementById('modal');
const modalShow = document.getElementById('show-modal');
const modalClose = document.getElementById('close-modal');
const bookmarkForm = document.getElementById('bookmark-form');
const websiteNameEl = document.getElementById('website-name');
const websiteUrlEl = document.getElementById('website-url');
const bookmarksContainer = document.getElementById('bookmarks-container');

const itemTemplate = `<div class="item">
    <i class="fas fa-times" title="Delete Bookmark" onclick="deleteBookmark('{{favUrl}}')"></i>
    <div class="name">
        <img src="https://www.google.com/s2/favicons?domain={{ favUrl }}" alt="Favicon">
        <a href="{{ favUrl }}" target="_blank">{{favName}}</a>
    </div>
</div>`;

const templateScript = Handlebars.compile(itemTemplate);
let bookmarks = {};

// Show Modal, Focus on Input 
function showModal() {
    modal.classList.add('show-modal');
    websiteNameEl.focus();
}

// Modal Event Listeners
modalShow.addEventListener('click', showModal);
modalClose.addEventListener('click', ()=> modal.classList.remove('show-modal'));
window.addEventListener('click', (e) => (e.target === modal ? modal.classList.remove('show-modal') : false));

// Validate Form 
function validate(nameValue, urlValue) {
    const expression = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
    const regex = new RegExp(expression);
    if (!nameValue || !urlValue) {
        alert('Please submit values for both fields.');
        return false;
    }
    if (!urlValue.match(regex)) {
        alert("Please provide a valid web address");
        return false;
    }
    return true;
}

// Build Bookmarks DOM
function buildBookmarks() {
    bookmarksContainer.textContent = '';

    Object.keys(bookmarks).forEach((id) => {
        const { name, url } = bookmarks[id];
        const favContext = {
            favName : name,
            favUrl : url,
        };
        let itemHtml = templateScript(favContext);
        bookmarksContainer.insertAdjacentHTML('beforeend', itemHtml);
    });
}

function fetchBookmarks() {
    // Get bookmarks from localstorage if available
    if (localStorage.getItem('bookmarks')) {
        bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    } else {
		const id = `https://github.com/andreim112`
		bookmarks[id] = {
			name: 'GitHub',
			url: 'https://github.com/andreim112',
		}
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    }
    buildBookmarks();
}

function deleteBookmark(id) {
	if (bookmarks[id]) {
		delete bookmarks[id];
	}
	
	localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
	fetchBookmarks();
}

function storeBookmark(e) {
    e.preventDefault();
    const nameValue = websiteNameEl.value;
    let urlValue = websiteUrlEl.value;
    if (!urlValue.includes('https://') && !urlValue.includes('http://')) {
        urlValue = `https://${urlValue}`; 
    }
    
    if (!validate(nameValue, urlValue)) {
        return false;
    }

    const bookmark = {
        name: nameValue,
        url: urlValue,
    };
    // bookmarks.push(bookmark);
	bookmarks[urlValue] = bookmark;
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    fetchBookmarks();
    bookmarkForm.reset();
    websiteNameEl.focus();
}

// Event Listener
bookmarkForm.addEventListener('submit', storeBookmark);
fetchBookmarks();
