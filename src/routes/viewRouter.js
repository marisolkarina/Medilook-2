import { Router } from "express";
import { productManager } from '../managers/productManager.js';

const router = Router();

router.get('/', async (req, res, next) => {
    try {
        const productos = await productManager.getProducts();
        res.render('home', {
            title: 'Productos Medilook',
            prods: productos,
            hayProductos: productos.length !== 0
        });
    } catch (err) {
        next(err);
    }
});

router.get('/realTimeProducts', (req, res) => {
    res.render('realTimeProducts', {});
});

export default router;