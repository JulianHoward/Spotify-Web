
module.exports = app => {
    const controller = require("../controllers/artista.controller.js");
    let router = require("express").Router();

    router.get("/", controller.listArtistas);
    router.get("/:id", controller.getArtista);
    router.post("/", controller.createArtista);
    router.put("/:id", controller.updateArtista);
    router.patch("/:id", controller.updateArtista);
    router.delete("/:id", controller.deleteArtista);
    router.post("/:id/artistaPicture", controller.uploadPictureArtist);

    app.use('/api/artistas', router);
}
