class Validar{
    //SIN CONSTRUCTOR
    
    
    alfanumerico(valor){
        valor = String(valor);
        let cadena = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","ñ","o","p","q","r","s","t","u","v","w","x","y","z",".","1","2","3","4","5","6","7","8","9","0","A","B","C","D","E","F","G","H","I","J","O","P","Q","R","S","T","U","V","W","X","Y","Z","-","_"];
    
        for(var i= 0; i < valor.length; i++){
            if(cadena.includes(valor[i]) == false){
                return false;
               }
        }
        
        return valor;
    }//end function

    password(valor){
        valor = String(valor);
        if(valor == '' || valor == ' ' || valor == 'undefined' || valor == null){
            return false;
        }
        return valor;
    }//end function
    
    
    entero(valor){
        if (!Number.isInteger(valor)){
            return false;
        }
        
        return valor
        
    }//end function
    
    
}//end class 



module.exports = Validar;