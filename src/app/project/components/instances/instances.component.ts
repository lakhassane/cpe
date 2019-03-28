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
  CTI: any = [];
  previousTaskCondition: any;

  constructor( private route: ActivatedRoute, private instanceservice: InstanceService ) { }

  startTask( sti ) {
    this.instanceservice.updateStateService( sti.sti_id, "inprogress" );
  }

  endTask( sti ) {
    this.instanceservice.updateStateService( sti.sti_id, "finished" );
  }

  async getInstances ( id ) {

    let InstancesByCTIId: any = await this.instanceservice.getAllInstancesByCTIIDService( id ).toPromise();
    let InstancesCTIByCTIId: any = await this.instanceservice.getAllInstancesCTIByCTIIDService( id ).toPromise();
    //console.log( InstancesByCTIId );

    for ( let i = 0; i < InstancesByCTIId.length; i++ ) {
      let PreviousSTI: any = await this.instanceservice.getPreviousSTIService( InstancesByCTIId[i].
                                                _node.properties['sti_id'] ).toPromise();

      this.STI.push({
        sti_id: PreviousSTI ? PreviousSTI.sti[0]._node.properties['sti_id'] : null,
        sti_name: PreviousSTI ? PreviousSTI.sti[0]._node.properties['sti_name'] : null,
        state: PreviousSTI ? PreviousSTI.sti[0]._node.properties['state'] : null,
        previous: PreviousSTI.previousSTI[0]._node ? PreviousSTI.previousSTI[0]._node.properties['sti_name'] :
                      PreviousSTI.previousCTI[0]._node ? PreviousSTI.previousCTI[0]._node.properties['cti_name'] : "",
        actor: PreviousSTI ? PreviousSTI.actor[0]._node.properties['name'] : null,
        ws: PreviousSTI.wsSTI ? PreviousSTI.wsSTI.properties['wsType'] :
                      PreviousSTI.wsCTI ? PreviousSTI.wsCTI.properties['wsType'] : null
      });
    }
    for ( let i = 0; i < InstancesCTIByCTIId.length; i++ ) {
      let PreviousCTI: any = await this.instanceservice.getPreviousSTIForCTIService( InstancesCTIByCTIId[i].
        _node.properties['cti_id'] ).toPromise();

      this.CTI.push({
        cti_id: PreviousCTI ? PreviousCTI.cti[0]._node.properties['cti_id'] : null,
        cti_name: PreviousCTI ? PreviousCTI.cti[0]._node.properties['cti_name'] : null,
        state: PreviousCTI ? PreviousCTI.cti[0]._node.properties['state'] : null,
        previous: PreviousCTI.previousSTI[0]._node ? PreviousCTI.previousSTI[0]._node.properties['sti_name'] :
          PreviousCTI.previousCTI[0]._node ? PreviousCTI.previousCTI[0]._node.properties['cti_name'] : "",
        //actor: PreviousCTI ? PreviousCTI.actor[0]._node.properties['name'] : null,
        ws: PreviousCTI.wsSTI ? PreviousCTI.wsSTI.properties['wsType'] :
          PreviousCTI.wsCTI ? PreviousCTI.wsCTI.properties['wsType'] : null
      });
    }

    if ( this.STI[0].ws == "FinishToStart" ) {
      this.previousTaskCondition = "finished";
    } else if ( this.STI[0].ws == "StartToStart" ) {
      this.previousTaskCondition = "inprogress";
    }

  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.getInstances( params['id'] );
      this.STI = [];
      this.CTI = [];
    });
  }

}
