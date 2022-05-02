const knex = require('knex')({
    client: 'mysql',
    connection: {
      host : process.env.HOST,
      user : process.env.USERNAME,
      password : process.env.PASS,
      database : process.env.DB_NAME
    }
});

// Test :
//   knex
//   .from('user')
//   .select('firstname')
//   .then((data) => console.log(data))
//   .catch(err => console.log(err))


module.exports = knex;