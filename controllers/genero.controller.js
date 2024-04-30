const multer = require("multer");
const db = require("../models");
const { sendError500, checkRequiredFields } = require("../utils/request.utils");

exports.listGeneros = async (req, res) => {
  try {
    const generos = await db.generos.findAll();
    res.send(generos);
  } catch (error) {
    sendError500(res);
  }
};

exports.getGenero = async (req, res) => {
  const id = req.params.id;
  try {
    const genero = await db.generos.findByPk(id);
    if (!genero) {
      res.status(404).send({ message: "Genero no encontrado" });
      return;
    }
    res.send(genero);
  } catch (error) {
    sendError500(res);
  }
};

exports.createGenero = async (req, res) => {
  const requiredFields = ["nombre"];
  const fieldsWithErrors = checkRequiredFields(requiredFields, req.body);
  if (fieldsWithErrors.length > 0) {
    res.status(400).send({
      message: `Faltan los siguientes campos: ${fieldsWithErrors.join(", ")}`,
    });
    return;
  }
  try {
    const genero = await db.generos.create(req.body);
    res.send(genero);
  } catch (error) {
    sendError500(res);
  }
};

exports.updateGenero = async (req, res) => {
  const id = req.params.id;
  try {
    const genero = await db.generos.findByPk(id);
    if (!genero) {
      res.status(404).send({ message: "Genero no encontrado" });
      return;
    }
    if (req.method === "PUT") {
      const requiredFields = ["nombre"];
      const fieldsWithErrors = checkRequiredFields(requiredFields, req.body);
      if (fieldsWithErrors.length > 0) {
        res.status(400).send({
          message: `Faltan los siguientes campos: ${fieldsWithErrors.join(
            ", "
          )}`,
        });
        return;
      }
      await db.generos.update(req.body, {
        where: {
          id: id,
        },
      });
      res.send(genero);
    }
  } catch (error) {
    sendError500(res);
  }
};

exports.deleteGenero = async (req, res) => {
  const id = req.params.id;
  try {
    const genero = await db.generos.findByPk(id);
    if (!genero) {
      res.status(404).send({ message: "Genero no encontrado" });
      return;
    }
    await db.generos.destroy({
      where: {
        id: id,
      },
    });
    res.send({ message: "Genero eliminado" });
  } catch (error) {
    sendError500(res);
  }
};

exports.uploadPictureGenre = async (req, res) => {
  const id = req.params.id;
  try {
    console.log("ID del artista:", id);
    const genero = await db.generos.findByPk(id);
    if (!genero) {
      res.status(404).send({ message: "Genero no encontrado" });
      return;
    }
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, "./public/images/generos");
      },
      filename: function (req, file, cb) {
        cb(null, req.params.id + ".png");
      },
    });

    const upload = multer({ storage: storage }).single("imagenUrl");
    upload(req, res, async function (err) {
      if (err) {
        res.status(500).send({ message: "Error al subir la imagen" });
        return;
      }
      await db.generos.update(
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
