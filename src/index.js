import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

// var taskDao = new TaskDao(docDbClient, databaseId, collectionId);
// var taskList = new TaskList(taskDao);
// taskDao.init(console.log);
//   taskList.showTasks().then(items=>console.log(items))
ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
