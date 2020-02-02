document.addEventListener('DOMContentLoaded', function() {
  var loadingScreen = document.querySelector('#rf-loading')
  var firstName = document.querySelector('#rf-firstName')
  var save = document.querySelector('#rf-save')

  var resume = {
    firstName: 'FirstName'
  }

  // Get settings from chrome storage api
  chrome.storage.sync.get(['rfResumeSettings'], function(result) {
    console.log(result.rfResumeSettings)
    resume = result.rfResumeSettings
    loadingScreen.style.display = 'none'
    updateInputValues()
  })

  function updateInputValues() {
    console.log(resume)
    console.log('update inputs')
    firstName.value = resume.firstName
  }

  firstName.addEventListener('input', function(e) {
    resume.firstName = e.target.value
    console.log(resume)
  })
  save.addEventListener('click', function() {
    chrome.storage.sync.set({ rfResumeSettings: resume }, function() {
      console.log('Value is set to ' + resume)
      console.log(resume.firstName)
    })
  })
})

// https://developer.chrome.com/apps/storage
