import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { ContentComponent } from './_core/components/content/content.component';
import { CookieComponent } from './_core/components/cookie/cookie.component';
import { HomeComponent } from './_core/components/home/home.component';
import { ProfiliComponent } from './_core/components/profili/profili.component';
import { ProfiloComponent } from './_core/components/profilo/profilo.component';
import { TestAuthGuard } from './_core/components/test/auth/test-auth.guard';
import { TestResolverResolver } from './_core/components/test/resolver/test-resolver.resolver';
import { TestComponentComponent } from './_core/components/test/test-component/test-component.component';
import { TestContentComponent } from './_core/components/test/test-content/test-content.component';
import { TestFormResolverComponent } from './_core/components/test/test-form-resolver/test-form-resolver.component';
import { InformativaGuard } from './_core/guard/informativa.guard';
import { CONSTANTS } from './_shared/constants';
import { ProfiloGuard } from './_core/guard/profilo.guard';

const routes: Routes = [

  {
    path: CONSTANTS.PATH_SITE,
    component: ContentComponent,
    canActivate: [InformativaGuard],
    children: [
      { path: '', component: HomeComponent, canActivate: [ProfiloGuard] },
      { path: 'profilo/:id', component: ProfiloComponent },
      { path: 'profili', component: ProfiliComponent },
      {
        path: 'test', component: TestContentComponent, children: [
          { path: '', component: TestComponentComponent },
          {
            path: 'form', component: TestFormResolverComponent,
            canActivate: [TestAuthGuard],
            resolve: {
              response: TestResolverResolver,
            },
          }
        ]
      }
    ]

  },
  { path: 'informativa', component: CookieComponent },
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
