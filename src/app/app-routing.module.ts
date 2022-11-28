import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import {PreloadAllModules, RouterModule, Routes} from "@angular/router";
import {VmComponent} from "./vm/vm.component";
import {HomePageComponent} from "./home-page/home-page.component";
import {TaskComponent} from "./task/task.component";
import {LoginComponent} from "./login/login.component";

const routes: Routes = [
  {path: '', component: HomePageComponent},
  {path: 'vm', component: VmComponent},
  {path: 'task', component: TaskComponent},
  {path: 'login', component: LoginComponent},
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules
    })
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
