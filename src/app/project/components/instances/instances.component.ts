import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InstanceService } from '../../services/instance.service';

@Component({
  selector: 'app-instances',
  templateUrl: './instances.component.html',
  styleUrls: ['./instances.component.css']
})
export class InstancesComponent implements OnInit {

  constructor( private route: ActivatedRoute, private instancesercice: InstanceService ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.instancesercice.getAllInstancesByCTIIDService( params['id'] ).subscribe(res => {
        console.log( res );
      });
    });
  }

}
