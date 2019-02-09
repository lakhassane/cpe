import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxXml2jsonService } from 'ngx-xml2json';

import { ProjectService } from '../../services/project.service';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {

  process_name: any;
  process_description: any;
  model: any;
  modelText: any;
  success: any;

  TasksList:any = [];
  WPsList:any = [];
  TPsList:any = [];
  CTI:any = [];
  STI:any = [];

  cti: any;
  sti: any;

  constructor( private projectservice: ProjectService, private taskservice: TaskService,
               private ngxXml2jsonService: NgxXml2jsonService ) {
  }

  fileChanged( e ) {
    this.model = e.target.files[0];
    console.log(this.model);

    let fileReader = new FileReader();

    fileReader.onload = ( e ) => {
      this.modelText = fileReader.result;
    };
    fileReader.readAsText( this.model )
  }

  getFile = function () {
    let fileReader = new FileReader();

    fileReader.onload = ( e ) => {
      console.log( fileReader.result );
    };
    fileReader.readAsText( this.model );
  };

  getCTIbyId( id ) {
    let l = 0;
    while ( l < this.CTI.length ) {
      if ( this.CTI[l].id == id ) {
        return this.CTI[l];
      }
      l++;
    }
  }
  getSTIbyId( id ) {
    let l = 0;
    while ( l < this.STI.length ) {
      if ( this.STI[l].id == id ) {
        return this.STI[l];
      }
      l++;
    }
  }

  parseModel = function() {
    this.success = 0;
    const parser = new DOMParser();
    const xml = parser.parseFromString( this.modelText, 'text/xml' );
    const obj = this.ngxXml2jsonService.xmlToJson( xml );

    for ( var i = 0; i < obj.Process.task.length; i++ ) {
      // Get all the Tasks and put them in an array
      this.TasksList.push({
        id: i,
        task_id: obj.Process.task[i]["@attributes"].id,
        task_name: obj.Process.task[i]["@attributes"].name,
        task_type: obj.Process.task[i]["@attributes"].type,
        successor_id: obj.Process.task[i]["@attributes"].linkToSuccessor !=  undefined ?
          obj.Process.task[i]["@attributes"].linkToSuccessor : null,
        predecessor_id: obj.Process.task[i]["@attributes"].linkToPredecessor !=  undefined ?
          obj.Process.task[i]["@attributes"].linkToPredecessor : null,
      });
      // Separate the CTs from the rest
      if ( obj.Process.task[i]["@attributes"].type == "CollaborativeTask" ) {
        this.CTI.push({
          id: i,
          cti_id: obj.Process.task[i]["@attributes"].id,
          cti_name: obj.Process.task[i]["@attributes"].name,
          state: "instantiated",
          task_id: obj.Process.task[i]["@attributes"].id,
          successor_id: obj.Process.task[i]["@attributes"].linkToSuccessor !=  undefined ?
            obj.Process.task[i]["@attributes"].linkToSuccessor : null,
          predecessor_id: obj.Process.task[i]["@attributes"].linkToPredecessor !=  undefined ?
            obj.Process.task[i]["@attributes"].linkToPredecessor : null,
        });
      }
      // Separate the STs from the rest
      if ( obj.Process.task[i]["@attributes"].type == "SingleTask" ) {
        this.STI.push({
          id: i,
          sti_id: obj.Process.task[i]["@attributes"].id,
          sti_name: obj.Process.task[i]["@attributes"].name,
          state: "instantiated",
          task_id: obj.Process.task[i]["@attributes"].id,
          successor_id: obj.Process.task[i]["@attributes"].linkToSuccessor !=  undefined ?
            obj.Process.task[i]["@attributes"].linkToSuccessor : null,
          predecessor_id: obj.Process.task[i]["@attributes"].linkToPredecessor !=  undefined ?
            obj.Process.task[i]["@attributes"].linkToPredecessor : null,
        });
      }
    }

    for ( var i = 0; i < obj.Process.taskparameter.length; i++ ) {
      this.TPsList.push({
        id: i,
        tp_id: obj.Process.taskparameter[i]["@attributes"].id,
        tp_task: obj.Process.taskparameter[i]["@attributes"].task,
        tp_workproduct: obj.Process.taskparameter[i]["@attributes"].workproduct,
        tp_direction: obj.Process.taskparameter[i]["@attributes"].direction
      });
    }

    for ( var i = 0; i < obj.Process.workproduct.length; i++ ) {
      this.WPsList.push({
        id: i,
        wpi_id: obj.Process.workproduct[i]["@attributes"].id,
        wpi_name: obj.Process.workproduct[i]["@attributes"].name
      });
    }

    for ( var z = 0; z < this.TasksList.length; z++ ) {
      if ( this.TasksList[z].task_type == "CollaborativeTask" ) {
        this.cti =  this.getCTIbyId(z);
        this.projectservice.insertTaskCTIService( this.TasksList[z], this.cti );
      }
      if ( this.TasksList[z].task_type == "SingleTask" ) {
        this.sti =  this.getSTIbyId(z);
        this.projectservice.insertTaskSTIService( this.TasksList[z], this.sti );
      }
    }
    for ( var z = 0; z < this.WPsList.length; z++ ) {
      this.taskservice.insertWPIService( this.WPsList[z] );
    }
    for ( var z = 0; z < this.TPsList.length; z++ ) {
      if ( this.TPsList[z].tp_task.substring( this.TPsList[z].tp_task.length - 2 )  == "CT" ) {
        this.projectservice.applyDataFlowCTService( this.TPsList[z] );
      } else {
        this.projectservice.applyDataFlowService( this.TPsList[z] );
      }
    }
    this.success = 1;
  };


  ngOnInit() {
  }

}
