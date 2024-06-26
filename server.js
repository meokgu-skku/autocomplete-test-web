const express = require('express');
const app = express();
const port = 81;

// 정적 파일 제공을 위한 미들웨어 설정
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});