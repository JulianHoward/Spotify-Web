
module.exports = app => {
    //rutas de acceso
    require('./artista.routes')(app);
    require('./genero.routes')(app);
    require('./album.routes')(app);
    require('./cancion.routes')(app);
    require('./artistaByGenero.routes')(app);
}
