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

  constructor(public activeModal: NgbActiveModal,
    private router: Router) { }

  ngOnInit(): void {
    this.modal = this.fromParent.modal;
    console.log(this.fromParent);
  }

  closeModal(sendData: any) {
    this.activeModal.close(sendData);
  }

  createChannel() {this.modal = "newChannel";}

  createGroup() {this.modal = "newGroup";}

  back() {
    if(this.modal == "newChannel") {this.modal = "details";}
    else {this.activeModal.close();}
  }

  joinChannel(channel: number) {
    let url = "channel/" + this.fromParent.group.id + "/" + channel;
    this.router.navigateByUrl(url);
  }

}
