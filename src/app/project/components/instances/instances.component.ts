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

  async getInstances ( id ) {

    let InstancesByCTIId: any = await this.instanceservice.getAllInstancesByCTIIDService( id ).toPromise();
    console.log( InstancesByCTIId );

    for ( let i = 0; i < InstancesByCTIId.length; i++ ) {
      let PreviousSTI: any = await this.instanceservice.getPreviousSTIService( InstancesByCTIId[i].
                                                _node.properties['sti_id'] ).toPromise();

      this.STI.push({
        sti_id: PreviousSTI ? PreviousSTI.sti[0]._node.properties['sti_id'] : null,
        sti_name: PreviousSTI ? PreviousSTI.sti[0]._node.properties['sti_name'] : null,
        state: PreviousSTI ? PreviousSTI.sti[0]._node.properties['state'] : null,
        previous: PreviousSTI.previous[0]._node ? PreviousSTI.previous[0]._node.properties : null
      });

    }
    console.log(this.STI);
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.getInstances( params['id'] );
    });
    //this.getInstances();
  }

}
