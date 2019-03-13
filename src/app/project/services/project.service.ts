import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor( private http: HttpClient ) { }

  insertTaskCTIService( task, cti ) {
    const uri = "http://localhost:8585/api/taskcti";
    const obj = {
      task_id: task.task_id,
      task_name: task.task_name,
      cti_id: cti.cti_id,
      cti_name: cti.cti_name,
      cti_state: "created"
    };
    this
      .http
      .post( uri, obj )
      //.subscribe( res =>
      .toPromise().then( res =>
          console.log( res ));
  }

  insertTaskSTIService( task, sti ) {
    const uri = "http://localhost:8585/api/tasksti";
    const obj = {
      task_id: task.task_id,
      task_name: task.task_name,
      sti_id: sti.sti_id,
      sti_name: sti.sti_name,
      sti_state: "created"

    };
    this
      .http
      .post( uri, obj )
      //.subscribe( res =>
      .toPromise().then( res =>
        console.log( res ));
  }

  applyDataFlowService ( tip ) {
    const uri = "http://localhost:8585/api/applydataflow";
    const obj = {
      sti_id: tip.tp_task,
      direction: tip.tp_direction,
      wpi: tip.tp_workproduct
    };
    return this
      .http
      .post( uri, obj, {responseType: 'text'} )
      //.subscribe( res =>
      .toPromise().then( res =>
        console.log( res ));
  }

  applyDataFlowCTService ( tip ) {
    const uri = "http://localhost:8585/api/applydataflowCT";
    const obj = {
      cti_id: tip.tp_task,
      direction: tip.tp_direction,
      wpi: tip.tp_workproduct
    };
    return this
      .http
      .post( uri, obj, {responseType: 'text'} )
      //.subscribe( res =>
      .toPromise().then( res =>
        console.log( res ));
  }

  getAllCollaborationPatternService() {
    const uri = "http://localhost:8585/api/cpatterns";
    return this
      .http
      .get( uri )
      .pipe(map( res => {
        return res;
      }));
  }

  getAllActorsService() {
    const uri = "http://localhost:8585/api/actors";
    return this
      .http
      .get( uri )
      .pipe(map( res => {
        return res;
      }));
  }
}
