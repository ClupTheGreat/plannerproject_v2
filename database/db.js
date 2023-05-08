const sqlite = require('sqlite3').verbose();
let sql;
const bcrypt = require('bcrypt');
const db = new sqlite.Database('./database/store.db',sqlite.OPEN_READWRITE, (err) => {
    if (err) return console.error(err);
});

// Creates all tables
sqltask_detail = 'CREATE TABLE IF NOT EXISTS task_detail (task_id INTEGER PRIMARY KEY AUTOINCREMENT, task_name TEXT, task_description TEXT, task_end_time DATETIME, task_status INTEGER DEFAULT 0, user_id INTEGER NOT NULL, FOREIGN KEY (user_id) REFERENCES user(id));';
sqluser = 'CREATE TABLE IF NOT EXISTS user (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT UNIQUE, password TEXT, username TEXT UNIQUE);';
db.run(sqltask_detail);
db.run(sqluser);
// db.run(sqltask);

function create_task(task_name, task_description, task_end_time, user_id){
    queryInsert = `INSERT INTO task_detail (task_name, task_description, task_end_time, user_id) VALUES (?,?,?,?);`;
    db.run(queryInsert,[task_name, task_description, task_end_time], (err)=>{
        if (err) return console.log(err);
    });
};

function all_task_details(callback){
    queryAll = `SELECT * FROM task_detail;`;
    db.all(queryAll,(err, rows)=>{
        if (err) return console.log(err);
        callback(rows);
    });

}

function delete_task(task_id){
    queryDelete = `DELETE FROM task_detail WHERE task_id == ?;`;
    db.run(queryDelete,[task_id], (err)=>{
        if (err) return console.log(err);
    });
}

function edit_task(task_id, task_name, task_description, task_end_time){
    queryUpdate = `UPDATE task_detail SET task_name = ?, task_description = ?, task_end_time = ? WHERE task_id == ?;`;
    db.run(queryUpdate,[task_name, task_description, task_end_time, task_id], (err)=>{
        if (err) return console.log(err);
    });
}

function register_user(email, password, username, callback) {
    // Generate a salt with 10 rounds
    bcrypt.genSalt(10, (err, salt) => {
      if (err) return callback(err);
  
      // Hash the password with the generated salt
      bcrypt.hash(password, salt, (err, hashedPassword) => {
        if (err) return callback(err);
  
        // Insert the user into the database
        const queryRegisterUser = `INSERT INTO user (email, password, username) VALUES (?, ?, ?)`;
        db.run(queryRegisterUser, [email, hashedPassword, username], (err) => {
          if (err) {
            // Check if the error is due to a UNIQUE constraint violation
            if (err.errno === 19) {
              // Return an error message indicating that the email/username already exists
              return callback(new Error('User with that email/username already exists'));
            } else {
              // Return the database error
              return callback(err);
            }
          } else {
            // Return success if the insert was successful
            return callback(null);
          }
        });
      });
    });
}

module.exports = {create_task, all_task_details, delete_task, edit_task, register_user};

//module.exports = {create_topic, create_task_and_insert_task_detail, run_query, get_task_details, select_task, edit_task, delete_task, change_status, delete_topic};
