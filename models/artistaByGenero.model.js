
module.exports = (sequelize, Sequelize) => {
    const ArtistaByGenero = sequelize.define("artistaByGenero", {
        genero_id: {
            type: Sequelize.INTEGER
        },
        artist_id: {
            type: Sequelize.INTEGER
        }
    });
    return ArtistaByGenero;
}
