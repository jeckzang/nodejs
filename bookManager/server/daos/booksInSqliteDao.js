const sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(':memory:');


db.serialize(function () {

    //create TABLEA;    
    var tableA = `CREATE TABLE IF NOT EXISTS tablea (
        id INTEGER PRIMARY KEY,
        notify_date NUMERIC,
        book_name TEXT NOT NULL,
        yin_ci INTEGER DEFAULT 0,
        price NUMERIC,
        yin_dan_yin_ci INTEGER DEFAULT 0,
        zong_ma_yang NUMERIC
       )`;
    console.log(tableA);

    db.run(tableA);

    // init data    
    var stmt = db.prepare("INSERT INTO tablea VALUES (?,?,?,?,?,?,?)");
    for (var i = 0; i < 10; i++) {
        var datetime = new Date();
        stmt.run(i, datetime.getTime(), "book" + i, i, i, i, i);
        console.log(`insert into db for id:${i}`);
    }
    stmt.finalize();
});

function getAllBooks(page, countPerPage, currentId, orderBy, currentOrderByValue, callback) {
    console.log(`page:${page} countPerPage:${countPerPage} currentId:${currentId} orderBy:${orderBy} currentOrderByValue:${currentOrderByValue}`);
    var orderBySql = "";
    var whereSql = "id > " + currentId;
    if (orderBy) {
        orderBySql = ", " + orderBy;
        whereSql = `(id, ${orderBy}) > (${currentId},${currentOrderByValue})`;
    }

    var sql = `SELECT id, book_name as bookName FROM tablea WHERE ${whereSql} ORDER BY id ${orderBySql} LIMIT ${countPerPage};`;
    console.log(`sql:${sql}`);
    var books = [];
    db.each(sql, function (err, row) {
        var book = {
            id: row.id,
            bname: row.bookName
        }
        books.push(book);
    }, function (err, count) {
        callback(books);
    });

}

module.exports = { getAllBooks };



