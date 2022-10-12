import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { ChatDataService } from './services/chat-data.service';
import { ImageUploadService } from './services/image-upload.service';
import { UserDataService } from './services/user-data.service';
import { GroupChannelDataService } from './services/group-channel-data.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { AccountComponent } from './account/account.component';
import { GroupDetailsComponent } from './group-details/group-details.component';
import { ChannelComponent } from './channel/channel.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AccountComponent,
    GroupDetailsComponent,
    ChannelComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    NgbModule,
    HttpClientModule,
    CommonModule
  ],
  providers: [
    ChatDataService,
    ImageUploadService,
    UserDataService,
    GroupChannelDataService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
