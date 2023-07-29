import { PreloadAllModules, RouterModule, Routes } from "@angular/router";
import { ContentComponent } from "./_core/components/content/content.component";
import { CONSTANTS } from "./_shared/constants";
import { NgModule } from '@angular/core';

const routes: Routes = [

  {
    path: CONSTANTS.PATH_SITE,
    component: ContentComponent,
    children: []

  },

  { path: '**', redirectTo: CONSTANTS.PATH_SITE },
];



@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabledNonBlocking',
    preloadingStrategy: PreloadAllModules,
    scrollPositionRestoration: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
