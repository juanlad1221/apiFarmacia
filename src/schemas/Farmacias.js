const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const farmacias_schema = Schema({
    name:                   {type:String, requerid:true},
    address:                {type:String, requerid:true},
    phone:                  {type:Number},
    movil:                  {type:Number},
    location:               {type:String},
    active:                 {type:Boolean, requerid:true, default:true},
    low_motive:             {type:String, default:''}
});

//Exporto modelo
module.exports = mongoose.model('farmacias',farmacias_schema);