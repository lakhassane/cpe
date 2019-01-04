import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProjectComponent } from './components/project/project.component';
import { RouterModule } from '@angular/router';
import { TaskComponent } from './components/task/task.component';
import { InstantiateComponent } from './components/instantiate/instantiate.component';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    RouterModule
  ],
  declarations: [ProjectComponent, TaskComponent, InstantiateComponent]
})
export class ProjectModule { }
