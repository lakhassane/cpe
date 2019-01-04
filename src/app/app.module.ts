import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule} from '@angular/common/http';

// import components
import { AppComponent } from './app.component';
import { ProjectComponent } from './project/components/project/project.component';
import { IndexComponent } from './home/components/index/index.component';
import { TaskComponent } from './project/components/task/task.component';
import { InstantiateComponent } from './project/components/instantiate/instantiate.component';

// import services
import { ProjectService } from './project/services/project.service';
import { TaskService } from './project/services/task.service';

// import Modules
import { ProjectModule } from './project/project.module';
import { HomeModule } from './home/home.module';
import { RouterModule } from '@angular/router';
import { RouterModules } from './router.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule, ProjectModule, HomeModule, RouterModule, RouterModules, HttpClientModule
  ],
  providers: [ProjectService, TaskService],
  bootstrap: [AppComponent]
})
export class AppModule { }
