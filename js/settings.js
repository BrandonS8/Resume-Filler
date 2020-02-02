document.addEventListener('DOMContentLoaded', function() {
  var loadingScreen = document.querySelector('#rf-loading')
  var save = document.querySelector('#rf-save')

  var firstName = document.querySelector('#rf-firstName')
  var lastName = document.querySelector('#rf-lastName')
  var shortIntro = document.querySelector('#rf-shortIntro')

  var resume = {
    firstName: 'First Name',
    lastName: 'Last Name',
    shortIntro: 'Short Introduction'
  }

  // Get settings from chrome storage api
  chrome.storage.sync.get(['rfResumeSettings'], function(result) {
    resume = result.rfResumeSettings
    loadingScreen.style.display = 'none'
    updateInputValues()
  })

  // Update Displayed Values
  function updateInputValues() {
    firstName.value = resume.firstName
    lastName.value = resume.lastName
    shortIntro.value = resume.shortIntro
  }

  // Add Event Listeners to Inputs
  firstName.addEventListener('input', function(e) {
    resume.firstName = e.target.value
  })
  lastName.addEventListener('input', function(e) {
    resume.lastName = e.target.value
  })
  shortIntro.addEventListener('input', function(e) {
    console.log('here')
    resume.shortIntro = e.target.value
  })

  save.addEventListener('click', function() {
    chrome.storage.sync.set({ rfResumeSettings: resume }, function() {
      // on save
    })
  })
})

// https://developer.chrome.com/apps/storage
