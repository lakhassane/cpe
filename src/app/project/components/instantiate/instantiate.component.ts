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
  //WPI2:any = []; // Created WPIs in database
  WPI2:any = {}; // Created WPIs in database
  numberOfActors:any = 1;

  CPSTI:any = []; // Holds all the STIs of the chosen Collaboration Pattern

  CPTIP:any = [];
  PWPI: any = []; // Holds the WorkProductInstances of the chosen Collaboration Pattern
  PTIP: any = []; // Holds the TIPs of the chosen Collaboration Pattern

  wsType: any;
  STIORDERED: any = []; // Holds the STIs ordered during configuration
  STI: any = []; // Holds the future STIs to write in Database
  WPI: any = []; // Holds the future STIs to write in Database
  CTISTI: any = [];
  TIS:any = [];
  TIP:any = [];

  pattern: any;
  patternText: any;

  input: any = [];
  output: any = [];
  actorAssignated: any = []; // Holds the actors chosen for each STI

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
    const obj = this.ngxXml2jsonService.xmlToJson( xml ); // obj == cpattern

    // FROM ALGO : SingleTaskInstance cpsti[] = cp.getSingletaskinstance();
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
    // FROM ALGO : cpti[k] = cpsti[k].getTaskinstanceparameter();
    if ( obj["Process"].taskparameter != undefined ) {
      for ( var i = 0; i < obj["Process"].taskparameter.length; i++) {
        this.PTIP.push({
          id: obj["Process"].taskparameter[i]["@attributes"].id,
          task: obj["Process"].taskparameter[i]["@attributes"].task,
          workproduct: obj["Process"].taskparameter[i]["@attributes"].workproduct,
          direction: obj["Process"].taskparameter[i]["@attributes"].direction
        })
      }
    }

    let TIPt1, TIPt2;
    TIPt1 = this.getTIPbyTaskId( this.PTIP, "t1" );
    TIPt2 = this.getTIPbyTaskId( this.PTIP, "t2" );
    this.CPTIP.push([
      TIPt1,
      TIPt2,
    ]);
  }

  async instantiateTask() {
    this.parsePattern();
    // FROM ALGO : sti = cti.getsingletaskinstance()
    for ( var i = 0; i < this.numberOfActors; i++ ) {
      this.STI.push({
        id: i,
        cti_id: this.task.task_id,
        //sti_id: this.task.task_id + "_" + (i+1),
        //sti_name: this.task.task_name + "_inst_" + (i+1),
        sti_id: this.task.task_id + "_" + this.STIORDERED[i].substring( this.STIORDERED[i].length - 1 ),
        sti_name: this.STIORDERED[i]
      });
    }

    for ( var z = 0; z < this.STI.length; z++ ) {
      let STIAsyncResult = await this.taskservice.insertSTIService( this.STI[z] );
      let WPIAsyncResult = await this.taskservice.insertWPIService( this.WPI[z] );
      let AssignAsynResult = await this.taskservice.assignTaskService(this.STI[z], this.actorAssignated[z] );
    }

    // Applying Control-Flow
    if ( this.CPSTI[0].successor_id != null ) {
      this.wsType = this.CPSTI[0].tasksequence["@attributes"].linkKind;
      //for ( var i = 1; i < this.numberOfActors; i++ ) {
      for ( var i = 0; i < this.STI.length - 1; i++ ) {
        this.TIS.push({
          id: i,
          //successor_id: this.task.task_id + "_" + (i+1),
          //predecessor_id: this.task.task_id + "_" + i,
          linkKind: this.wsType,
          successor_id: this.STI[i+1].sti_id,
          predecessor_id: this.STI[i].sti_id
        });
      }

      this.CTISTI.push({
        taskinstance: this.STI,
        tasksequenceinstance: this.TIS
      });

      for ( var y = 0; y < this.TIS.length; y++ ) {
        let TISAsyncResult = await this.taskservice.applySTISequencingService( this.TIS[y] );
      }
    }

    // Applying Data Flow
    let index = 0; // index des insertions
    let inputIndex = 1; // index of input
    let outputIndex = 0; // index of output
    for ( var j = 0; j < this.numberOfActors - 1; j++ ) {
      for ( var m = 0; m < this.CPTIP[0].length; m++ ) {
        for ( var l = 0; l < this.CPTIP[0][m].length; l++ ) {
          if ( this.TIP[index-1] != undefined && this.TIP[index-1].task == this.STI[j+m] &&
            this.TIP[index-1].direction == this.CPTIP[0][m][l][0].direction ) {
            continue;
          }
          this.TIP.push({
            id: (j+1),
            direction: this.CPTIP[0][m][l][0].direction,
            task: this.STI[j+m],
            //wpi: this.WPI[j+l].wpi_name
            //input: this.input[index],
            //output: this.output[index],
            wpi: this.CPTIP[0][m][l][0].direction == "in" ? this.input[inputIndex] : this.output[outputIndex]
          });
          index++;
          if ( this.CPTIP[0][m][l][0].direction == "in" ) {
            inputIndex++;
          } else { outputIndex++ }
        }
      }
    }

    for ( var y = 0; y < this.TIP.length; y++ ) {
      // let wpi = "ASS_" + (y+1);
      let TIPAsyncResult = await this.taskservice.applyDataFlowService( this.TIP[y] );
    }

  }

  getNumber = function( num ) {
    this.WPI = [];
    this.TOINSTANTIATE = [];
    for ( var i = 0; i < num; i++ ) {
      this.WPI.push({
        id: i,
        wpi_id: this.WPI2.wpi_id + "_" + ( i + 1 ),
        wpi_name: this.WPI2.wpi_id + "_" + ( i + 1 )
      });

      this.TOINSTANTIATE.push({
        id: i,
        task_id: this.task.task_id + "_" + ( i + 1),
        task_name: this.task.task_name + "_inst_" + ( i + 1)
      })
    }
    return new Array( Number( num ) );
  };

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.taskservice.getTaskByIdService(params['id']).subscribe(res => {

        this.task.task_id = res[0]._node.properties['task_id'];
        this.task.task_name = res[0]._node.properties['task_name'];

        console.log( this.task.task_name );
      });

      this.taskservice.getWPIByCTIIdService( params['id'] )
        .subscribe( res => {
          this.WPI2.wpi_id = res[0].wpi.properties.wpi_id;
          console.log(this.WPI2);
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

    /*this.taskservice.getAllWPIsService()
      .subscribe( (res: any[]) => {
        for ( var i = 0; i < res.length; i++ ) {
          this.WPI2.push({
            wpi_id: res[i]._node.properties['wpi_id'],
            wpi_name: res[i]._node.properties['wpi_name']
          })
        }
      });*/



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
