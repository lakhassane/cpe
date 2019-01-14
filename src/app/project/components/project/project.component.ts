import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxXml2jsonService } from 'ngx-xml2json';

import { ProjectService } from '../../services/project.service';

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
  CTI:any = [];
  STI:any = [];

  cti: any;
  sti: any;

  constructor(private projectservice: ProjectService, private ngxXml2jsonService: NgxXml2jsonService) {
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

    for ( var z = 0; z < this.TasksList.length; z++ ) {
      if ( this.TasksList[z].task_type == "CollaborativeTask" ) {
        this.cti =  this.getCTIbyId(z);
        //console.log("cti : " + JSON.stringify( this.cti));
        this.projectservice.insertTaskCTIService( this.TasksList[z], this.cti );
      }
      if ( this.TasksList[z].task_type == "SingleTask" ) {
        this.sti =  this.getSTIbyId(z);
        //console.log("sti : " + JSON.stringify(this.sti));
        this.projectservice.insertTaskSTIService( this.TasksList[z], this.sti );
      }
    }
    this.success = 1;
  };


  ngOnInit() {
  }

}
