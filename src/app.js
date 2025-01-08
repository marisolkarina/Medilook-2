import express from 'express';
import productRouter from "./routes/productRouter.js";
import cartRouter from "./routes/cartRouter.js";

const PORT = 8080;
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));


app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);

app.listen(PORT, () => {
    console.log("Server on port", PORT);
})