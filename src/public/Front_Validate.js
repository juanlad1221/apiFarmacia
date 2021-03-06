const FrontValidate = {
    input:function(id, schema, config_msg_error){
        //Valido la entrada de parametros
        if (id == '' || id == ' ' || typeof(id) == 'undefined' || id == null){console.log('Error: el prarmetro id debe contener un string'); return false}
        if (!Array.isArray(schema) || schema == '' || typeof(schema) == 'undefined' || schema == ' ' || schema == null || schema.length == 0){console.log('Error: el prarmetro schema debe ser array'); return false}
        if (config_msg_error == '' || config_msg_error == ' ' || typeof(config_msg_error) == 'undefined' || config_msg_error == null){console.log('Error: el prarmetro config_msg_error debe ser string'); return false}
        
    
        //Creo el objeto input
        let input = document.getElementById(id);
        let value = input.value;
        let cont = 0;
        let flag = null;
        let val;
        let key;
        
        //Pongo a cero el objeto
        let result ={};
        

        //Separo el string en array
        let array_= Array.from(value);
        
        //Recorro el array
         schema.forEach((elem) => {
             
            //Obtiene la key y value de un objeto
             if(typeof(elem) == 'object'){
                 val = Number(Object.values(elem));
                 key = String(Object.keys(elem));
                 elem = key;
            }

            

            //Segun cada elemento del array actua.
            switch (elem) {
                case 'presence':
                    cont = 0;
                    array_.forEach((e)=>{
                        if(e == ' '){
                            cont++
                        }
                    })
                    if (array_.length == cont ) {
                        result['presence'] = true;
                    }else{
                        result['presence'] = false;
                    }
                break;
                case 'no_numbers':
                    let num = new RegExp('[0-9]');
                    result['no_numbers'] = false;
                    
                    array_.forEach((e)=>{
                        if (num.test(e)){
                            result['no_numbers'] = true;
                        }
                    })
                break;
                case 'no_letters':
                    cont = 0;
                    let a_z = new RegExp('[a-z]');
                    result['no_letters'] = false;
                    
                    //Busco todo vacio
                    array_.forEach((e)=>{
                            if(a_z.test(e)){
                                result['no_letters'] = true;
                            }
                    })
                break;
                case 'NO_LETTERS':
                    cont = 0;
                    let A_Z = new RegExp('[A-Z]');
                    result['NO_LETTERS'] = false;
                    
                    //Busco todo vacio
                    array_.forEach((e)=>{
                        if(A_Z.test(e)){
                            result['NO_LETTERS'] = true;
                        }
                    })
                break;
                case 'no_space':
                result['no_space'] = false;
                array_.forEach((e)=>{
                    if(e == ' '){
                        result['no_space'] = true;
                    }
                })
                break;
                case 'min':
                    result['min'] = false;
                    if (array_.length < val){
                        result['min'] = true;
                    }
                break;
                case 'max':
                    result['max'] = false;
                    if (array_.length > val){
                        result['max'] = true;
                    }
                break;
            }//end switch
         })//end for_rach

         
         if (config_msg_error == 'windows'){
            //Muestro msg Error
            schema.forEach((i) => {
                if(typeof(i) == 'object'){
                 i = String(Object.keys(i));
                 if(result[i] == true){
                    alert(`Error: ${i} en ${input.placeholder}...`);
                    return false;
                 }
                }else{
                    if(result[i] == true){
                    alert(`Error: ${i} en ${input.placeholder}...`);
                    return false;
                    }
                }
            })//end for
         }
         //alert(Object.values(result))
         //Recorro el array result y si encutro algun false 
         //pongo flag a true
         for (let i in result){
            if (result[i] == true){
                flag = true;
                break;
            }else{
                flag = false;
            }
         }
         
         //alert(Object.values(result))
         //Segun flags envio true o false como return.
         if (flag == false){
            return false;
         }else{
             return true;
         }
    }//end input
}//end object

