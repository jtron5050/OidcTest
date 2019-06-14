import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { HttpClientModule } from "@angular/common/http";

import {
  AuthModule,
  OidcSecurityService,
  OpenIDImplicitFlowConfiguration,
  OidcConfigService,
  AuthWellKnownEndpoints
} from 'angular-auth-oidc-client';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';

export function loadConfig(oidcConfigService: OidcConfigService) {
  console.log('APP_INITIALIZER STARTING');
  return () => oidcConfigService.load_using_stsServer('http://localhost:5000');
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    AuthModule.forRoot()
  ],
  providers: [
    OidcConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: loadConfig,
      deps: [OidcConfigService],
      multi: true
    },],
  bootstrap: [AppComponent]
})
export class AppModule {
    constructor(private oidcSecurityService: OidcSecurityService, private oidcConfigService: OidcConfigService) {
          this.oidcConfigService.onConfigurationLoaded.subscribe(() => {

          let openIDImplicitFlowConfiguration = new OpenIDImplicitFlowConfiguration();
          openIDImplicitFlowConfiguration.stsServer = 'http://localhost:5000';
          openIDImplicitFlowConfiguration.redirect_url = 'http://localhost:4200';
          openIDImplicitFlowConfiguration.client_id = 'js';
          openIDImplicitFlowConfiguration.response_type = 'id_token token';
          openIDImplicitFlowConfiguration.scope = 'openid profile api1';
          openIDImplicitFlowConfiguration.post_logout_redirect_uri = 'http://localhost:4200';
          openIDImplicitFlowConfiguration.post_login_route = '/home';
          openIDImplicitFlowConfiguration.forbidden_route = '/forbidden';
          openIDImplicitFlowConfiguration.unauthorized_route = '/unauthorized';
          openIDImplicitFlowConfiguration.trigger_authorization_result_event = true;
          openIDImplicitFlowConfiguration.log_console_warning_active = true;
          openIDImplicitFlowConfiguration.log_console_debug_active = true;
          openIDImplicitFlowConfiguration.max_id_token_iat_offset_allowed_in_seconds = 20;

          const authWellKnownEndpoints = new AuthWellKnownEndpoints();
          authWellKnownEndpoints.setWellKnownEndpoints(this.oidcConfigService.wellKnownEndpoints);

          this.oidcSecurityService.setupModule(openIDImplicitFlowConfiguration, authWellKnownEndpoints);

        });

        console.log('APP STARTING');
      }
}
