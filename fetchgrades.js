require('dotenv').config()
const axios = require('axios')
const cheerio = require('cheerio')
const request = require('request')
const check = require('./html-filtering')

const grdSource = 'https://gradebook.dadeschools.net/Pinnacle/Gradebook/InternetViewer/GradeSummary.aspx'
const envStudentID = process.env.STUDENT
const initFetchURL = `https://mdcpsportalapps2.dadeschools.net/PIVredirect/?ID=${envStudentID}`

const go = async () => new Promise((resolve) => {
  axios.get(initFetchURL)
    .then(async response => {
      const { data } = response
      // console.log(data)
      const $ = cheerio.load(data)
      const postSRC = $('form').attr('action')
      const StudentID = $('input[name="StudentID"]').attr('value')
      return procTokens(postSRC, StudentID, resolve)
    })
    .catch(async () => go())
})

const procTokens = async (postSRC, StudentID, resolve) => {
  const options = {
    method: 'POST',
    url: postSRC,
    headers: {
      'Cache-Control': 'no-cache',
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    form: {
      action: 'trans',
      StudentID: StudentID
    }
  }

  return request(options, async (e, res) => {
    if (e) return procTokens(postSRC, StudentID)
    const cookies = res.headers['set-cookie']
      .reverse()
      .map(a => a.split(';')[0])
      .join('; ')
    return fetchGrades(cookies, resolve)
  })
}

const fetchGrades = async (cookies, resolve) => {
  const options = {
    method: 'GET',
    url: grdSource,
    headers: {
      'Referer': initFetchURL,
      'Cookie': cookies,
      'Pragma': 'no-cache',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.0.0 Safari/537.36'
    }
  }

  return request(options, async (_, r, body) => {
    const dataGrades = check(body)
    resolve(dataGrades)
  })
}

module.exports = () => new Promise((resolve) => go().then(data => resolve(data)))
