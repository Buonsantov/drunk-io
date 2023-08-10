import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiTestComponent } from './test-api/api-test.component';
import { TestCookieComponent } from './test-cookie/test-cookie.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { LibUiKitModule } from 'src/app/_lib/ui-kit/ui-kit.module';
import { TestComponentComponent } from './test-component/test-component.component';
import { TestContentComponent } from './test-content/test-content.component';
import { RouterModule } from '@angular/router';
import { NavTestComponent } from './test-nav/nav-test.component';
import { TestFormResolverComponent } from './test-form-resolver/test-form-resolver.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    ApiTestComponent,
    TestCookieComponent,
    TestComponentComponent,
    TestContentComponent,
    NavTestComponent,
    TestFormResolverComponent,
    
  ],
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    LibUiKitModule,
    NgbModule,
    // ng module
    FormsModule,

  ],
  exports: [
    ApiTestComponent,
    TestCookieComponent,
    NavTestComponent,
  ]
})
export class TestModule { }
