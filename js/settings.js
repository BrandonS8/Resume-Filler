document.addEventListener('DOMContentLoaded', function() {
  var loadingScreen = document.querySelector('#rf-loading')
  var save = document.querySelector('#rf-save')

  var firstName = document.querySelector('#rf-firstName')
  var lastName = document.querySelector('#rf-lastName')

  var resume = {
    firstName: 'FirstName'
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
  }

  // Add Event Listeners to Inputs
  firstName.addEventListener('input', function(e) {
    resume.firstName = e.target.value
  })
  lastName.addEventListener('input', function(e) {
    resume.lastName = e.target.value
  })
  save.addEventListener('click', function() {
    chrome.storage.sync.set({ rfResumeSettings: resume }, function() {
      // on save
    })
  })
})

// https://developer.chrome.com/apps/storage
