import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InstanceService {

  constructor( private http: HttpClient ) { }

  getAllInstancesByCTIIDService( id ) {
    const uri = "http://localhost:8585/api/instancebycti/" + id;
    return this
        .http
        .get( uri )
        .pipe(map( res => {
          return res;
        }));
  }
  getAllInstancesCTIByCTIIDService( id ) {
    const uri = "http://localhost:8585/api/instancectibycti/" + id;
    return this
      .http
      .get( uri )
      .pipe(map( res => {
        return res;
      }));
  }

  getPreviousSTIService( id ) {
    const uri = "http://localhost:8585/api/previoussti/" + id;
    return this
        .http
        .get( uri )
        .pipe( map( res => {
          return res;
        }));
  }

  getPreviousSTIForCTIService( id ) {
    const uri = "http://localhost:8585/api/previousstiforcti/" + id;
    return this
      .http
      .get( uri )
      .pipe( map( res => {
        return res;
      }));
  }

  updateStateService(sti_id, state) {
    const uri = "http://localhost:8585/api/updatestate";
    const obj = {
      sti_id: sti_id,
      state: state
    };
    return this
      .http
      .post( uri, obj, {responseType: 'text'} )
      //.subscribe( res =>
      .toPromise().then( res =>
        console.log( res ));
  }
}
