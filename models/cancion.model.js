
module.exports = (sequelize, Sequelize) => {
    const Cancion = sequelize.define("cancion", {
        nombre: {
            type: Sequelize.STRING
        },
        album_id: {
            type: Sequelize.INTEGER
        },
        link: {
            type: Sequelize.VIRTUAL,
            get: function () {
                return `http://localhost:3000/songs/${this.id}.mp3`
            }
        }
    });
    return Cancion;
}
