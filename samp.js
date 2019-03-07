var request = require("request");

var options = { method: 'POST',
  url: 'https://gradebook.dadeschools.net/Pinnacle/Gradebook/InternetViewer/GradeSummary.aspx',
  headers: 
   { 'Cache-Control': 'no-cache',
     'Content-Type': 'application/x-www-form-urlencoded' },
  form: 
   { action: 'trans',
     StudentID: 'ejzI5wUgkMXfBUDiL~!qyH8QiVKKGIwVu' } };

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});
