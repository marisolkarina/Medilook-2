import { Router } from "express";

const router = Router();
router.get('/realTimeProducts', (req, res) => {
    res.render('realTimeProducts', {});
});

router.get('/', (req, res) => {
    res.render('home', {});
});

export default router;