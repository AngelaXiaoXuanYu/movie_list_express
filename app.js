const express = require('express')
const app = express()
// 告訴 Express：用 express-handlebars 來處理回傳給瀏覽器的畫面
const exphbs = require('express-handlebars')
const movieList = require('./movies.json')
const port = 3000

// app.engine：定義要使用的樣板引擎，即告訴 Express把樣板引擎交給 express-handlebars。
// 第一個參數是樣板引擎的名稱，第二個參數是放入和此樣板引擎相關的設定。這裡設定了預設的佈局（default layout）需使用名為 main 的檔案。
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))

// app.set：透過這個方法告訴 Express 說要設定的 view engine 是 handlebars。
app.set('view engine', 'handlebars')

// 設定靜態檔案的資料夾：告訴 Express 靜態檔案放在 public 資料夾中，它不必針對這個資料夾內的檔案做什麼，只要產生對應的路由以便使用就好。
app.use(express.static('public'))


app.get('/', (req, res) => {
  res.render('index', { movies: movieList.results })
  // Express 會在使用者輸入 localhost:3000 進到根目錄時，根據 index.handlebars 這支檔案回傳對應的 HTML 給瀏覽器。
})

app.get('/search', (req, res) => {
  // req.query 可以存取網頁網址中 ? 後的內容。
  const keyword = req.query.keyword
  // 運用 filter 來篩選陣列中的元素，符合 include 條件的元素才會被留下形成新的陣列
  // toLowerCase() 是將所有字串內容都改成小寫
  const movies = movieList.results.filter(movie => {
    return movie.title.toLowerCase().includes(keyword.toLowerCase())
  })
  res.render('index', { movies: movies, keyword: keyword })
})

app.get('/movies/:movie_id', (req, res) => {
  console.log('req.params.movie_id', req.params.movie_id)
  // 使用 find 篩選陣列的資料內容。find 的參數包含一個函式，當陣列裡的元素帶入這個函式後回傳 true 時，該元素會直接被 return。
  const movie = movieList.results.find(movie => movie.id.toString() === req.params.movie_id)
  res.render('show', { movie: movie })
})

app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})