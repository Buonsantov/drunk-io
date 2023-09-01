import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { ContentComponent } from './_core/components/content/content.component';
import { CookieComponent } from './_core/components/cookie/cookie.component';
import { HomeComponent } from './_core/components/home/home.component';
import { ProfiliComponent } from './_core/components/profili/profili.component';
import { ProfiloComponent } from './_core/components/profilo/profilo.component';
import { InformativaGuard } from './_core/guard/informativa.guard';
import { CONSTANTS } from './_shared/constants';
import { ProfiloGuard } from './_core/guard/profilo.guard';
import { FaqComponent } from './_core/components/faq/faq.component';
import { ContattiComponent } from './_core/components/contatti/contatti.component';
import { ChartComponent } from './_core/components/chart/chart.component';

const routes: Routes = [

  {
    path: CONSTANTS.PATH_SITE,
    component: ContentComponent,
    canActivate: [InformativaGuard],
    children: [
      { path: '', component: HomeComponent, canActivate: [ProfiloGuard] },
      { path: 'profilo/:id', component: ProfiloComponent },
      { path: 'profili', component: ProfiliComponent },
      { path: 'chart', component: ChartComponent },
    ]

  },
  { path: 'informativa', component: CookieComponent },
  { path: 'faq', component: FaqComponent },
  { path: 'contatti', component: ContattiComponent },
  { path: '**', redirectTo: CONSTANTS.PATH_SITE },
];



@NgModule({
  imports: [RouterModule.forRoot(routes, {

    initialNavigation: 'enabledNonBlocking',
    preloadingStrategy: PreloadAllModules,
    scrollPositionRestoration: 'enabled',
    useHash: true
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
