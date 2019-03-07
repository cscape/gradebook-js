const jsdom = require('jsdom')
const { JSDOM } = jsdom

const rnd = n => n.toFixed(2)

const extract = body => {
  const { document } = (new JSDOM(body)).window
  let quarters = []
  let r = 0
  let t = 0
  document.querySelectorAll('.calendar > .term').forEach(e => {
    let classes = []
    let totalPoints = 0
    let classCount = 0
    const termName = e.querySelector('.term').textContent
    const termYear = e.querySelector('.year').textContent
    const classesTableRows = e.querySelectorAll('tr')
    classesTableRows.forEach(row => {
      const prc = row.querySelector('.percent')
      if (prc == null ||
          prc.hasChildNodes() === false ||
          prc.innerHTML == null ||
          String(row.querySelector('.letter').textContent).trim() === '') {
        return null
      }
      const score = Number(prc.textContent.replace(/\s/gm, ''))
      t++ // inc class #
      classCount++
      totalPoints += score // inc total points

      const course = row.querySelector('.course').textContent
      const teacher = row.querySelector('.teacher').textContent
      classes.push({
        course, teacher, score
      })
    })
    r += totalPoints
    const quarter = {
      classCount,
      points: totalPoints,
      gpa: rnd(totalPoints / classCount),
      classes,
      name: termName,
      year: termYear
    }
    quarters.push(quarter)
  })
  return {
    quarters,
    gpa: rnd(r / t),
    points: rnd(r)
  }
}

module.exports = extract
