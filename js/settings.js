document.addEventListener('DOMContentLoaded', function() {
  var loadingScreen = document.querySelector('#rf-loading')
  var save = document.querySelector('#rf-save')

  var firstName = document.querySelector('#rf-firstName')
  var lastName = document.querySelector('#rf-lastName')
  var shortIntro = document.querySelector('#rf-shortIntro')

  var resume = {
    firstName: 'First Name',
    lastName: 'Last Name',
    shortIntro: 'Short Introduction',
    experience: []
  }

  // Get settings from chrome storage api
  chrome.storage.sync.get(['rfResumeSettings'], function(result) {
    const entries = Object.entries(result.rfResumeSettings)
    entries.forEach(e => {
      resume[e[0]] = e[1]
    })
    loadingScreen.style.display = 'none'
    updateInputValues()
    setupAccordions(
      document.querySelector('.accordion-container.experience-container'),
      resume.experience
    )
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

  // accordion stuff:

  // an accordion without jQuery?? What!?
  var accordionSample = document.querySelector('.accordion-first')
  var accordionContainer = document.querySelector('.accordion-container')

  var addExpAccordionButton = document.querySelector('#add-button-exp')

  var accordionContainerBot = document.querySelector(
    '.accordion-container-bottom'
  )

  function initAccordion(el, existingIndex) {
    var index = 0
    if (typeof existingIndex != 'undefined') {
      index = existingIndex
    } else {
      index = resume.experience.push({}) - 1
      resume.experience[index].index = index
    }
    var toggle = el.children[0]
    var remover = el.querySelector('.accordion-close')
    var content = el.children[1]
    remover.addEventListener('click', function(e) {
      var c = confirm('Delete?')
      if (c == true) {
        removeAccordion(el, resume.experience, index)
      } else {
      }
      e.stopPropagation()
    })
    toggle.addEventListener('click', function(e) {
      console.log('click')
      toggle.classList.add('active')
      if (content.style.maxHeight) {
        content.style.maxHeight = null
      } else {
        content.style.maxHeight = content.scrollHeight + 'px'
      }
    })

    content.querySelectorAll('input, textarea').forEach(input => {
      input.addEventListener('input', function(e) {
        console.log(resume.experience)
        console.log(index)
        resume.experience[index][e.currentTarget.name] = e.currentTarget.value
        console.log(resume.experience)
        if (e.currentTarget.name === 'title') {
          toggle.children[0].innerHTML = e.currentTarget.value
        }
      })
    })
    // resume.experience.push(data)
  }

  function addDataToAccordion(accordion, data) {
    // first child is toggle row then get p tag inside that
    if (data.title) {
      accordion.children[0].children[0].innerHTML = data.title
    }
    // second child is content
    accordion.children[1].querySelectorAll('input, textarea').forEach(input => {
      if (data[input.name]) {
        input.value = data[input.name]
      } else {
        input.value = ''
      }
    })
  }

  function setupAccordions(container, arr) {
    console.log(arr)
    var first = container.querySelector('.accordion')
    if (arr[0]) {
      initAccordion(first, arr[0].index)
    } else {
      initAccordion(first)
    }
    if (arr.length === 1) {
      addDataToAccordion(first, resume.experience[0])
    } else if (arr.length > 1) {
      console.log(arr)
      addDataToAccordion(first, arr[0])
      arr.forEach(function(item, index) {
        if (index > 0) {
          addAccordion(container, arr[index])
        }
      })
    }
  }

  function addAccordion(container, data) {
    var clone = accordionSample.cloneNode(true)
    var containerBot = container.querySelector('.accordion-container-bottom')
    container.insertBefore(clone, containerBot)
    if (data && data.index) {
      clone.children[1].style.maxHeight = null
      addDataToAccordion(clone, data)
      initAccordion(clone, data.index)
    } else {
      clone.children[1].style.maxHeight = clone.children[1].scrollHeight + 'px'
      initAccordion(clone)
    }
  }

  addExpAccordionButton.addEventListener('click', function() {
    addAccordion(
      document.querySelector('.accordion-container.experience-container')
    )
  })

  function removeAccordion(accordion, arr, index) {
    arr.splice(index, 1)
    console.log(arr)
    accordion.remove()
  }
})

// https://developer.chrome.com/apps/storage
