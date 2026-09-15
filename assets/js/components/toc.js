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

let currentlyVisible = new Set()

function updateActiveLink () {
  if (currentlyVisible.size === 0) return

  const sorted = Array.from(currentlyVisible).sort((a, b) => a.offsetTop - b.offsetTop)
  const topSection = sorted[0]

  const tocLinks = TOC.querySelectorAll('a')
  const tocLink = TOC.querySelector(`a[href="#${topSection.getAttribute('id')}"]`)

  if (tocLink) {
    tocLinks.forEach((link) => link.classList.remove(VISIBLE_CLASS))
    tocLink.classList.add(VISIBLE_CLASS)

    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
    const scrollBottom = scrollTop + window.innerHeight
    const pageHeight = document.documentElement.scrollHeight
    const atBottom = scrollBottom >= pageHeight

    if (!atBottom) {
      tocLink.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    }
  }
}

function initToc () {
  if (!TOC || !TOC_TOGGLE || !DOCS) {
    return
  }

  const sections = DOCS.querySelectorAll('h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]')
  if (sections.length === 0) return

  const tocContent = TOC.querySelector('.toc-content')

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        currentlyVisible.add(entry.target)
      } else {
        currentlyVisible.delete(entry.target)
      }
    })
    updateActiveLink()
  }, {
    rootMargin: '0px 0px -60% 0px',
    threshold: 0
  })

  sections.forEach((section) => observer.observe(section))

  window.addEventListener('scroll', () => {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
    const scrollBottom = scrollTop + window.innerHeight
    const pageHeight = document.documentElement.scrollHeight
    const atBottom = scrollBottom >= pageHeight

    if (scrollTop <= 0 && tocContent) {
      tocContent.scrollTop = 0
    } else if (atBottom) {
      if (tocContent) tocContent.scrollTop = tocContent.scrollHeight
      const lastSection = sections[sections.length - 1]
      const lastLink = TOC.querySelector(`a[href="#${lastSection.getAttribute('id')}"]`)
      if (lastLink) {
        TOC.querySelectorAll('a').forEach((link) => link.classList.remove(VISIBLE_CLASS))
        lastLink.classList.add(VISIBLE_CLASS)
      }
    }
  })

  TOC_TOGGLE.onclick = () => {
    if (isVisible(TOC)) {
      TOC.classList.toggle(ACTIVE_CLASS)
      TOC_TOGGLE.classList.toggle(ACTIVE_CLASS)
    }
  }
}

initToc()
