import { Component, OnInit } from '@angular/core';

import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {

  TasksList:any = [];

  constructor( private taskservice: TaskService ) { }

  getTasks = function() {
    this.taskservice.getAllTasksService()
      .subscribe( res => {
        for ( var i = 0; i < res.length; i++ ) {
          this.TasksList.push({
            task_id: res[i]._node.properties['task_id'],
            task_name: res[i]._node.properties['task_name'],
            instantiated: res[i]._node.properties['state'] == "Instantiated" ? true: false
          })

        }
        console.log( this.TasksList );
      })
  };

  ngOnInit() {
    this.getTasks();
  }

}
