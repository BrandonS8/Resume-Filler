document.addEventListener('DOMContentLoaded', function() {
  var loadingScreen = document.querySelector('#rf-loading')
  var copyButtons = document.querySelectorAll('.rf-copy-button')

  var firstName = document.querySelector('#rf-firstName')
  var lastName = document.querySelector('#rf-lastName')
  var shortIntro = document.querySelector('#rf-shortIntro')

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
    shortIntro.value = resume.shortIntro
  }

  // Copy Text Field
  function copy(el) {
    var text = el.currentTarget.previousElementSibling
    text.select()
    document.execCommand('copy')
    var copiedIcon = el.currentTarget.children[0].children[0]
    copiedIcon.classList.remove('fa-clipboard')
    copiedIcon.classList.add('fa-check')
    setTimeout(function() {
      copiedIcon.classList.remove('fa-check')
      copiedIcon.classList.add('fa-clipboard')
    }, 1000)
  }

  copyButtons.forEach(function(b) {
    b.addEventListener('click', copy)
  })
})
