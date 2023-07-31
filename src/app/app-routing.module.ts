import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { ContentComponent } from './_core/components/content/content.component';
import { CONSTANTS } from './_shared/constants';
import { NgModule } from '@angular/core';
import { TestContentComponent } from './_core/components/test/test-content/test-content.component';
import { TestComponentComponent } from './_core/components/test/test-component/test-component.component';
import { TestResolverResolver } from './_core/components/test/resolver/test-resolver.resolver';
import { TestFormResolverComponent } from './_core/components/test/test-form-resolver/test-form-resolver.component';
import { TestAuthGuard } from './_core/components/test/auth/test-auth.guard';

const routes: Routes = [

  {
    path: CONSTANTS.PATH_SITE,
    component: ContentComponent,
    children: [
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
