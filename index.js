const express = require("express")
const dotenv = require('dotenv');
const fs = require("fs");

dotenv.config();

const app = express();
app.use(express.json())
const port = process.env.PORT;




app.get('/stats', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  try{
    let rawdata = fs.readFileSync('trading_data.json');
    let data = JSON.parse(rawdata);
    const orderHistory = data["order_history"]
    let buys = orderHistory.filter(obj=>
      (obj.side == "buy") &&
      (obj.cancelled == false) &&
      (obj.amount_remaining == 0)
    )
    let sells = orderHistory.filter(obj=>
      (obj.side == "sell") &&
      (obj.cancelled == false) &&
      (obj.amount_remaining == 0)
    )
    let partial_buys = orderHistory.filter(obj =>
      (obj.side == "buy") &&
      (obj.cancelled == true) &&
      (obj.amount_remaining != Number(obj.original_amount))
    )
    let partial_sells = orderHistory.filter(obj =>
      (obj.side == "buy") &&
      (obj.cancelled == true) &&
      (obj.amount_remaining != Number(obj.original_amount))
    )
    let amountBought = 0

    let totalPaidForBuys = 0
    buys.forEach(obj => {
      totalPaidForBuys += Number(obj.price) * Number(obj.original_amount)
        amountBought += Number(obj.original_amount)
    });

    partial_buys.forEach(obj => {
      totalPaidForBuys += Number(obj.price) * ((Number(obj.original_amount) - Number(obj.amount_remaining)))
      amountBought += (Number(obj.original_amount) - Number(obj.amount_remaining))
    }

  );

    let amountSold = 0
    let totalEarnedFromSells = 0
    sells.forEach(obj => {totalEarnedFromSells +=
      Number(obj.price) * Number(obj.original_amount)
      amountSold += Number(obj.original_amount)
    }
  );

    partial_sells.forEach(obj => {totalEarnedFromSells +=
      Number(obj.price) * ((Number(obj.original_amount) - Number(obj.amount_remaining)));
      amountSold += (Number(obj.original_amount) - Number(obj.amount_remaining));
    }
  );
    out = {
      totalPaidForBuys : totalPaidForBuys,
      totalEarnedFromSells : totalEarnedFromSells,
      amountBought : amountBought,
      amountSold : amountSold,
      buys: buys,
      sells : sells,
      partial_buys : partial_buys,
      partial_sells : partial_sells
    }

    res.send(out)
  }catch(error){
    console.log(error.message)
    res.send(error.message)
  }
});

app.post('/', (req, res) => {
  try{
    let data = JSON.stringify(req.body);
    fs.writeFileSync('trading_data.json', data);
    res.send("Logged data")
  }catch(error){
    console.log(error)
    res.send(error.message)
  }

});


app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
