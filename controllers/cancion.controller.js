const multer = require("multer");
const db = require("../models");
const { sendError500, checkRequiredFields } = require("../utils/request.utils");

exports.listCanciones = async (req, res) => {
  try {
    const cancion = await db.canciones.findAll({
      include: ["album"],
    });
    res.send(cancion);
  } catch (error) {
    sendError500(res);
  }
};

exports.getCanciones = async (req, res) => {
  const id = req.params.id;
  try {
    const cancion = await db.canciones.findByPk(id, {
      include: ["album"],
    });
    if (!cancion) {
      res.status(404).send({ message: "Cancion no encontrada" });
      return;
    }
    res.send(cancion);
  } catch (error) {
    sendError500(res);
  }
};

exports.createCancion = async (req, res) => {
  const requiredFields = ["nombre", "album_id"];
  const fieldsWithErrors = checkRequiredFields(requiredFields, req.body);
  if (fieldsWithErrors.length > 0) {
    res.status(400).send({
      message: `Faltan los siguientes campos: ${fieldsWithErrors.join(", ")}`,
    });
    return;
  }
  try {
    // Comprueba si el album existe antes de crear la cancion
    const albumExists = await db.albums.findByPk(req.body.album_id);
    if (!albumExists) {
      res.status(400).send({
        message: `El album con ID ${req.body.album_id} no existe.`,
      });
      return;
    }

    const cancion = await db.canciones.create(req.body);
    res.send(cancion);
  } catch (error) {
    sendError500(res);
  }
};

exports.updateCancion = async (req, res) => {
  const id = req.params.id;
  try {
    const cancion = await db.canciones.findByPk(id);
    if (!cancion) {
      res.status(404).send({ message: "Canción no encontrada" });
      return;
    }
    if (req.method === "PUT") {
      const requiredFields = ["nombre", "album_id"];
      const fieldsWithErrors = checkRequiredFields(requiredFields, req.body);
      if (fieldsWithErrors.length > 0) {
        res.status(400).send({
          message: `Faltan los siguientes campos: ${fieldsWithErrors.join(
            ", "
          )}`,
        });
        return;
      }
    }
    const albumExists = await db.albums.findByPk(req.body.album_id);
    if (!albumExists) {
      res.status(400).send({
        message: `El álbum con ID ${req.body.album_id} no existe.`,
      });
      return;
    }
    await db.canciones.update(req.body, {
      where: {
        id: id,
      },
    });
    res.send({ message: "Canción actualizada" });
  } catch (error) {
    sendError500(res, error);
    console.error(error);
  }
};

exports.deleteCancion = async (req, res) => {
  const id = req.params.id;
  try {
    const cancion = await db.canciones.findByPk(id);
    if (!cancion) {
      res.status(404).send({ message: "Canción no encontrada" });
      return;
    }
    await db.canciones.destroy({
      where: {
        id: id,
      },
    });
    res.send({ message: "Canción eliminada" });
  } catch (error) {
    sendError500(res, error);
    console.error(error);
  }
};

exports.uploadSong = async (req, res) => {
    const id = req.params.id;
    try {
        // Configurar el almacenamiento de multer
        const storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, "./pu4/songs");
            },
            filename: function (req, file, cb) {
                cb(null, id + ".mp3");
            },
        });

        // Subir el archivo
        const upload = multer({ storage: storage }).single("link");
        upload(req, res, async function (err) {
            if (err) {
                res.status(500).send({ message: "Error al subir la canción" });
                return;
            }
            // Crear una nueva entrada en la base de datos para la canción
            await db.canciones.update({
                link: req.file.path
            },
            {
                where: {
                    id: id
                }
            }
        );
            
            res.send({ message: "Canción subida", audioUrl: req.file.path });
        });
    } catch (error) {
        sendError500(res);
    }
}

