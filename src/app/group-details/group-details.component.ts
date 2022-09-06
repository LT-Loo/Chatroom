import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-group-details',
  templateUrl: './group-details.component.html',
  styleUrls: ['./group-details.component.css']
})
export class GroupDetailsComponent implements OnInit {

  @Input() fromParent: any;

  modal: string = "";
  groupName: string = "";
  groupValid: boolean = true;
  channelList: boolean = true;
  select: number = 0;

  user: any = {};
  group: any = {};
  channels: any = {};

  constructor(public activeModal: NgbActiveModal,
    private router: Router) { }

  ngOnInit(): void {
    this.modal = this.fromParent.modal;
    this.user = this.fromParent.user;
    this.group = this.fromParent.group;
    this.channels = this.fromParent.channels;
    console.log(this.fromParent);
  }

  closeModal(sendData: any) {
    this.activeModal.close(sendData);
  }

  createChannel() {this.modal = "newChannel";}

  createGroup() {this.modal = "newGroup";}

  addMember() {this.modal = "addMember";}

  back() {
    if(this.modal == "newChannel" || this.modal == "addMember") {this.modal = "details";}
    else {this.activeModal.close();}
  }

  selectChannel(channel: number) {
    this.select = channel;
  }

  joinChannel() {
    // localStorage.setItem("group", JSON.stringify(this.fromParent.group));
    // localStorage.setItem("channels", JSON.stringify(this.fromParent.channels));
    let url = "channel/" + this.group.id + "/" + this.select;
    this.activeModal.close();
    this.router.navigateByUrl(url);
  }

  addToGroup() {
    // If group exist, show channel form, otherwise show error message
  }

}
