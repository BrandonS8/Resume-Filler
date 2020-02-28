document.addEventListener('DOMContentLoaded', function() {
  var loadingScreen = document.querySelector('#rf-loading')

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
    setupAccordions()
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

  function initCopyButtons() {
    var copyButtons = document.querySelectorAll('.rf-copy-button')
    copyButtons.forEach(function(b) {
      b.addEventListener('click', copy)
    })
  }
  initCopyButtons()

  // accordion stuff:
  // an accordion without jQuery?? What!?

  class DynamicAccordion {
    constructor(name, container, elToCopy, data) {
      this.name = name
      this.container = container
      this.elToCopy = elToCopy
      this.data = data
      this.lastID = 0

      // Binding the context
      this.initAccordion = this.initAccordion.bind(this)

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
      var content = accordion.children[1]
      content.querySelector('input.accordion-id-field').value = id

      toggle.addEventListener('click', function(e) {
        toggle.classList.add('active')
        if (content.style.maxHeight) {
          content.style.maxHeight = null
        } else {
          content.style.maxHeight = content.scrollHeight + 'px'
        }
      })

      initCopyButtons()
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
    }
  }

  function setupAccordions() {
    // SETUP EXPERIENCE ACCORDION
    var expContainer = document.querySelector('.experience-container')
    var firstExp = expContainer.querySelector('.accordion-first')
    // name, container, elToCopy, addButton, data
    var experienceAccordion = new DynamicAccordion(
      'experience',
      expContainer,
      firstExp,
      resume.experience ? resume.experience : []
    )

    // SETUP EDUCATION ACCORDION
    var eduContainer = document.querySelector('.education-container')
    var firstEdu = eduContainer.querySelector('.accordion-first')
    // name, container, elToCopy, addButton, data
    var educationAccordion = new DynamicAccordion(
      'education',
      eduContainer,
      firstEdu,
      resume.education ? resume.education : []
    )
  }

  // End of on content loaded
})
