const sqlite = require('sqlite3').verbose();
let sql;
const db = new sqlite.Database('./database/store.db',sqlite.OPEN_READWRITE, (err) => {
    if (err) return console.error(err);
});

// Creates all tables
sqltask_detail = 'CREATE TABLE IF NOT EXISTS task_detail (task_id INTEGER PRIMARY KEY,task_name TEXT, task_description TEXT, task_end_time DATETIME, task_status INTEGER DEFAULT 0)'
db.run(sqltask_detail);
// db.run(sqltask);

function create_task(task_name, task_description, task_end_time){
    queryInsert = `INSERT INTO task_detail (task_name, task_description, task_end_time) VALUES (?,?,?)`;
    db.run(queryInsert,[task_name, task_description, task_end_time], (err)=>{
        if (err) return console.log(err);
    });
};

function all_task_details(callback){
    queryAll = `SELECT * FROM task_detail`;
    db.all(queryAll,(err, rows)=>{
        if (err) return console.log(err);
        callback(rows);
    });

}

module.exports = {create_task, all_task_details};

//module.exports = {create_topic, create_task_and_insert_task_detail, run_query, get_task_details, select_task, edit_task, delete_task, change_status, delete_topic};
