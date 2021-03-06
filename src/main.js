const express = require('express');             // framework
const morgan = require('morgan');               // Informacion para developer
const exphbs = require('express-handlebars');    // Motor de plantillas
const path = require('path');                   // Junta paths
const flash = require('connect-flash')
const session = require('express-session')
const MysqlStore= require('express-mysql-session') // Guarda la sesión en la base de datos
const {database} = require('./keys')                // Database Credentials
const passport = require('passport')
//Initializations
const app = express();   // is the app web
require('./lib/passport')   // import passport

// Settings
app.set('port', process.env.PORT|| 5000 );
app.set('views', path.join(__dirname,'views')); //Obtiene la direción del archivo a ejecutar
app.engine('.hbs', exphbs({
    defaultLayout:'main',   // Archivo principal de las plantillas
    layoutsDir: path.join(app.get('views'), 'layouts'),         //junta paths
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs', // Extensión del archivo
    helpers: require('./lib/handlebars')
}));
app.set('view engine', '.hbs')

//Middlewares , se ejecuta cada vez que un usuario haga una petición
app.use(session({
    secret: 'texto_session',    // Cómo guardara las sesiones
    resave: false, // false: para que no se vuelva a renovar la sesión
    saveUninitialized: false, // false: para que no se vuelva a establecer la sesión
    store: new MysqlStore(database) //  No guardar los datos dentro del servidor, si no dentro de la base de datos
}))
app.use(flash());   //Envía mensajes al frotend
app.use(morgan('dev')); // Muestra por consola las peticiones tipo http
app.use(express.urlencoded({
    extended:false  // Los datos que se enviarán son muy sencillas
}));
app.use(express.json()); // Acepta json
app.use(passport.initialize());
app.use(passport.session());


// Global Valiables
app.use((req, res, next)=>{
    app.locals.success =  req.flash('success') // <== Texto de ventana emergente | Exito |
    app.locals.warning = req.flash('warning')   // <== Texto de ventana emergente | Advertencia |
    app.locals.user = req.user; // Almacenamos datos del usuario
    app.locals.exam = req.exam; // Almacenamos Preguntas
    //app.locals.exam = req.d; // Almacenamos Preguntas
    next();
});

// Routers
app.use(require('./routes/index'));  // No es necesario escribir la extension o el nombre si es index
app.use(require('./routes/authentication'));
app.use('/question', require('./routes/data_question'));
app.use('/exam',require('./routes/data_exam'));
app.use('/graphics',require('./routes/graphics'));


// Public <= Código y archivos que el navegador puede acceder
app.use(express.static(path.join(__dirname, 'public')))


//starting the server
app.listen(app.get('port'),()=>{
    console.log('El servidor se está ejecutando en el puerto', app.get('port'));
});