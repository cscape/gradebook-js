require('dotenv').config()
const getGrades = require('./fetchgrades')
const asTable = require('as-table')

getGrades().then(dataGrades => {
  const { quarters } = dataGrades
  const latestQ = quarters[0]
  const { classes } = latestQ
  const cleanClasses = classes.map(course => {
    return {
      'CL': course.course,
      'TC': course.teacher,
      'PT': course.score.toFixed(2)
    }
  })
  const tableclass = asTable(cleanClasses).split('\n')
  const tableLength = tableclass[0].length
  const fillerBar = Array(tableLength).fill('-').join('')
  const tableClasses = '  ' + tableclass.slice(1).join('\n  ')

  console.log('\x1Bc')
  console.log(`  GradebookJS (c) Cyberscape 2019\n`)
  console.log(`= ${latestQ.name} (${latestQ.year})`)
  console.log(tableClasses)
  console.log(`  ${fillerBar}`)
  console.log(`  Quarter GPA: ${latestQ.gpa}\n\n`)
})
