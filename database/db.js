// const sqlite = require('sqlite3').verbose();
// let sql;
const bcrypt = require('bcrypt');
// const db = new sqlite.Database('./database/store.db',sqlite.OPEN_READWRITE, (err) => {
//     if (err) return console.error(err);
// });

const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'tiger',
  database: 'taskmanager'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database:', err);
    return;
  }
  console.log('Connected to MySQL database.');
});

//Creates all tables
const sql_task_detail = `CREATE TABLE IF NOT EXISTS task_detail (
  task_id INT PRIMARY KEY AUTO_INCREMENT,
  task_name VARCHAR(255),
  task_description TEXT,
  task_end_time varchar(255),
  task_status INT DEFAULT 0,
  username VARCHAR(255) NOT NULL,
  FOREIGN KEY (username) REFERENCES user(username)
)`;

const sql_user = `CREATE TABLE IF NOT EXISTS user (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE,
  password VARCHAR(255),
  username VARCHAR(255) UNIQUE
)`;

const sql_sub_task = `CREATE TABLE IF NOT EXISTS subtask (
  subtask_id INT PRIMARY KEY AUTO_INCREMENT,
  subtask_description TEXT,
  task_id INT,
  FOREIGN KEY (task_id) REFERENCES task_detail(task_id)
)`;


connection.query(sql_user, (err, result) => {
  if (err) {
    console.error(err);
  } else {
    console.log("user table created successfully");
  }
});

connection.query(sql_task_detail, (err, result) => {
  if (err) {
    console.error(err);
  } else {
    console.log("task_detail table created successfully");
  }
});

connection.query(sql_sub_task, (err, result) => {
  if (err) {
    console.error(err);
  } else {
    console.log("subtask table created successfully");
  }
});


// db.run(sqltask);

function create_task(task_name, task_description, task_end_time, username) {
  const queryInsert = 'INSERT INTO task_detail (task_name, task_description, task_end_time, username) VALUES (?, ?, ?, ?)';
  connection.query(queryInsert, [task_name, task_description, task_end_time, username], (err, results) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(`Created task ${results.insertId}`);
  });
}

function all_task_details(username, callback) {
  const queryAll = 'SELECT * FROM task_detail WHERE username = ? ORDER BY task_id DESC';
  connection.query(queryAll, [username], (err, rows) => {
    if (err) {
      console.error(err);
      return;
    }
    callback(rows);
  });
}



function delete_task(task_id) {

  const queryDeleteSubtasks = 'DELETE FROM subtask WHERE task_id = ?';
  connection.query(queryDeleteSubtasks, [task_id], (err, results) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(`Deleted ${results.affectedRows} subtask(s)`);
  });

  const queryDelete = 'DELETE FROM task_detail WHERE task_id = ?';
  connection.query(queryDelete, [task_id], (err, results) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(`Deleted ${results.affectedRows} row(s)`);
  });
}


function edit_task(task_id, task_name, task_description, task_end_time) {
  const queryUpdate = 'UPDATE task_detail SET task_name = ?, task_description = ?, task_end_time = ? WHERE task_id = ?';
  connection.query(queryUpdate, [task_name, task_description, task_end_time, task_id], (err, results) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(`Updated ${results.affectedRows} row(s)`);
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
      const queryRegisterUser = 'INSERT INTO user (email, password, username) VALUES (?, ?, ?)';
      connection.query(queryRegisterUser, [email, hashedPassword, username], (err, results) => {
        if (err) {
          // Check if the error is due to a UNIQUE constraint violation
          if (err.code === 'ER_DUP_ENTRY') {
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
  const queryFindUser = `SELECT * FROM user WHERE username = ?`;
  connection.query(queryFindUser, [username], (err, rows) => {
    if (err) return callback(err);
    if (rows.length === 0) return callback(new Error('User not found'));

    const row = rows[0];
    // Compare the password against the hashed password stored in the database
    bcrypt.compare(password, row.password, (err, isMatch) => {
      if (err) return callback(err);
      if (!isMatch) return callback(new Error('Invalid password'));

      // Return the user if the password matches
      return callback(null, row);
    });
  });
}


function completeTask(task_id, task_status) {
  connection.query('UPDATE task_detail SET task_status = ? WHERE task_id = ?', [task_status, task_id], function(err, result) {
    if (err) {
      console.log(err.message);
    } else {
    }
  });
}


function create_sub_task(task_id, subtask_description) {
  const queryInsert = `INSERT INTO subtask (subtask_description, task_id) VALUES (?, ?);`;
  connection.query(queryInsert, [subtask_description, task_id], (err) => {
    if (err) {
      console.log(err.message);
    }
  });
}


function subtask_details(callback){
  let all_sub_task = `SELECT * FROM subtask;`;
  connection.query(all_sub_task, (err, rows) => {
      if (err) return console.log(err);
      callback(rows);
  });
}

function delete_sub_task(subtask_id) {
  connection.query('DELETE FROM subtask WHERE subtask_id = ?', [subtask_id], (err) => {
    if (err) return console.log(err);
  });
}

module.exports = {create_task, all_task_details, delete_task, edit_task, register_user, findUserComparePassword, completeTask, create_sub_task, subtask_details, delete_sub_task};

//module.exports = {create_topic, create_task_and_insert_task_detail, run_query, get_task_details, select_task, edit_task, delete_task, change_status, delete_topic};
