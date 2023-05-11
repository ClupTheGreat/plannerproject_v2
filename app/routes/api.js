const { token } = require('morgan');
const database = require('../../database/db.js');
var jwt = require('jsonwebtoken');
let secret = 'clup';
let dbusname = '';

module.exports = function(router){

    router.post(`/tasks`,function(req,res){
        let task_name = req.body.task_name;
        let task_description = req.body.task_description;
        let task_end_time = req.body.task_end_time;
        
        //Checking if valid data is entered
        if (task_name == null || task_description == null || task_end_time == null || task_name == '' || task_description == '' || task_end_time == ''){
            console.log('Empty');
            res.json({success: false, message:  'Ensure Task name, Task description and its end datetime were provided'})
        } else {
            //Sending data to the server
            database.create_task(task_name, task_description, task_end_time, dbusname);
            res.json({success: true, message:  'Task added'})
        }
    });

    router.post(`/task_display`,function(req,res){
        let data;
        database.all_task_details(dbusname, function(rows) {
            data = rows;
            res.json(data);
          });
        
    });

    router.post(`/delete_task`,function(req,res){
        let task_id = req.body.task_id;
        database.delete_task(task_id);
    });

    router.post(`/task_edit`,function(req,res){
        let task_id = req.body.task_id;
        let task_name = req.body.task_name;
        let task_description = req.body.task_description;
        let task_end_time = req.body.task_end_time;
        //Checking if valid data is entered
        if (task_name == null || task_description == null || task_end_time == null || task_name == '' || task_description == '' || task_end_time == ''){
            console.log('Empty');
            res.json({success: false, message:  'Ensure Task name, Task description and its end datetime were provided'})
        } else {
            //Sending data to the server
            database.edit_task(task_id,task_name, task_description, task_end_time);
            res.json({success: true, message:  'Task edited'})
        }
    });

    //COMPLETE TASK
    router.post(`/complete_task`, function(req,res){
        let task_id = req.body.task_id;
        let task_status = req.body.task_status;
        database.completeTask(task_id, task_status);
    });

    //USER REGISTERATION ROUT

    router.post(`/users`, function(req, res) {
        let email = req.body.email;
        let username = req.body.username;
        let password = req.body.password;
      
        if (email == null || email == '' || username == '' || username == null || password == '' || password == null) {
            // Return an error message indicating that email, username, and password are required
            res.json({ success: false, message: 'Ensure email, username, and password are provided' });
        } else {
                // Call the register_user function with a callback to handle the response
                database.register_user(email, password, username, (err) => {
                if (err) {
                    // Return an error message indicating the error that occurred
                    res.json({ success: false, message: err.message });
                } else {
                    // Return a success message if the insert was successful
                    res.json({ success: true, message: 'User added!' });
                }
          });
        }
      });

    
    //USER LOGIN ROUTE
    router.post('/authenticate', function(req, res) {
        let username = req.body.username;
        let password = req.body.password;
        
        database.findUserComparePassword(username, password, (err, user) => {
          if (err) {
            // Return an error message indicating the error that occurred
            res.json({ success: false, message: err.message });
          } else {
                let token = jwt.sign({username : user.username, email: user.email}, secret , {expiresIn:'24h'});
                // Return a success message with the user object if the password is correct
                res.json({ success: true, message: 'Authentication successful!', user: user, token : token });
          }
        });
      });

    router.use(function(req,res, next){
        var token = req.body.token || req.body.query || req.headers['x-access-token'];

        if (token) {
            jwt.verify(token, secret, function(err, decoded){
                if (err) {
                    res.json({sucess : false, message : 'Token invalid'})
                } else {
                    req.decoded = decoded;
                    next();
                }
            });
        } else {
            res.json({success : false, message : 'No token provided'});
        }
    });

    router.post('/me',function(req,res){
        res.send(req.decoded);
        dbusname = req.decoded.username;
    });

    router.post('/create_sub_task', function(req,res){
        let task_id = req.body.task_id;
        let subtask_description = req.body.subtaskDescription;
        database.create_sub_task(task_id, subtask_description);
    });

    router.post('/load_sub_tasks', function(req,res){
        let subData;
        database.subtask_details(function(rows){
            subData = rows;
            res.json(subData);
        });
    });

    router.post('/delete_sub_task', function(req,res){
        let subtask_id = req.body.subtask_id;
        database.delete_sub_task(subtask_id);
    });

    router.post('/export_data',function(req,res){
        const fs = require('fs');
        const xml2js = require('xml2js');
        const opn = require('opn');
        let dataExp;

        database.all_task_details(dbusname, function(rows) {
            data = rows;
            dataExp = data;
          });

        // Sample data to be exported as XML
        

        // Create a new XML builder instance
        const builder = new xml2js.Builder();

        // Convert the data to XML
        const xml = builder.buildObject(dataExp);

        // Write the XML to a file
        const filename = 'users.xml';
        fs.writeFile(filename, xml, (err) => {
            if (err) {
                console.error(err);
                return;
        }

        console.log(`XML data written to ${filename}`);

        // Open the file explorer window to show the saved XML file
        opn(filename);
        });

        });


    return router;

}