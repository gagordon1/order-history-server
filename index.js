const express = require("express")
const dotenv = require('dotenv');
const fs = require("fs");

dotenv.config();

const app = express();
app.use(express.json())
const port = process.env.PORT;




app.get('/', (req, res) => {
  res.send("howdy")
});

app.post('/', (req, res) => {
  try{
    let data = JSON.stringify(req.body);
    fs.writeFileSync('order_history.json', data);
    res.send("Logged data")
  }catch(error){
    console.log(error)
    res.send(error.message)
  }

});


app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
