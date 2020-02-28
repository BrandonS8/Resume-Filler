document.addEventListener('DOMContentLoaded', function() {
  var loadingScreen = document.querySelector('#rf-loading')
  var save = document.querySelector('#rf-save')

  var firstName = document.querySelector('#rf-firstName')
  var lastName = document.querySelector('#rf-lastName')
  var shortIntro = document.querySelector('#rf-shortIntro')

  var resume = {
    firstName: '',
    lastName: '',
    shortIntro: '',
    experience: [],
    education: []
  }
  // https://developer.chrome.com/apps/storage
  // Get settings from chrome storage api

  chrome.storage.sync.get(['rfResumeSettings'], function(result) {
    const entries = Object.entries(result.rfResumeSettings)
    entries.forEach(e => {
      resume[e[0]] = e[1]
    })
    loadingScreen.style.display = 'none'
    updateInputValues()
    setupAccordions()
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
    resume.shortIntro = e.target.value
  })

  save.addEventListener('click', function() {
    chrome.storage.sync.set({ rfResumeSettings: resume }, function() {
      save.innerHTML = 'Saved!'
      setTimeout(function() {
        save.innerHTML = 'Save'
      }, 1800)
    })
  })

  // accordion stuff:
  // an accordion without jQuery?? What!?

  class DynamicAccordion {
    constructor(name, container, elToCopy, addButton, data) {
      this.name = name
      this.container = container
      this.elToCopy = elToCopy
      this.addButton = addButton
      this.data = data
      this.lastID = 0

      // Binding the context
      this.addAccordion = this.addAccordion.bind(this)
      this.initAccordion = this.initAccordion.bind(this)
      this.removeAccordion = this.removeAccordion.bind(this)
      this.updateData = this.updateData.bind(this)

      this.setup = this.setup.bind(this)
      this.setup()
    }

    getNewID() {
      this.lastID += 1
      if (
        this.container.querySelector(
          '.accordion[data-accordion-id="' + this.lastID + '"]'
        )
      ) {
        this.getNewID()
      } else {
        return this.lastID
      }
    }
    initAddButton() {
      var context = this
      this.addButton.addEventListener('click', function() {
        context.addAccordion()
      })
    }

    initAccordion(id, entry) {
      var context = this
      var accordion = this.container.querySelector(
        '.accordion[data-accordion-id="' + id + '"]'
      )
      if (entry) {
        entry.accordionID = id
      } else {
        this.data.push({ accordionID: id })
      }

      var toggle = accordion.children[0]
      var remover = accordion.querySelector('.accordion-close')
      var content = accordion.children[1]
      content.querySelector('input.accordion-id-field').value = id
      remover.addEventListener('click', function(e) {
        var c = confirm('Delete?')
        if (c == true) {
          context.removeAccordion(id)
        } else {
          console.log('remove cancelled')
        }
        e.stopPropagation()
      })
      toggle.addEventListener('click', function(e) {
        toggle.classList.add('active')
        if (content.style.maxHeight) {
          content.style.maxHeight = null
        } else {
          content.style.maxHeight = content.scrollHeight + 'px'
        }
      })
      content.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('input', function(e) {
          context.data.forEach(function(item, index, arr) {
            if (item.accordionID == id) {
              arr[index][e.currentTarget.name] = e.currentTarget.value
            }
          })

          if (e.currentTarget.name === 'title') {
            toggle.children[0].innerHTML = e.currentTarget.value
          }
          context.updateData()
        })
      })
    }

    addAccordion(entry) {
      var id = this.getNewID()
      var clone = this.elToCopy.cloneNode(true)
      clone.classList.remove('accordion-first')
      clone.dataset.accordionId = id
      var containerBot = this.container.querySelector(
        '.accordion-container-bottom'
      )
      this.container.insertBefore(clone, containerBot)

      clone.children[0].children[0].innerHTML = 'Click to toggle'
      clone.children[1]
        .querySelectorAll('input, textarea')
        .forEach(function(input) {
          if (input.name != 'accordionID') {
            input.value = ''
          }
        })
      clone.children[1].style.maxHeight = clone.children[1].scrollHeight + 'px'
      if (entry) {
        clone.children[1].style.maxHeight = null
        this.initAccordion(id, entry)
      } else {
        this.initAccordion(id)
      }

      return id
    }
    removeAccordion(id) {
      var context = this
      var accordion = this.container.querySelector(
        '.accordion[data-accordion-id="' + id + '"]'
      )
      this.data.forEach(function(item, index, arr) {
        if (item.accordionID == id) {
          context.data.splice(index, 1)
        }
      })
      accordion.remove()
      context.updateData()
    }

    addDataToAccordion(id, data) {
      var accordion = this.container.querySelector(
        '.accordion[data-accordion-id="' + id + '"]'
      )
      // first child is toggle row then get p tag inside that
      if (data.title) {
        accordion.children[0].children[0].innerHTML = data.title
      }
      // second child is content
      accordion.children[1]
        .querySelectorAll('input, textarea')
        .forEach(input => {
          if (input.name == 'accordionID') {
            return
          }
          if (data[input.name]) {
            input.value = data[input.name]
          } else {
            input.value = ''
          }
        })
    }
    setup() {
      var context = this
      var data = this.data
      if (data.length > 0) {
        data.forEach(function(entry, index) {
          if (index === 0) {
            context.initAccordion(0, entry)
            context.addDataToAccordion(0, entry)
          } else {
            var newID = context.addAccordion(entry)
            context.addDataToAccordion(newID, entry)
          }
        })
      } else {
        context.initAccordion(0)
      }
      context.initAddButton()
    }
    updateData() {
      resume[this.name] = this.data
    }
  }

  function setupAccordions() {
    // SETUP EXPERIENCE ACCORDION
    var expContainer = document.querySelector('.experience-container')
    var firstExp = expContainer.querySelector('.accordion-first')
    var addExp = document.querySelector('#add-button-exp')
    // name, container, elToCopy, addButton, data
    var experienceAccordion = new DynamicAccordion(
      'experience',
      expContainer,
      firstExp,
      addExp,
      resume.experience ? resume.experience : []
    )

    // SETUP EDUCATION ACCORDION
    var eduContainer = document.querySelector('.education-container')
    var firstEdu = eduContainer.querySelector('.accordion-first')
    var addEdu = document.querySelector('#add-button-edu')
    // name, container, elToCopy, addButton, data
    var educationAccordion = new DynamicAccordion(
      'education',
      eduContainer,
      firstEdu,
      addEdu,
      resume.education ? resume.education : []
    )
  }

  // end of on doc ready
})
