
const dbConfig = require("../config/db.config");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD,
    {
        host: dbConfig.HOST,
        dialect: dbConfig.dialect,
    }
);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.artistas = require("./artista.model")(sequelize, Sequelize);

db.albums = require("./album.model")(sequelize, Sequelize);
db.artistas.hasMany(db.albums, { as: "artista_id" });
db.albums.belongsTo(db.artistas, {
    foreignKey: "artista_id",
    as: "artista",
});

db.canciones = require("./cancion.model")(sequelize, Sequelize);
db.albums.hasMany(db.canciones, { as: "album_id" });
db.canciones.belongsTo(db.albums, {
    foreignKey: "album_id",
    as: "album",
});
db.artistas.hasMany(db.canciones, { as: "artists_id" });
db.canciones.belongsTo(db.artistas, {
    foreignKey: "artists_id",
    as: "artista",
});

db.generos = require("./genero.model")(sequelize, Sequelize);

db.artistasByGeneros = require("./artistaByGenero.model")(sequelize, Sequelize);
db.generos.hasMany(db.artistasByGeneros, { as: "genero_id" });
db.artistasByGeneros.belongsTo(db.generos, {
    foreignKey: "genero_id",
    as: "genero",
});
db.artistas.hasMany(db.artistasByGeneros, { as: "artist_id" });
db.artistasByGeneros.belongsTo(db.artistas, {
    foreignKey: "artista_id",
    as: "artista",
});

module.exports = db;
