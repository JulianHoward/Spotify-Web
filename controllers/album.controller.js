
const multer = require("multer");
const db = require("../models");
const { sendError500, checkRequiredFields } = require("../utils/request.utils");

exports.listAlbums = async (req, res) => {
    try {
        const albums = await db.albums.findAll({
            include: ["artista"]
        });
        res.send(albums);
    } catch (error){
        sendError500(res);
    }
}

exports.getAlbums = async (req, res) => {
    const id = req.params.id;
    try {
        const album = await db.albums.findByPk(id, {
            include: ["artista"]
        });
        if (!album) {
            res.status(404).send({ message: "Album no encontrado" });
            return;
        }
        res.send(album);
    } catch (error) {
        sendError500(res);
    }
}

exports.createAlbum = async (req, res) => {
    const requiredFields = ["nombre", "artista_id"];
    const fieldsWithErrors = checkRequiredFields(requiredFields, req.body);
    if (fieldsWithErrors.length > 0) {
        res.status(400).send({
            message:
                `Faltan los siguientes campos: ${fieldsWithErrors.join(", ")}`
        });
        return;
    }
    try {
        // Comprueba si el artista existe antes de crear el álbum
        const artistExists = await db.artistas.findByPk(req.body.artista_id);
        if (!artistExists) {
            res.status(400).send({
                message: `El artista con ID ${req.body.artista_id} no existe.`
            });
            return;
        }

        const album = await db.albums.create(req.body);
        res.send(album);
    } catch (error) {
        sendError500(res);
    }
}

exports.updateAlbum = async (req, res) => {
    const id = req.params.id;
    try {
        const album = await db.albums.findByPk(id);
        if (!album) {
            res.status(404).send({ message: "Álbum no encontrado" });
            return;
        }
        if (req.method === "PUT") {
            const requiredFields = ["nombre", "artista_id"];
            const fieldsWithErrors = checkRequiredFields(requiredFields, req.body);
            if (fieldsWithErrors.length > 0) {
                res.status(400).send({
                    message:
                        `Faltan los siguientes campos: ${fieldsWithErrors.join(", ")}`
                });
                return;
            }

            // Comprueba si el artista existe antes de actualizar el álbum
            const artistExists = await db.artistas.findByPk(req.body.artista_id);
            if (!artistExists) {
                res.status(400).send({
                    message: `El artista con ID ${req.body.artista_id} no existe.`
                });
                return;
            }
        }
        await db.albums.update(req.body, {
            where: {
                id: id
            }
        });
        res.send(album);
    } catch (error) {
        sendError500(res);
    }
}

exports.deleteAlbum = async (req, res) => {
    const id = req.params.id;
    try {
        const album = await db.albums.findByPk(id);
        if (!album) {
            res.status(404).send({ message: "Álbum no encontrado" });
            return;
        }
        await db.albums.destroy({
            where: {
                id: id
            }
        });
        res.send({ message: "Álbum eliminado" });
    } catch (error) {
        sendError500(res);
    }
}

exports.uploadPictureAlbum = async (req, res) => {
    const id = req.params.id;
    try {
      const album = await db.albums.findByPk(id);
      if (!album) {
        res.status(404).send({ message: "Álbum no encontrado" });
        return;
      }
      const storageAlbum = multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, "./pu3/images/albums");
        },
        filename: function (req, file, cb) {
          cb(null, req.params.id + ".png");
        },
      });
  
      const uploadAlbum = multer({ storage: storageAlbum }).single("imagenUrl");
      uploadAlbum(req, res, async function (err) {
        if (err) {
          res.status(500).send({ message: "Error al subir la imagen" });
          return;
        }
        await db.albums.update(
          { imagenUrl: req.file.path },
          {
            where: { id: id },
          }
        );
        res.send({ message: "Imagen subida" });
      });
    } catch (error) {
      sendError500(res);
    }
  };
