const mysql2 = require('mysql2');

const dbconnection = mysql2.createPool({
    host: 'localhost',
    user: 'evangadi admin',
    password: '123456',
    database: 'evangadi-db',
    connectionLimit: 10
})

dbconnection.execute("select 'hello jo' ", (err,result)=>{
    if(err){
        console.log(err.message)
    }else{
        console.log(result)
    }
})