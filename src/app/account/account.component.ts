import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';

import { UserDataService } from '../services/user-data.service';
import { GroupDetailsComponent } from '../group-details/group-details.component';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  constructor(private modalService: NgbModal,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserDataService) { }

  user: any = {};
  userID: any = "";
  groups: any[] = [];
  channels: any[] = [];
  members: any[] = [];
  ioConnection: any;

  ngOnInit(): void {

    if (sessionStorage.length == 0) { // Redirect user to login page if not authenticated
      this.router.navigateByUrl("");
    }

    this.route.paramMap.subscribe( // Extract user ID from url
      params => {
        this.userID = params.get("id");
      }
    );

    this.userService.getUserByID(this.userID).subscribe((res) => { // Get user data
      this.user = res.userData;
      this.userService.getUserGroups(this.userID).subscribe((res) => { // Get groups joined
        if (res.success) {
          this.channels = res.list;
          let grps = _.groupBy(res.list, grp => grp.groupID);
          this.groups = Object.keys(grps).map(key => ({id: key, value: grps[key]}));
        }
      });
    });
  }

  // Logout
  logout() {
    sessionStorage.clear();
    this.router.navigateByUrl("");
  }

  // Open modal if button triggered
  openModal(modalName: string, groupID: string = "") {
    const modal = this.modalService.open(GroupDetailsComponent, { // Open modal
      scrollable: true,
      size: 'lg',
      centered: true
    });

    // Data setup to be sent to modal
    let data = {};
    if (groupID == "") {
      data = {
        modal: modalName,
        user: this.user
      };
    }
    else {
      data = {
       modal: modalName,
       user: this.user,
       groupID: groupID,
       channels: this.channels.filter(x => x.groupID == groupID),
      }
    }

    modal.componentInstance.fromParent = data; // Pass data to modal

    modal.result.then((result) => { // Reload page when modal closes
        this.ngOnInit();
    });
  }

}
