import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InstanceService } from '../../services/instance.service';

@Component({
  selector: 'app-instances',
  templateUrl: './instances.component.html',
  styleUrls: ['./instances.component.css']
})
export class InstancesComponent implements OnInit {

  STI: any = [];

  constructor( private route: ActivatedRoute, private instanceservice: InstanceService ) { }

  startTask( sti ) {
    this.instanceservice.updateStateService( sti.sti_id, "inprogress" );
  }

  endTask( sti ) {
    this.instanceservice.updateStateService( sti.sti_id, "finished" );
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.instanceservice.getAllInstancesByCTIIDService( params['id'] ).subscribe( (res:any[]) => {
        console.log( res.length );
        for ( let i = 0; i < res.length; i++ ) {
          this.instanceservice.getPreviousSTIService( res[i]._node.properties['sti_id'] )
              .subscribe( res2 => {
              this.STI.push({
                sti_id: res[i]._node.properties['sti_id'],
                sti_name: res[i]._node.properties['sti_name'],
                state: res[i]._node.properties['state'],
                previous: res2[0] ? res2[0].sti2.properties : null
              })
            });
        }
        console.log(this.STI);
      });
    });
  }

}
