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
            console.log(data);
          });
        
    });

    return router;

}