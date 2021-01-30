//----------------------------------------------------
//    GENERAL VARIABLES
//----------------------------------------------------

const gallerySection = document.getElementById('gallery');
const getTwelveUsersUrl = 'https://randomuser.me/api/?results=12&nat=us';
const body = document.querySelector('body');
let userData; //Will be populated with the ordered user data retrieved fetchData

//----------------------------------------------------
//    CODE EXECUTION
//----------------------------------------------------

fetchData(getTwelveUsersUrl)
    .then(data => displayData(data));

gallerySection.addEventListener('click', displayModal)

//----------------------------------------------------
//    FUNCTIONS
//----------------------------------------------------

//Fetches the data from the url given.
//*NOTE: Unsure why, but sometimes this works and sometimes it fails with 'TypeError: Failed to fetch'. I assume it's an issue with the API
function fetchData(url) {
    return fetch(url)
            .then(data => data.json())
            .then(data => {
                userData = data.results;
                return data.results;
            })
            .catch(err => console.log('Whoops, something went wrong:', err));
}

//Dynamically builds the required HTML to display the data and populates the page with it.
function displayData(data) {
    for (let i = 0; i < data.length; i++) {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'card';
        cardDiv.dataset.index = i;

        const imgContainerDiv = document.createElement('div');
        imgContainerDiv.className = 'card-img-container';
        imgContainerDiv.innerHTML = 
        `<img class="card-img" src="${data[i].picture.medium}" alt="${data[i].name.first} ${data[i].name.last} profile picture">`; 

        const infoContainerDiv = document.createElement('div');
        infoContainerDiv.className = 'card-info-container';
        infoContainerDiv.innerHTML =
        `<h3 id="${data[i].name.first}-${data[i].name.last}" class="card-name cap">${data[i].name.first} ${data[i].name.last}</h3>
        <p class="card-text">${data[i].email}</p>
        <p class="card-text cap">${data[i].location.city}, ${data[i].location.state}</p>`;

        cardDiv.appendChild(imgContainerDiv);
        cardDiv.appendChild(infoContainerDiv);   

        gallerySection.appendChild(cardDiv);
    };
}

//Displays the modal for the selected user. Adds an event listener to the new modal to add the ability to close the modal.
function displayModal(event) {
    const target = event.target;
    if (target.parentElement.parentElement.className === 'card' || target.parentElement.className === 'card'|| target.className === 'card') {
        let cardDiv;
        if (target.parentElement.parentElement.className === 'card') {
            cardDiv = target.parentElement.parentElement;
        } else if (target.parentElement.className === 'card') {
            cardDiv = target.parentElement;
        } else {
            cardDiv = target;
        }

        dataIndex = cardDiv.dataset.index;
        profile = userData[dataIndex];
                
        let modalHTML = buildModalHTML(profile);

        body.insertAdjacentHTML('beforeend', modalHTML);

        modal = document.getElementsByClassName('modal-container')[0];

        modal.addEventListener('click', closeModal);
    }
}

//Builds the HTML for the modal based on the profile given.
function buildModalHTML(profile) {

    let dobUnformatted = profile.dob.date.split('T')[0];
    dobUnformatted = dobUnformatted.split('-');
    let dob = `${dobUnformatted[1]}/${dobUnformatted[2]}/${dobUnformatted[0]}`

    modalHTML = `<div class="modal-container">
    <div class="modal">
        <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
        <div class="modal-info-container">
            <img class="modal-img" src="${profile.picture.medium}" alt="${profile.name.first} ${profile.name.last} profile picture">
            <h3 id="${profile.name.first}-${profile.name.last}-modal" class="modal-name cap">${profile.name.first} ${profile.name.last}</h3>
            <p class="modal-text">${profile.email}</p>
            <p class="modal-text cap">${profile.location.city}</p>
            <hr>
            <p class="modal-text">${profile.cell}</p>
            <p class="modal-text">${profile.location.street.number} ${profile.location.street.name}, ${profile.location.city}, ${profile.location.state} ${profile.location.postcode}</p>
            <p class="modal-text">Birthday: ${dob}</p>
        </div>
    </div>`;

    return modalHTML;
}

//Closes the modal when called.
function closeModal(event) {

    if (event.target.tagName === 'STRONG' || event.target.tagName === 'BUTTON' ) {

        let modal = document.getElementsByClassName('modal-container')[0];
        modal.remove();
    }
}