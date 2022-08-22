import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  group1: boolean = false;
  group2: boolean = false;
  group3: boolean = false;
  group4: boolean = false;
  group5: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  channelMenu1() {
    if (this.group1) {this.group1 = false;}
    else {this.group1 = true;}
  }

  channelMenu2() {
    if (this.group2) {this.group2 = false;}
    else {this.group2 = true;}
  }

  channelMenu5() {
    if (this.group5) {this.group5 = false;}
    else {this.group5 = true;}
  }

  channelMenu3() {
    if (this.group3) {this.group3 = false;}
    else {this.group3 = true;}
  }

  channelMenu4() {
    if (this.group4) {this.group4 = false;}
    else {this.group4 = true;}
  }


}
