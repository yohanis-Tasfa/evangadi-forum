const mysql2 = require('mysql2');

const dbconnection = mysql2.createPool({
    host: process.env.HOST || 'metro.proxy.rlwy.net',
    port: process.env.DB_PORT || 44640,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    connectionLimit: 10,
    ssl: process.env.NODE_ENV === 'production' && process.env.HOST ? { rejectUnauthorized: false } : false
})



// dbconnection.execute("select 'hello jo' ", (err,result)=>{
//     if(err){
//         console.log(err.message)
//     }else{
//         console.log(result)
//     }
// })


module.exports = dbconnection.promise();