const mysql2 = require('mysql2');

const dbconnection = mysql2.createPool({
    host: process.env.DB_HOST || 'metro.proxy.rlwy.net',
    port: process.env.DB_PORT || 44640,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'railway',
    connectionLimit: 10,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
})



// dbconnection.execute("select 'hello jo' ", (err,result)=>{
//     if(err){
//         console.log(err.message)
//     }else{
//         console.log(result)
//     }
// })


module.exports = dbconnection.promise();