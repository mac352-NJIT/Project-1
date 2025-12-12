const express = require('express')
const app = express()
const port = 3000

app.use(express.json())
app.use(express.static('public'));

let stock = [
    
]

app.post('/api/decrement-stock', (req, res) => {
    const { productId } = req.body;

    if(!stock[productId] && stock[productId] !== 0) {
        return res.status(404).json({error: "Item not found"})
    }

    if (stock[productId] > 0) {
        stock[productId] -= 1;
    }

    res.json({ stock: stock[productId] });

});

app.get('/shoppingcart', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'itemsIn.html'));
});

app.get('/checkout', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'itemsOut.html'));
});
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`))