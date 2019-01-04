import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxXml2jsonService } from 'ngx-xml2json';

import { TaskService } from '../../services/task.service';
import { ProjectService } from '../../services/project.service';

@Component({
  selector: 'app-instantiate',
  templateUrl: './instantiate.component.html',
  styleUrls: ['./instantiate.component.css']
})
export class InstantiateComponent implements OnInit {

  task: any = {};
  CPatterns: any = [];
  Actors:any = [];
  numberOfActors:any = 1;

  CPSTI:any = [];

  CPTIP:any = [];
  PWPI: any = []; // patterns WPIs
  PTIP: any = []; // patterns TIPs

  wsType: any;
  STI: any = [];
  CTISTI: any = [];
  TIS:any = [];
  TIP:any = [];

  pattern: any;
  patternText: any;

  constructor( private route: ActivatedRoute, private taskservice: TaskService, private projectservice: ProjectService,
               private ngxXml2jsonService: NgxXml2jsonService ) { }

  patternRegister( e ) {
    this.pattern = e.target.files[0];

    let fileReader = new FileReader();

    fileReader.onload = ( e ) => {
      this.patternText = fileReader.result;
    };
    fileReader.readAsText( this.pattern );
  }

  getTasksById = function( id ) {
    this.taskservice.getTaskByIdService( id )
      .subscribe( res => {
        console.log( res );
      })
  };

  getTIPbyTaskId( TIP:any = [], task_id: any = 0 ){
    let TIP2: any[][] = new Array();
    for ( var i = 0; i < TIP.length; i++ ) {
      if ( TIP[i].task == task_id ){
        TIP2.push([
          TIP[i]
        ]);
      }
    }
    return TIP2;
  }

  parsePattern() {
    const parser = new DOMParser();
    const xml = parser.parseFromString( this.patternText, 'text/xml' );
    const obj = this.ngxXml2jsonService.xmlToJson( xml );

    for ( var i = 0; i < obj["Process"].task.length; i++ ) {
      this.CPSTI.push({
        id: i,
        cpsti_id: obj["Process"].task[i]["@attributes"].id,
        cpsti_name: obj["Process"].task[i]["@attributes"].name,
        cpsti_type: obj["Process"].task[i]["@attributes"].type,
        successor_id: obj["Process"].task[i]["@attributes"].linkToSuccessor !=  undefined ?
          obj["Process"].task[i]["@attributes"].linkToSuccessor : null,
        predecessor_id: obj["Process"].task[i]["@attributes"].linkToPredecessor !=  undefined ?
          obj["Process"].task[i]["@attributes"].linkToPredecessor : null,
        tasksequence: obj["Process"].tasksequence
      });
    }
    for ( var i = 0; i < obj["Process"].workproduct.length; i++) {
      this.PWPI.push({
        id: obj["Process"].workproduct[i]["@attributes"].id,
        name: obj["Process"].workproduct[i]["@attributes"].name
      })
    }
    //if (  obj["Process"].taskparameter ) {
    for ( var i = 0; i < obj["Process"].taskparameter.length; i++) {
      this.PTIP.push({
        id: obj["Process"].taskparameter[i]["@attributes"].id,
        task: obj["Process"].taskparameter[i]["@attributes"].task,
        workproduct: obj["Process"].taskparameter[i]["@attributes"].workproduct,
        direction: obj["Process"].taskparameter[i]["@attributes"].direction
      })
    }
    for ( var i = 0; i < obj["Process"].task.length; i++ ) {

    }
    let TIPt1, TIPt2;
    TIPt1 = this.getTIPbyTaskId( this.PTIP, "t1" );
    TIPt2 = this.getTIPbyTaskId( this.PTIP, "t2" );
    this.CPTIP.push([
      TIPt1,
      TIPt2,
    ]);
  }

  instantiateTask() {
    this.parsePattern();
    for ( var i = 0; i < this.numberOfActors; i++ ) {
      this.STI.push({
        id: i,
        cti_id: this.task.task_id,
        sti_id: this.task.task_id + "_" + (i+1),
        sti_name: this.task.task_name + "_inst_" + (i+1),
      });
    }

    for ( var z = 0; z < this.STI.length; z++ ) {
      this.taskservice.insertSTIService( this.STI[z] );
    }

    if ( this.CPSTI[0].successor_id != null ) {
      this.wsType = this.CPSTI[0].tasksequence["@attributes"].linkKind;
      for ( var i = 1; i < this.numberOfActors; i++ ) {
        this.TIS.push({
          id: i,
          successor_id: this.task.task_id + "_" + (i+1),
          predecessor_id: this.task.task_id + "_" + i,
          linkKind: this.wsType
        });
      }

      this.CTISTI.push({
        taskinstance: this.STI,
        tasksequenceinstance: this.TIS
      });

      for ( var y = 0; y < this.TIS.length; y++ ) {
        this.taskservice.applySTISequencingService( this.TIS[y] );
      }
    }

    for ( var j = 0; j < this.numberOfActors - 1; j++ ) {
      for ( var m = 0; m < this.CPTIP[0].length; m++ ) {
        for ( var l = 0; l < this.CPTIP[0][m].length; l++ ) {
          this.TIP.push({
            id: (j+1),
            direction: this.CPTIP[0][m][l][0].direction,
            task: this.STI[j+m]
          })
        }
      }
    }
    for (var y = 0; y < this.TIP.length; y++ ) {
      let wpi = "ASS_" + (y+1);
      //this.taskservice.applyDataFlowService( this.TIP[y], wpi );
    }
    console.log( this.TIP );

  }

  getNumber = function( num ) {
    return new Array( Number( num ) );
  };

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.taskservice.getTaskByIdService(params['id']).subscribe(res => {

        this.task.task_id = res[0]._node.properties['task_id'];
        this.task.task_name = res[0]._node.properties['task_name'];

        console.log( this.task.task_name );
      });
    });

    this.projectservice.getAllCollaborationPatternService()
      .subscribe( (res: any[]) => {
        for ( var i = 0; i < res.length; i++ ) {
          this.CPatterns.push({
            id: res[i]._node.properties['cp_id'],
            name: res[i]._node.properties['cp_name'],
            alias: res[i]._node.properties['alias']
          })

        }
      });

    this.projectservice.getAllActorsService()
      .subscribe( (res: any[]) => {
        for ( var i = 0; i < res.length; i++ ) {
          this.Actors.push({
            name: res[i]._node.properties['name']
          })

        }
      });
  }

}
