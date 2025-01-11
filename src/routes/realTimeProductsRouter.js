import { Router } from "express";

const router = Router();

router.get('/', (req,res)=>{
    res.render('realTimeProducts',{
        title: 'Productos Medilook'
    })
});

router.post('/', (req, res) => {
    try {
        const urlImagen = `/image/${req.file.filename}`;
        res.json({success: true, urlImagen: urlImagen});
    } catch (err) {
        res.status(500).json({success: false, message: err.message });
    }
});

export default router;