import express from 'express';
import handlebars from 'express-handlebars';
import __dirname from './utils.js';
import viewRouter from './routes/viewRouter.js';
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
});

app.engine('hbs', handlebars.engine({
    extname: '.hbs'
}));
app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));
app.use('/', viewRouter);
