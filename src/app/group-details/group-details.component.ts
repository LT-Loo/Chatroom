import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-group-details',
  templateUrl: './group-details.component.html',
  styleUrls: ['./group-details.component.css']
})
export class GroupDetailsComponent implements OnInit {

  @Input() fromParent: any;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    console.log(this.fromParent);
  }

  closeModal(sendData: any) {
    this.activeModal.close(sendData);
  }

}
