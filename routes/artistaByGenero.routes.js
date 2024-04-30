
module.exports = app => {
    const controller = require("../controllers/artistaByGenero.controller.js");
    let router = require("express").Router();

    router.get("/", controller.listArtistasByGenero);
    router.get("/:genero_id", controller.getArtistasByGenero);
    router.post("/", controller.createArtistaByGenero);
    router.put("/:id", controller.updateArtistaByGenero);
    router.patch("/:id", controller.updateArtistaByGenero);
    router.delete("/:id", controller.deleteArtistaByGenero);

    app.use('/api/artistasByGenero', router);
}
