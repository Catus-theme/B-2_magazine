const express = require('express');
const app = express();
const bodyParser = require('body-parser');
let jsonParser = bodyParser.json()
let urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use('/public', express.static(__dirname + '/public'));
app.set('views', __dirname+'/views')
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.get('/', (req,res) => {
  res.render('index.html')
})
app.get('/single', (req, res) => {
  res.render('single.html')
})
app.listen(3004, () => {
  console.log('hello');
})