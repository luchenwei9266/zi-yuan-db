const dyttReptitle = require('dytt-reptitle-v2');
const schedule = require('node-schedule');
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'A1140910124',
    database: 'DATALIST'
});

connection.connect();

function dealData(data) {
    var result = [];
    data.forEach(item => {
        result.push(Object.values(item));
    });
    return result;
}

const scheduleCronstyle = () => {
    //每分钟的第30秒定时执行一次:
    schedule.scheduleJob('30 * * * * *', () => {
        var sql = `DELETE FROM dataList`;
        connection.query(sql, (error, results, fields) => {
            if (error)
                return console.error(error.message);

            console.log('clear data');

            var config = {
                page: 1,
                skip: 0,
                include: ['title', 'imgUrl', 'desc', 'downloadLink', 'descPageLink']
            };

            setTimeout(function() {
                dyttReptitle(config).then(result => {
                    var addSql = 'INSERT INTO dataList(title,imgUrl,`desc`,downloadLink,descPageLink) VALUES ?';
                    var values = dealData(result);
                    connection.query(addSql, [values], function(err, result) {
                        if (err) throw err;
                        console.log('reset data');
                    });
                });
            }, 2000);

        });
    });
}

scheduleCronstyle();