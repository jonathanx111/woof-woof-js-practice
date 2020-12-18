// global variable declarations and queries
const dogBar = document.querySelector('#dog-bar')
const dogSummaryContainer = document.querySelector('#dog-summary-container')
const dogInfoDiv = document.querySelector('#dog-info')
const dogFilter = document.querySelector('#good-dog-filter')
// fetching dog objects into home page
function fetchGoodDogs() {
    fetch("http://localhost:3000/pups")
        .then(response => response.json())
        .then(dogObjects => {
            dogBar.innerHTML = ""
            dogObjects.forEach(appendGoodDogToDogBar)
        })
}

const appendGoodDogToDogBar = (dogObject) => {
    if (dogObject.isGoodDog === true) {
        const dogSpan = document.createElement('span')
        dogSpan.textContent = dogObject.name
        dogSpan.dataset.id = dogObject.id
        dogSpan.dataset.goodBad = dogObject.isGoodDog
        dogBar.append(dogSpan)
    }
}


function fetchDogs() {
    fetch("http://localhost:3000/pups")
        .then(response => response.json())
        .then(dogObjects => {
            dogBar.innerHTML = ""
            dogObjects.forEach(appendDogToDogBar)
        })
}

appendDogToDogBar = (dogObject) => {

    const dogSpan = document.createElement('span')
    dogSpan.textContent = dogObject.name
    dogSpan.dataset.id = dogObject.id
    dogSpan.dataset.goodBad = dogObject.isGoodDog
    // if (dogFilter === "Filter good dogs: OFF") {
    dogBar.append(dogSpan)
    // } else {
        
    //     if (dogObject.isGoodDog == true) {
    //         dogBar.append(dogSpan)
    //     }
    // }
}

// Individual dog info
const dogBarEvent = (event) => {
    const dogId = event.target.dataset.id
    fetch(`http://localhost:3000/pups/${dogId}`)
        .then(response => response.json())
        .then(dogObj => renderDog(dogObj))
}

const dogButtonEvent = (event) => {
    const dogId = event.target.dataset.id
    let buttonValue = event.target.textContent
    let doggie;
    if (buttonValue === "Good Dog!") {
        
        doggie = false
    } else {
        doggie = true
    }
    console.log(doggie)
    fetch(`http://localhost:3000/pups/${dogId}`, {
        method: "PATCH",
        headers: { 
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            isGoodDog: doggie
        })
    })
    .then(response => response.json())
    .then(dogObj => {
        if  (dogObj.isGoodDog) {
            event.target.textContent = "Good Dog!"
        } else {
            event.target.textContent = "Bad Dog!"
        }
    })
}   

const renderDog = (dogObj) => {
    // dogInfoDiv.innerHtml = `
    // <img src=${dogObj.image}>
    // <h2>${dogObj.name}</h2>
    // <button>Good Dog!</button>
    // `
    const dogImg = document.createElement('img')
    const dogH2 = document.createElement('h2')
    const dogButton = document.createElement('button')
    dogInfoDiv.innerHTML = ""
    dogImg.src = dogObj.image 
    dogH2.textContent = dogObj.name
    if (dogObj.isGoodDog) {
        dogButton.textContent = "Good Dog!"
    } else {
        dogButton.textContent = "Bad Dog!"
    }
    dogButton.dataset.id = `${dogObj.id}`
    dogInfoDiv.append(dogImg, dogH2, dogButton)

    dogButton.addEventListener('click', dogButtonEvent)
}

const badChecker = (dog) => {
    if (dogFilter.textContent === "Filter good dogs: ON") {
        fetchGoodDogs()
   } else {
       fetchDogs()
   }
}   
       

const filterEvent = (event) => {
    const textContent = event.target.textContent
    event.target.textContent = textContent === "Filter good dogs: OFF" ? "Filter good dogs: ON" : "Filter good dogs: OFF"
    const dogBarDogs = dogBar.children
    const dogBarDogsArray = Array.from(dogBarDogs)
    dogBarDogsArray.forEach(badChecker)
    
}

dogBar.addEventListener('click', dogBarEvent)
dogFilter.addEventListener('click', filterEvent)


// initializing start fetch
fetchDogs()