const TOC = document.querySelector('.toc')
const TOC_TOGGLE = document.querySelector('.toc-toggle')
const DOCS = document.querySelector('.article-body')
const VISIBLE_CLASS = 'is-visible'
const ACTIVE_CLASS = 'is-active'

function isVisible (elem) {
  const bounding = elem.getBoundingClientRect()
  return (
    bounding.top >= 0 &&
    bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight)
  )
}

let isAtBottom = false

function updateActiveLink (sections) {
  if (isAtBottom) return

  const viewportMiddle = window.innerHeight / 2
  let activeSection = null

  sections.forEach((section) => {
    const rect = section.getBoundingClientRect()
    if (rect.top <= viewportMiddle && rect.bottom >= viewportMiddle) {
      activeSection = section
    }
  })

  if (!activeSection) return

  const tocLinks = TOC.querySelectorAll('a')
  const tocLink = TOC.querySelector(`a[href="#${activeSection.getAttribute('id')}"]`)

  if (tocLink && !tocLink.classList.contains(VISIBLE_CLASS)) {
    tocLinks.forEach((link) => link.classList.remove(VISIBLE_CLASS))
    tocLink.classList.add(VISIBLE_CLASS)
    tocLink.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }
}

function initToc () {
  if (!TOC || !TOC_TOGGLE || !DOCS) {
    return
  }

  const sections = DOCS.querySelectorAll('.book-entry[id], .blog-entry[id]')
  if (sections.length === 0) return

  const tocContent = TOC.querySelector('.toc-content')

  function checkScrollPosition () {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
    const scrollBottom = scrollTop + window.innerHeight
    const pageHeight = document.documentElement.scrollHeight
    isAtBottom = scrollBottom >= pageHeight
    const isAtTop = scrollTop <= 0

    if (isAtTop) {
      if (tocContent) tocContent.scrollTop = 0
      const firstSection = sections[0]
      const firstLink = TOC.querySelector(`a[href="#${firstSection.getAttribute('id')}"]`)
      if (firstLink) {
        TOC.querySelectorAll('a').forEach((link) => link.classList.remove(VISIBLE_CLASS))
        firstLink.classList.add(VISIBLE_CLASS)
      }
    } else if (isAtBottom) {
      if (tocContent) tocContent.scrollTop = tocContent.scrollHeight
      const lastSection = sections[sections.length - 1]
      const lastLink = TOC.querySelector(`a[href="#${lastSection.getAttribute('id')}"]`)
      if (lastLink) {
        TOC.querySelectorAll('a').forEach((link) => link.classList.remove(VISIBLE_CLASS))
        lastLink.classList.add(VISIBLE_CLASS)
      }
    } else {
      updateActiveLink(sections)
    }
  }

  window.addEventListener('scroll', checkScrollPosition)
  window.addEventListener('resize', checkScrollPosition)
  window.addEventListener('load', checkScrollPosition)

  checkScrollPosition()

  TOC_TOGGLE.onclick = () => {
    if (isVisible(TOC)) {
      TOC.classList.toggle(ACTIVE_CLASS)
      TOC_TOGGLE.classList.toggle(ACTIVE_CLASS)
    }
  }
}

initToc()
