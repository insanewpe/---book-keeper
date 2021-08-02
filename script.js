const modal = document.getElementById('modal');
const modalShow = document.getElementById('show-modal');
const modalClose = document.getElementById('close-modal');
const bookmarkForm = document.getElementById('bookmark-form');
const websiteNameEl = document.getElementById('website-name')
const websiteUrlEl = document.getElementById('website-url');
const bookmarksContainer = document.getElementById('bookmarks-container');

let bookmarks = [];

// show modal, focus on input
function showModal() {
    modal.classList.add('show-modal');
    websiteNameEl.focus();
}

// modal event listener
modalShow.addEventListener('click', showModal);
modalClose.addEventListener('click', () => modal.classList.remove('show-modal'));
window.addEventListener('click', (e) => (e.target === modal) ? modal.classList.remove('show-modal') : false);

// Validate form
function validate(nameValue, urlValue) {
    const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
    const regex = new RegExp(expression);
    if (!nameValue || !urlValue) {
        alert('Please submite values for both fields.');
        return false;
    }
    if (!urlValue.match(regex)) {
        alert('Please provide a valid web adress');
        return false;
    }
    // Valid
    return true;

}

// build Bookmarks DOM
function buildBookmarks() {
    // Remove all bookmark elements, so its rebuilds it from scratch every time
    bookmarksContainer.textContent = '';
    // Build items
    bookmarks.forEach((bookmark)=> {
        const { name, url} = bookmark
        // Create el one at a time Parent --> Children
        const item = document.createElement('div');
        item.classList.add('item');
        // close icon
        const closeIcon = document.createElement('i');
        closeIcon.classList.add('fas','fa-times');
        closeIcon.setAttribute('title','Delete Bookmark');
        closeIcon.setAttribute('onclick', `deleteBookmark('${url}')`);
        //Favicon //Link Container 
        const linkInfo = document.createElement('div');
        linkInfo.classList.add('name');
        // favicon
        const favicon = document.createElement('img');
        favicon.setAttribute('src', `https://s2.googleusercontent.com/s2/favicons?domain=${url}`);
        favicon.setAttribute('alt', `Favicon`);
        // Link 
        const link = document.createElement('a');
        link.setAttribute('href',`${url}`);
        link.setAttribute('target', '_blank');
        link.textContent = name;
        // Append to bookmarks container
        linkInfo.append(favicon,link);
        item.append(closeIcon,linkInfo);
        bookmarksContainer.appendChild(item);

    });
}

// Fetch bookmarks from storage
function fetchBookmarks(){
    // get bookmarks from localStorage if available
    if(localStorage.getItem('bookmarks')) {
        bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    }else {
        bookmarks = [
            {
                name:'Jacinto Design',
                url:'https://jacinto.design',
            }
        ]
        localStorage.setItem('bookmarks',JSON.stringify(bookmarks));
    }
   buildBookmarks();
}

//Delete Bookmark
function deleteBookmark(url) {
   bookmarks.forEach((bookmark,i )=> {
    if(bookmark.url === url) {
        bookmarks.splice(i,1);
    }
   });
//    update bookamrks array in localStorage, re-populate the DOM
localStorage.setItem('bookmarks',JSON.stringify(bookmarks));
fetchBookmarks();

}

// handle data from form
function storeBookmark(e) {
    e.preventDefault()
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
        url:urlValue,
    };
    bookmarks.push(bookmark)
    // local storage servers can keep data only in a string format
    localStorage.setItem('bookmarks',JSON.stringify(bookmarks));
    fetchBookmarks();
    bookmarkForm.reset();
    websiteNameEl.focus()
}

//Event listener
bookmarkForm.addEventListener('submit', storeBookmark);


//onload
fetchBookmarks();