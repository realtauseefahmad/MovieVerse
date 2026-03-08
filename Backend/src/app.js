const expess = require('express');
const cookieParser = require('cookie-parser');

/**
 *  Routers require
 */
const Routes = require('./Routers/auth.routes');
const movieRoutes = require("./Routers/movie.routes")
const favoriteRoutes = require("./Routers/favorite.routes")
const watchRoutes = require("./Routers/watchlist.routes")
const historyRoutes = require("./Routers/history.routes")
const adminRoutes = require("./Routers/admin.routes")




const app = expess();
app.use(expess.json());
app.use(cookieParser())



/**
 * Routers use
 */

app.use('/auth', Routes);
app.use("/movies", movieRoutes)
app.use("/favorites", favoriteRoutes)
app.use("/watchlist", watchRoutes)
app.use("/history", historyRoutes)
app.use("/admin", adminRoutes)


module.exports = app;