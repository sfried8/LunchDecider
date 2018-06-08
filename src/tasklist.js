import { forEach } from "async";

function TaskList(taskDao) {
    this.taskDao = taskDao;
}

TaskList.prototype = {
    showTasks: function(req, res) {
        var self = this;

        var querySpec = {
            query: "SELECT * FROM root r"
        };

        self.taskDao.find(querySpec, function(err, items) {
            if (err) {
                throw err;
            }
            console.log(items)
        });
    },
    
    addTask: function(req, res) {
        var self = this;
        var item = req.body;
        
        self.taskDao.addItem(item, function(err) {
            if (err) {
                throw err;
            }
            
            res.redirect("/");
        });
    },
    
    completeTask: function(req, res) {
        var self = this;
        var completedTasks = Object.keys(req.body);
        forEach(
            completedTasks,
            function taskIterator(completedTask, callback) {
                self.taskDao.updateItem(
                    completedTask,
                    { weight: req.body[completedTask] },
                    function(err) {
                        if (err) {
                            callback(err);
                        } else {
                            callback(null);
                        }
                    }
                );
            },
            function goHome(err) {
                if (err) {
                    throw err;
                } else {
                    res.redirect("/");
                }
            }
        );
    }
};

export default TaskList;