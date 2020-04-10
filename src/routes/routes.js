const express = require("express");
var ObjectId = require('mongoose').Types.ObjectId;
const path = require('path');
const Joi = require('@hapi/joi');
const bcrypt = require('bcryptjs');
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const jwt = require('jsonwebtoken');
//Shemas
const User = require('../schemas/Users')
const Farmacias = require('../schemas/Farmacias')
const Schema = require('../schemas/Schema')



//Creo el obj router
const router = express.Router();




router.get('/login', IsNotAuthenticated, function (req, res) {
  global.error = '';
  res.status(200).render('../views/login')
})//end get

router.post('/login', passport.authenticate('local-login', {
  successRedirect: '/home',
  failureRedirect: '/msg_error',
  passReqToCallback: true
}))//end post

router.get("/logout", IsAuthenticated, function (req, res) {
  req.logOut();
  res.redirect('/login');
})//end get

router.get('/msg_error', IsAuthenticated, function (req, res) {
  //console.log(req.body)
  res.status(200).render('../views/msg_error')

})//end get

router.get('/msg_ok', IsAuthenticated, function (req, res) {
  res.status(200).render('../views/msg_ok', { message: 'Usuario Creado Correctamente' })
})//end get

router.get('/home', IsAuthenticated, function (req, res) {
  console.log(req.user)
  res.status(200).render('../views/home', { pin: req.user.pin, user: req.user.username })
})//end get

router.get('/usuarios', IsAuthenticated, function (req, res) {
  let usuario_actual = req.user._id;
  let user = req.user.username;

  User.find({ active: true }).exec(function (err, docs) {
    res.status(200).render('../views/usuario', { data: docs, usuario_actual, user })
  })
})//end get

router.post('/usuarios', IsAuthenticated, function (req, res) {
  const schema = Joi.object({
    user: Joi.string()
      .alphanum()
      .min(4)
      .max(15)
      .required(),

    pass: Joi.string()
      .alphanum()
      .min(4)
      .max(15)
      .required(),

    pin: Joi.number()
      .integer()
      .min(4)
      .max(4)
      .required()

  })//end joi

  const { error, value } = schema.validate({
    user: req.body.user,
    pass: req.body.pass,
    pin: Number(req.body.pin)
  });

  //controlo el resultado
  if (Object.keys(value).length != 0) {
    let user = new User()

    user.username = req.body.user;
    user.password = bcrypt.hashSync(req.body.pass, 8);
    user.pin = req.body.pin
    user.save(function (err) {
      if (err) throw err;
      console.log('Nuevo Usuario Creado...')
      //res.status(200).render('../views/msg_ok',{message:'Usuario Creado Exitosamente'})
      res.status(200).json({ message: true })
    })
  } else {
    console.log('Error in server. Date Validations...')
    res.status(500).send('Error in server. Date Validations')
  }
})//end post

router.get('/usuarios_nuevo', IsAuthenticated, function (req, res) {

  res.status(200).render('../views/usuario_nuevo', { user: req.user.username })
})//end get

router.delete('/delete', IsAuthenticated, function (req, res) {
  //console.log(req.body.user)
  User.where({ active: true, _id: ObjectId(req.body.user) }).updateOne({ active: false }).exec(function (err) {
    console.log('Se actualizo Correctamente...')
    res.json({ success: true })
  })
})//end delete

router.get('/farmacias', IsAuthenticated, function (req, res) {
  Farmacias.where({ active: true }).exec(function (err, docs) {
    res.status(200).render('../views/farmacias', { data: docs, user: req.user.username })
  })

})//end get

router.post('/test', IsAuthenticated, function (req, res) {
  Farmacias.where({ active: true, _id: ObjectId(req.body.farm) }).updateOne({ active: false }).exec(function (err) {
    console.log('Se actualizo Correctamente...')
    res.json({ success: true })
  })
})//end post

router.get('/farmacias_nuevo', IsAuthenticated, function (req, res) {
  if (global.data == true) {
    global.data = '';
    res.status(200).render('../views/farmacia_nueva', { message: true, user: req.user.username })
  } else {
    res.status(200).render('../views/farmacia_nueva', { message: '', user: req.user.username })
  }

})//end get

router.post('/farmacias_nueva', IsAuthenticated, function (req, res) {
  const schema = Joi.object({
    name: Joi.string()
      .alphanum()
      .max(15)
      .required(),

    address: Joi.string()
      .alphanum()
      .max(20)
      .required(),

    phone: Joi.number()
      .integer()
      .max(10)
      .required(),

    mobil: Joi.number()
      .integer()
      .max(10)
      .required()
  })//end joi

  //Evaluo los datos recividos contra mi schema
  const { error, value } = schema.validate({
    name: req.body.name,
    address: req.body.address,
    phone: Number(req.body.phone),
    mobil: Number(req.body.mobil)
  });

  //controlo el resultado
  if (Object.keys(value).length != 0) {
    let farm = new Farmacias();

    farm.name = req.body.name;
    farm.address = req.body.address;
    farm.phone = req.body.phone;
    farm.movil = req.body.mobil;
    farm.location = 'Barranqueras';
    farm.save(function (err) {
      if (err) throw err;
      console.log('Farmacia Creada Satisfactoriamente...');
      global.data = '';
      global.data = true;
      //res.status(200).redirect('/farmacias_nuevo');
      res.status(200).json({ message: true })
    })
  } else {
    console.log('Error in server. Date Validations...')
    res.status(500).send('Error in server. Date Validations')
  }


})//end post


router.get('/crearSchema', IsAuthenticated,function (req, res) {
  Schema.where({ active:true }).exec(function (err, docs) {
    if (err) throw err;
    console.log('Consulta a Schema Exitosa...');

    let array = []
    
    for(let i in docs){
      docs[i].dates.forEach(function(e){
        array.push(formatear_a_dd_mm_yyyy(e))
      })//end foreach
    }//end for
    
    global.fe = array
    
    Farmacias.where({ active: true }).exec(function (err2, docs2) {
      if (err2) throw err2;
      console.log('Consulta a Farmacias Exitosa...');
      res.status(200).render('../views/cargar_fechas', { schema: docs, farmacias: docs2, user: req.user.username, array })
    })
  })

})//end get

router.get('/fechas',IsAuthenticated, function(req,res){
  res.status(200).json({data:global.fe})
})//end get
  
router.post('/crearSchema', IsAuthenticated, async function (req, res) {
  const schema_ = Joi.object({
    dates: Joi.array().items(Joi.string(), Joi.required(), Joi.date().greater('01/01/1974')),
    name: Joi.string().required(),
    id: Joi.string().required(),
    address: Joi.string().required()
  })

  const { error, value } = schema_.validate({
    dates: req.body.data.dates,
    name: req.body.data.name,
    id: req.body.data.id,
    address: req.body.data.address
  })

  //controlo el resultado
  if (typeof (error) === 'undefined') {

    const exists = await Schema.exists({ active: true, id: req.body.data.id }); // returns true or false
    //Si existe
    if (exists) {
      console.log('Error in Server: Shema ya existe...');
      res.status(500).end()
      return false;
    }

    //Si NO existe
    Farmacias.where({ active: true, _id: req.body.data.id }).exec(function (err, docs) {
      if (err) throw err;

      //Controlo que exista farmacia
      if (docs.length == 0) {
        console.log('Error: server Farmacia NO Existe...');
        res.status(500).end()
        return false;
      }

      //Si existe farmacia
      console.log('Consulta a Farmacias ok...');
      let phone = docs[0].phone;
      let movil = docs[0].movil;
      let location = docs[0].location;

      //Creo nuevo schema
      let array = req.body.data.dates;

      let schema = new Schema();
      schema.id = ObjectId(req.body.data.id);
      schema.name = req.body.data.name;
      schema.address = req.body.data.address;
      schema.phone = Number(phone);
      schema.movil = Number(movil);
      schema.location = location;
      //Recorro el array e inserto fechas
      array.forEach(function (e) {
        schema.dates.push(e)
      })
      schema.save(function (err) {
        if (err) throw err;
        console.log('Nuevo Schema Creado...')
        res.status(200).json({ success: true, msg: 'Nuevo Shema Creado...' })
        return false
      })//end save*
    })//end farmacias*

  } else {
    console.log('Error: server validations joi...');
    res.status(500).json({ success: false, msg: 'Error: server validations joi...' });
    return false;
  }
})//end post

router.get('/schemas', IsAuthenticated, function (req, res) {
  Schema.where({ active: true }).exec(function (err, docs) {
    if (err) throw err;
    console.log('Consulta a schema ok...');

    res.status(200).render('../views/schemas', { user: 'juan', data: docs })
  })//end schema
})//end get

router.put('/down_schema', IsAuthenticated, function (req, res) {
  Schema.where({ active: true, _id: ObjectId(req.body.id_schema) }).updateOne({ active: false }).exec(function (err) {
    if (err) throw err;

    console.log('Schema se actualizo correctamente...')
    res.status(200).send('ok')
  })
})//end put

router.get('/api/farmacias/:id', IsNotAuthenticated,function (req, res) {
  //Defino variables
  let hoy = new Date()
  let dia = new Date()
  let mañana =  new Date(dia.setDate(dia.getDate() + 1))  
  let pasado_mañana = new Date(dia.setDate(dia.getDate() + 1))
  let obj = {}
  let obj2 = {}
  let obj3 = {}
  let array = [];
  
  //Consulto schemas
  Schema.where({ active: true }).exec(function (err, docs) {
    if (err) throw err;
    
    //Busco en schema la farmacia de hoy
    for (let i in docs) {
      docs[i].dates.forEach(function (e) {
        
        if (DateIsEqual(e, hoy)) {
          obj.id = docs[i]._id;
          obj.name = docs[i].name;
          obj.address = docs[i].address;
          obj.phone = docs[i].phone;
          obj.movil = docs[i].movil;
          obj.location = docs[i].location;
          obj.date = hoy;
          array.push(obj);
          //console.log(1)
        }

        if (DateIsEqual(e, mañana)) {
          obj2.id = docs[i]._id;
          obj2.name = docs[i].name;
          obj2.address = docs[i].address;
          obj2.phone = docs[i].phone;
          obj2.movil = docs[i].movil;
          obj2.location = docs[i].location;
          obj2.date = mañana;
          array.push(obj2)
          //console.log(2)
        }

        if (DateIsEqual(e, pasado_mañana)) {
          obj3.id = docs[i]._id;
          obj3.name = docs[i].name;
          obj3.address = docs[i].address;
          obj3.phone = docs[i].phone;
          obj3.movil = docs[i].movil;
          obj3.location = docs[i].location;
          obj3.date = pasado_mañana;
          array.push(obj3)
          //console.log(3)
        }

      })
    }//end for
    
    switch (req.params.id){
      case '1':
	    let arr = []
        array.forEach(function(e){
          if(DateIsEqual(e.date, hoy)){
	           arr.push(e)
            res.status(200).json({success:true, data:arr})
          }
        })
      break;

      case '2':
        let array2 = []
        array.forEach(function(e){
          if(DateIsEqual(e.date, hoy)){
            array2.push(e)
          }
        })

        array.forEach(function(e){
          if(DateIsEqual(e.date, mañana)){
            array2.push(e)
          }
        })
        res.status(200).json({success:true, data:array2})
      break;

      case '3':
        let array3 = []
        array.forEach(function(e){
          if(DateIsEqual(e.date, hoy)){
            array3.push(e)
          }
        })

        array.forEach(function(e){
          if(DateIsEqual(e.date, mañana)){
            array3.push(e)
          }
        })

        array.forEach(function(e){
          if(DateIsEqual(e.date, pasado_mañana)){
            array3.push(e)
          }
        })
        res.status(200).json({success:true, data:array3})
      break;

      default:
        res.status(404).json({success:false, data:'no data...'})
      break;
    }//end switch
  })//end schema
})//end get


router.get('/test', function(req, res){
  let hoy = Date.now()
  let hoy2 = new Date()
  let hoy3 = new Date(2020,2,3)
  
  console.log(DateIsEqual(hoy2, hoy3))


  
  function DateIsEqual(f1,f2){
    if(f1.getDate() === f2.getDate() && f1.getMonth() === f2.getMonth() && f1.getFullYear() === f2.getFullYear()){
      return true;
    }else{
      return false;
    }
  }//end DateIsEqual


  console.log(hoy2, hoy3)

res.send('ok')
})




//Functions
//Objeto que convierte string en capitalize
String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

function Invertir_fecha_de_dd_mm_yyyy_a_yyyy_mm_dd(fecha) {
  let dia_;
  let mes_;
  let año_;
  let fecha_ = new String(fecha)

  if (fecha_.length === 10) {
    dia_ = fecha_.substring(0, 2);
    mes_ = fecha_.substring(3, 5);
    año_ = fecha_.substring(6, 10);
  }
  if (fecha_.length === 9) {
    dia_ = '0' + fecha_.substring(0, 1);
    mes_ = fecha_.substring(2, 4);
    año_ = fecha_.substring(5, 9);
  }
  if (fecha_.length === 8) {
    dia_ = '0' + fecha_.substring(0, 1);
    mes_ = fecha_.substring(2, 3);
  }

  return (mes_)
} //fin formatear fecha


function DateIsEqual(f1,f2){
  if(f1.getDate() === f2.getDate() && f1.getMonth() === f2.getMonth() && f1.getFullYear() === f2.getFullYear()){
    return true;
  }else{
    return false;
  }
}//end DateIsEqual




function formatear_a_dd_mm_yyyy(fecha) {
  let nueva_fecha = fecha;
  let dia_ = String(nueva_fecha.getDate());
  let mes_ = String((nueva_fecha.getMonth() + 1));
  let año_ = nueva_fecha.getFullYear();
  if (dia_.length == 1) {
    dia_ = '0' + dia_;
  }
  if (mes_.length == 1) {
    mes_ = '0' + mes_;
  }
  return String(dia_ + '/' + mes_ + '/' + año_)
} //fin

function IsAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/login");
  }
}

function IsNotAuthenticated(req, res, next) {
  if (!req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/home");
  }
}






//Exporto las rutas
module.exports = router;
