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
}
