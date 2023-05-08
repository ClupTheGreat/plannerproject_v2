const database = require('../../database/db.js');

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
            database.create_task(task_name, task_description, task_end_time);
            res.json({success: true, message:  'Task added'})
        }
        
    });

    router.post(`/task_display`,function(req,res){
        let data;
        database.all_task_details(function(rows) {
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

    router.post(`/users`, function(req, res) {
        let email = req.body.email;
        let username = req.body.username;
        let password = req.body.password;
      
        if (email == null || email == null || username == null || username == '' || password == '' || password == '') {
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

    return router;

}