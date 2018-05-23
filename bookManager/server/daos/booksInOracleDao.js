var oracledb = require('oracledb');
var dbConfig = require('./dbconfig.js');


function getAllBooks(page, countPerPage, callback) {
  console.log("getConnection")
  // Get a non-pooled connection
  oracledb.getConnection(
    {
      user: dbConfig.user,
      password: dbConfig.password,
      connectString: dbConfig.connectString
    },
    function (err, connection) {
      if (err) {
        console.error(err.message);
        return;
      }
      connection.execute(
        // The statement to execute
        `SELECT isbn, bname
       FROM po.books OFFSET ${page * countPerPage} ROWS FETCH NEXT ${countPerPage} ROWS ONLY`,

        // The "bind value" 180 for the bind variable ":id"
        [],

        // execute() options argument.  Since the query only returns one
        // row, we can optimize memory usage by reducing the default
        // maxRows value.  For the complete list of other options see
        // the documentation.
        {
          maxRows: Number(countPerPage)
          //, outFormat: oracledb.OBJECT  // query result format
          //, extendedMetaData: true      // get extra metadata
          //, fetchArraySize: 100         // internal buffer allocation size for tuning
        },

        // The callback function handles the SQL execution results
        function (err, result) {
          if (err) {
            console.error(err.message);
            doRelease(connection);
            return;
          }
          // meta [{name:'tset'},{name:'colum2'}]
          // row ['test','columns']

          var indexMap = {};
          for (i = 0; i < result.metaData.length; i++) {
            indexMap[result.metaData[i].name] = i;
          }
          console.log(`indexs:${indexMap}`);
          var books = [];
          result.rows.forEach(element => {
            var book = {
              isbn: element[indexMap['ISBN']],
              bname: element[indexMap['BNAME']]
            }
            books.push(book);
          });
          callback(books);
          doRelease(connection);
        });
    });
}

// Note: connections should always be released when not needed
function doRelease(connection) {
  connection.close(
    function (err) {
      if (err) {
        console.error(err.message);
      }
    });
}

module.exports = { getAllBooks };