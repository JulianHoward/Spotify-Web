
module.exports = app => {
    const controller = require("../controllers/album.controller.js");
    let router = require("express").Router();

    router.get("/", controller.listAlbums);
    router.get("/:id", controller.getAlbums);
    router.post("/", controller.createAlbum);
    router.put("/:id", controller.updateAlbum);
    router.patch("/:id", controller.updateAlbum);
    router.delete("/:id", controller.deleteAlbum);
    router.post("/:id/albumPicture", controller.uploadPictureAlbum);

    app.use("/api/albums", router);
}
