const expess = require('express');
const cookieParser = require('cookie-parser');


const Routes = require('./Routers/auth.routes');
const movieRoutes = require("./Routers/movie.routes")
const favoriteRoutes = require("./Routers/favorite.routes")




const app = expess();
app.use(expess.json());
app.use(cookieParser())

app.use('/auth', Routes);
app.use("/movies", movieRoutes)
app.use("/favorites", favoriteRoutes)


module.exports = app;