import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { AccountComponent } from './account/account.component';
import { ChannelComponent } from './channel/channel.component';

const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'account/:id', component: AccountComponent},
  {path: 'channel/:group/:channel', component: ChannelComponent},
  {path: '**', component: LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
