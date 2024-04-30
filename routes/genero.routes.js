
module.exports = app => {
    const controller = require("../controllers/genero.controller.js");
    let router = require("express").Router();
    
    router.get("/", controller.listGeneros);
    router.get("/:id", controller.getGenero);
    router.post("/create", controller.createGenero);
    router.put("/:id/edit", controller.updateGenero);
    router.patch("/:id/edit", controller.updateGenero);
    router.delete("/:id/delete", controller.deleteGenero);
    router.post("/:id/generoPicture", controller.uploadPictureGenre)

    app.use('/api/generos', router);
}
