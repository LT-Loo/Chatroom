import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';

import { UserDataService } from '../services/user-data.service';
import { GroupDetailsComponent } from '../group-details/group-details.component';
import { ChatDataService } from '../services/chat-data.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  constructor(private modalService: NgbModal,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserDataService,
    private chatService: ChatDataService) { }

  user: any = {};
  userID: any = "";
  groups: any[] = [];
  channels: any[] = [];
  members: any[] = [];
  ioConnection: any;

  ngOnInit(): void {

    console.log("run account");

    if (sessionStorage.length == 0) {
      this.router.navigateByUrl("");
    }

    this.route.paramMap.subscribe(
      params => {
        this.userID = params.get("id");
      }
    );

    // this.chatService.initSocket();
    // this.ioConnection = this.chatService.getJoin().subscribe(data => {
    //   if (data) {
    //     console.log("join"); 
    //   }
    // });

    // this.router.routeReuseStrategy.shouldReuseRoute = () => false;

    this.userService.getUserByID(this.userID).subscribe((res) => {
      this.user = res.userData;
      this.userService.getUserGroups(this.userID).subscribe((res) => {
        if (res.success) {
          this.channels = res.list;
          let grps = _.groupBy(res.list, grp => grp.groupID);
          // console.log("grps", grps);
          this.groups = Object.keys(grps).map(key => ({id: key, value: grps[key]}));
          console.log("groups", this.groups);
        }
      });
    });

    // console.log(this.user);

    // this.getData();
  }

  getData() {
    let usr = localStorage.getItem("userDetails");
    let grps = localStorage.getItem("Groups");
    let chns = localStorage.getItem("Channels");
    let mbrs = localStorage.getItem("Members");
    if (usr && grps && chns && mbrs) {
      this.user = JSON.parse(usr);
      let date = new Date(this.user.lastActive).toDateString();
      this.user.lastActive = date;

      this.groups = JSON.parse(grps);
      this.channels = JSON.parse(chns);
      this.members = JSON.parse(mbrs);
    }
    console.log(this.user);
    console.log(this.channels);
    console.log(this.groups);
    console.log(this.members);
  }

  logout() {
    sessionStorage.clear();
    this.router.navigateByUrl("");
  }

  // joinChannel(group: string, channel: string) {
  //   console.log("click to join");
  //   let url = "channel/" + group + "/" + channel;
  //   this.chatService.initSocket();
  //   this.chatService.join(this.user.username, channel);
  //   this.ioConnection = this.chatService.getJoin().subscribe(res => {
  //     console.log("get something back fom join");
  //     console.log(res);
  //     if (res) {this.router.navigateByUrl(url);};
  //   });
  // }

  openModal(modalName: string, groupID: string = "") {
    const modal = this.modalService.open(GroupDetailsComponent, {
      scrollable: true,
      size: 'lg',
      centered: true
    });

    // console.log(modalName);

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
      //  members: this.members
      }
    }

    modal.componentInstance.fromParent = data;
    modal.result.then((result) => {
        // this.getData();
        // console.log("modal close");
        this.ngOnInit();
    });
  }

}
