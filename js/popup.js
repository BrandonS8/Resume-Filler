document.addEventListener('DOMContentLoaded', function() {
  var loadingScreen = document.querySelector('#rf-loading')
  var copyButtons = document.querySelectorAll('.rf-copy-button')

  var firstName = document.querySelector('#rf-firstName')
  var lastName = document.querySelector('#rf-lastName')

  var resume = {}

  // Get settings from chrome storage api
  chrome.storage.sync.get(['rfResumeSettings'], function(result) {
    resume = result.rfResumeSettings
    loadingScreen.style.display = 'none'
    updateValues()
  })

  // Update Displayed Values
  function updateValues() {
    firstName.value = resume.firstName
    lastName.value = resume.lastName
  }

  // Copy Text Field
  function copy(el) {
    var text = el.currentTarget.previousElementSibling
    text.select()
    document.execCommand('copy')
    var copiedText = el.currentTarget.children[1]
    copiedText.innerHTML = 'Copied!'
    setTimeout(function() {
      copiedText.innerHTML = 'Copy'
    }, 800)
  }

  copyButtons.forEach(function(b) {
    b.addEventListener('click', copy)
  })
})
