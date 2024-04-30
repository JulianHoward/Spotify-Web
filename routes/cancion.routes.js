
module.exports = app => {
    const controller = require("../controllers/cancion.controller.js");
    let router = require("express").Router();

    router.get("/", controller.listCanciones);
    router.get("/:id", controller.getCanciones);
    router.post("/create", controller.createCancion);
    router.put("/:id/edit", controller.updateCancion);
    router.patch("/:id/edit", controller.updateCancion);
    router.delete("/:id/delete", controller.deleteCancion);
    router.post("/:id/cancionAudio", controller.uploadSong);
    
    app.use('/api/canciones', router);
}
