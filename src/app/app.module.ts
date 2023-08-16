import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './modules/app-routing.module';
import { MaterialModule } from './modules/material.module';

import { AppComponent } from './entry/main.component';
import { HeroListComponent } from './pages/hero-list/hero-list.component';

import { ApiInterceptor } from './core/interceptors/api.interceptor';
import { LocalStorageService } from './core/services/localStorage/local-storage.service';
import { CanvasService } from './core/services/canvas/canvas.service';
import { ApiService } from './core/services/api/api.service';

import { ImageUploadComponent } from './components/shared/image-upload/image-upload.component';
import { CreateHeroFormComponent } from './components/create-hero-form/create-hero-form.component';
import { ConfirmDialogComponent } from './components/shared/confirm-dialog/confirm-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    ImageUploadComponent,
    CreateHeroFormComponent,
    HeroListComponent,
    ConfirmDialogComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [
    LocalStorageService,
    CanvasService,
    ApiService,
    { provide: HTTP_INTERCEPTORS, useClass: ApiInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
