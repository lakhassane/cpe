import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor( private http: HttpClient ) { }

  getAllTasksService() {
    const uri = "http://localhost:8585/api/tasks";
    return this
        .http
        .get( uri )
        .pipe( map( res => {
          return res;
        }));
  }

  getTaskByIdService( id ) {
    const uri = "http://localhost:8585/api/task/" + id;
    return this
        .http
        .get( uri )
        .pipe( map( res => {
          return res;
      }));
  }

  getAllInformationsOfCTIService( id ) {
    const uri = "http://localhost:8585/api/cti_all/" + id;
    return this
        .http
        .get( uri )
        .pipe( map( res => {
          return res;
      }));
  }

  getAllInformationsOfSTIService( id ) {
    const uri = "http://localhost:8585/api/sti_all/" + id;
    return this
      .http
      .get( uri )
      .pipe( map( res => {
        return res;
      }));
  }

  deleteRelationshipsOfSTIsService( id ) {
    const uri = "http://localhost:8585/api/deletetis";
    const obj = {
      cti_id: id
    };
    return this
      .http
      .post( uri, obj, {responseType: 'text'} )
      .toPromise().then( res =>
        console.log( res ));
  }

  deleteTIPSService( id ) {
    const uri = "http://localhost:8585/api/deletetip";
    const obj = {
      cti_id: id
    };
    return this
      .http
      .post( uri, obj, {responseType: 'text'} )
      .toPromise().then( res =>
        console.log( res ));
  }

  changeLabelService( id ) {
    const uri = "http://localhost:8585/api/changelabel";
    const obj = {
      sti_id: id
    };
    return this
      .http
      .post( uri, obj, {responseType: 'text'} )
      .toPromise().then( res =>
        console.log( res ));
  }

  getAllWPIsService() {
    const uri = "http://localhost:8585/api/wpi/";
    return this
      .http
      .get( uri )
      .pipe( map( res => {
        return res
      }));
  }

  getWPIByCTIIdService( id ) {
    const uri = "http://localhost:8585/api/wpibycti/" + id;
    return this
      .http
      .get( uri )
      .pipe( map( res => {
        return res
      }));
  }

  insertSTIService( sti ) {
    const uri = "http://localhost:8585/api/sti";
    const obj = {
      cti_id: sti.cti_id,
      sti_id: sti.sti_id,
      sti_name: sti.sti_name,
      sti_state: "instantiated"
    };
    return this
        .http
        .post( uri, obj, {responseType: 'text'} )
        //.subscribe( res =>
        .toPromise().then( res =>
          console.log( res ));
  }

  insertWPIService ( wpi ) {
    const uri = "http://localhost:8585/api/wpi";
    const obj = {
      wpi_id: wpi.wpi_id,
      wpi_name: wpi.wpi_name
    };
    return this
      .http
      .post( uri, obj, {responseType: 'text'} )
      //.subscribe( res =>
      .toPromise().then( res =>
        console.log( res ));
  }

  applySTISequencingService( tis ) {
    const uri = "http://localhost:8585/api/applypatternsequencing";
    const obj = {
      predecessor_id: tis.predecessor_id,
      successor_id: tis.successor_id,
      linkKind: tis.linkKind
    };
    return this
        .http
        .post( uri, obj, {responseType: 'text'} )
        //.subscribe( res =>
        .toPromise().then( res =>
          console.log( res ));
  }

  applyDataFlowService ( tip ) {
    const uri = "http://localhost:8585/api/applydataflow";
    const obj = {
      sti_id: tip.task.sti_id,
      direction: tip.direction,
      wpi: tip.wpi
    };
    return this
      .http
      .post( uri, obj, {responseType: 'text'} )
      //.subscribe( res =>
      .toPromise().then( res =>
        console.log( res ));
  }

  assignTaskService( sti, actor ) {
    const uri = "http://localhost:8585/api/assignactor";
    const obj = {
      sti_id: sti.sti_id,
      cti_id: sti.cti_id,
      actor_name: actor
    };
    return this
      .http
      .post( uri, obj, {responseType: 'text'} )
      .toPromise().then( res =>
          console.log( res ) );
  }
}
