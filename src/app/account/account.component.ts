import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';

import { GroupDetailsComponent } from '../group-details/group-details.component';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  constructor(private modalService: NgbModal,
    private router: Router,
    private route: ActivatedRoute) { }

  user: any = {};
  userID: any = "";
  groups: any[] = [];
  channels: any[] = [];
  members: any[] = [];

  ngOnInit(): void {

    if (localStorage.length == 0) {
      this.router.navigateByUrl("");
    }

    this.route.paramMap.subscribe(
      params => {
        this.userID = params.get("id");
      }
    );

    this.getData();
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
    localStorage.clear();
    this.router.navigateByUrl("");
  }

  joinChannel(group: number, channel: number) {
    // localStorage.setItem("joinedGroup", JSON.stringify(this.groups.find(x => x.id == group)));
    // localStorage.setItem("joinedChannels", JSON.stringify(this.channels.filter(x => x.groupID == group)));
    // localStorage.setItem("channelMembers", JSON.stringify(this.members.filter(x => x.channel == channel && x.group == group)));
    let url = "channel/" + group + "/" + channel;
    this.router.navigateByUrl(url);
  }

  openModal(modalName: string, groupID: number = -1) {
    const modal = this.modalService.open(GroupDetailsComponent, {
      scrollable: true,
      size: 'lg',
      centered: true
    });

    console.log(groupID);

    let data = {};
    if (groupID < 0) {
      data = {
        modal: modalName,
        user: this.user
      };
    }
    else {
      data = {
       modal: modalName,
       user: this.user,
       group: this.groups.find(x => x.id == groupID),
       channels: this.channels.filter(x => x.groupID == groupID),
       members: this.members
      }
    }

    console.log(data);

    modal.componentInstance.fromParent = data;
    modal.result.then((result) => {
        this.getData();
    });
  }

}
