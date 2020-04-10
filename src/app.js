const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');
const passport = require('passport');
const session = require('express-session');
const jwt = require('jsonwebtoken');
// RUTAS
const allRoutes = require('./routes/routes');
// SCHEMAS
//const Eventos = require('./schemas/Eventos');



//------------------------EXPRESS----------------------------------------------------------
const app = express();
//-----------------------------------------------------------------------------------------

// PASSPORT
require('./passport/passport');





//------------------------SETTINGS---------------------------------------------------------
app.set('views', path.join(__dirname, 'views'));
//-----------------------------------------------------------------------------------------








//-------------------------MIDDLEWARE------------------------------------------------------
app.use(logger('dev'));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
//Sessions
app.use(session({
  secret: 'yonome1221',
  cookie: {
    maxAge: (60000 * 30)
  },
  resave: false,
  saveUninitialized: false
}))
//Passport
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  app.locals.error = '';
  next();
});

//------------------------------------------------------------------------------------------




//--------------------------ROUTES----------------------------------------------------------
app.use('/', allRoutes)
//-----------------------------------------------------------------------------------------









//Conexion BD
require('./db_conection/conection');









//--------------------------SERVER---------------------------------------------------------
app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), () => {
  console.log(`Server corriendo en ${app.get('port')}`)
})
//------------------------------------------------------------------------------------------



