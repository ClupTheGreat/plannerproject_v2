const sqlite = require('sqlite3').verbose();
let sql;
const bcrypt = require('bcrypt');
const db = new sqlite.Database('./database/store.db',sqlite.OPEN_READWRITE, (err) => {
    if (err) return console.error(err);
});

// Creates all tables
sql_task_detail = 'CREATE TABLE IF NOT EXISTS task_detail (task_id INTEGER PRIMARY KEY AUTOINCREMENT, task_name TEXT, task_description TEXT, task_end_time DATETIME, task_status INTEGER DEFAULT 0, username TEXT NOT NULL, FOREIGN KEY (username) REFERENCES user(username));'
sql_user = 'CREATE TABLE IF NOT EXISTS user (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT UNIQUE, password TEXT, username TEXT UNIQUE);'
sql_sub_task = 'CREATE TABLE IF NOT EXISTS subtask ( subtask_id INTEGER PRIMARY KEY AUTOINCREMENT, subtask_description TEXT, task_id INTEGER, FOREIGN KEY (task_id) REFERENCES task_detail(task_id));';
db.run(sql_user);
db.run(sql_task_detail);
db.run(sql_sub_task);


// db.run(sqltask);

function create_task(task_name, task_description, task_end_time, username){
    queryInsert = `INSERT INTO task_detail (task_name, task_description, task_end_time, username) VALUES (?,?,?,?);`;
    db.run(queryInsert,[task_name, task_description, task_end_time, username], (err)=>{
        if (err) return console.log(err);
    });
};

function all_task_details(username, callback){
    queryAll = `SELECT * FROM task_detail WHERE username = ? ORDER BY task_id DESC;`;
    db.all(queryAll, [username], (err, rows) => {
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

function findUserComparePassword(username, password, callback) {
  queryFindUser = `SELECT * FROM user WHERE username = ?`;
  db.get(queryFindUser, [username], (err, row) => {
    if (err) return callback(err);
    if (!row) return callback(new Error('User not found'));

    // Compare the password against the hashed password stored in the database
    bcrypt.compare(password, row.password, (err, isMatch) => {
      if (err) return callback(err);
      if (!isMatch) return callback(new Error('Invalid password'));

      // Return the user if the password matches
      return callback(null, row);
    });
  });
}

function completeTask(task_id) {
  db.run('UPDATE task_detail SET task_status = 1 WHERE task_id = ?', task_id, function(err) {
    if (err) {
      console.log(err.message);
    } else {
    }
  });
}

function create_sub_task(task_id, subtask_description){
  db.run('INSERT INTO subtask (subtask_description, task_id) VALUES ( ?, ?)',subtask_description, task_id, function(err){
    if (err){
      console.log(err.message);
    }
  });

}

function subtask_details(callback){
  const dbs = new sqlite.Database('./database/store.db',sqlite.OPEN_READWRITE, (err) => {
    if (err) return console.error(err);
  });
  let all_sub_task = `SELECT * FROM subtask;`;
  dbs.all(all_sub_task, (err, rows) => {
      if (err) return console.log(err);
      callback(rows);
  });
  dbs.close();
}

function delete_sub_task(subtask_id){
  const dbw = new sqlite.Database('./database/store.db',sqlite.OPEN_READWRITE, (err) => {
    if (err) return console.error(err);
  });
  queryDeleteSubtask = 'DELETE FROM subtask WHERE subtask_id == ?;'
  dbw.run(queryDeleteSubtask,[subtask_id], (err)=>{
    if (err) return console.log(err);
});
  dbw.close();
}




module.exports = {create_task, all_task_details, delete_task, edit_task, register_user, findUserComparePassword, completeTask, create_sub_task, subtask_details, delete_sub_task};

//module.exports = {create_topic, create_task_and_insert_task_detail, run_query, get_task_details, select_task, edit_task, delete_task, change_status, delete_topic};
