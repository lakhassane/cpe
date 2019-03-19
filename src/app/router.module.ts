import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectComponent } from './project/components/project/project.component';
import { IndexComponent } from './home/components/index/index.component';
import { TaskComponent } from './project/components/task/task.component';
import { InstantiateComponent } from './project/components/instantiate/instantiate.component';
import { InstancesComponent } from './project/components/instances/instances.component';
import { ChangepatternComponent } from './project/components/changepattern/changepattern.component';
import { Routes, RouterModule } from '@angular/router';

const appRoutes: Routes = [
  { path: 'index', component: IndexComponent },
  { path: 'newproject', component: ProjectComponent },
  { path: 'tasklist', component: TaskComponent },
  { path: 'instantiate/:id', component: InstantiateComponent },
  { path: 'listinstances/:id', component: InstancesComponent },
  { path: 'changePattern/:id', component: ChangepatternComponent }
];

@NgModule({
  imports: [
    CommonModule,RouterModule.forRoot(appRoutes,{useHash: true})
  ],
  declarations: []
})
export class RouterModules { }
