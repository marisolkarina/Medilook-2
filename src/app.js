import express from 'express';
import handlebars from 'express-handlebars';
import __dirname from './utils/utils.js';
import { dirname } from 'node:path';
import viewRouter from './routes/homeRouter.js';
import productRouter from "./routes/productRouter.js";
import cartRouter from "./routes/cartRouter.js";
import multer from 'multer';
import { storage } from './utils/multer.js';
import { Server } from 'socket.io';
import { productManager } from './managers/productManager.js';

const PORT = 8080;
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));

app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);

const httpServer = app.listen(PORT, () => {
    console.log("Server on port", PORT);
});

app.engine('hbs', handlebars.engine({
    extname: '.hbs'
}));
app.set('views', dirname(__dirname) + '/views');
app.set('view engine', 'hbs');
app.use(express.static(dirname(__dirname) + '/public'));

const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/webp'
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

app.use(multer({ storage: storage, fileFilter: fileFilter }).single('image'));

app.use('/', viewRouter);


const ioServer = new Server(httpServer);

ioServer.on('connection', async (socket) => {
    console.log('nuevo user conectado', socket.id);

    const productos = await productManager.getProducts();
    socket.emit('home', productos);
});