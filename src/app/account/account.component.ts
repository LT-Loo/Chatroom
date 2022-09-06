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

  // groups = [
  //   {id: 1, name: "3813ICT", dateTime: new Date().toUTCString()},
  //   {id: 2, name: "Dance Club", dateTime: new Date().toUTCString()},
  //   {id: 3, name: "CS Club", dateTime: new Date().toUTCString()},
  //   {id: 4, name: "Griffith", dateTime: new Date().toUTCString()},
  //   {id: 5, name: "Study Group", dateTime: new Date().toUTCString()},
  //   {id: 6, name: "Swim Club", dateTime: new Date().toUTCString()},
  //   {id: 7, name: "Pets", dateTime: new Date().toUTCString()}
  // ];

  // channels = [
  //   {id: 1, groupID: 1, name: "General", dateTime: new Date().toUTCString()},
  //   {id: 2, groupID: 1, name: "Assignment", dateTime: new Date().toUTCString()},
  //   {id: 3, groupID: 2, name: "Jazz Dance", dateTime: new Date().toUTCString()},
  //   {id: 4, groupID: 2, name: "Hip Hop", dateTime: new Date().toUTCString()},
  //   {id: 5, groupID: 2, name: "House", dateTime: new Date().toUTCString()},
  //   {id: 6, groupID: 3, name: "General", dateTime: new Date().toUTCString()},
  //   {id: 7, groupID: 3, name: "Software Eng", dateTime: new Date().toUTCString()},
  //   {id: 8, groupID: 3, name: "Soft Frame", dateTime: new Date().toUTCString()},
  //   {id: 9, groupID: 3, name: "Web App Dev", dateTime: new Date().toUTCString()},
  //   {id: 10, groupID: 4, name: "General", dateTime: new Date().toUTCString()},
  //   {id: 11, groupID: 5, name: "Discussion", dateTime: new Date().toUTCString()},
  //   {id: 12, groupID: 6, name: "Events", dateTime: new Date().toUTCString()},
  //   {id: 13, groupID: 7, name: "Adopt", dateTime: new Date().toUTCString()},
  // ];

  ngOnInit(): void {
    
    this.route.paramMap.subscribe(
      params => {this.userID = params.get("id");}
    );
    let usr = localStorage.getItem("userDetails");
    let grps = localStorage.getItem("Groups");
    let chns = localStorage.getItem("Channels");
    if (usr && grps && chns) {
      this.user = JSON.parse(usr);
      let date = new Date(this.user.lastActive).toDateString();
      this.user.lastActive = date;

      this.groups = JSON.parse(grps);
      this.channels = JSON.parse(chns);
    }
    console.log(this.user);
    console.log(this.channels);
    console.log(this.groups);
  }

  logout() {
    localStorage.clear();
    this.router.navigateByUrl("");
  }

  joinChannel(group: number, channel: number) {
    localStorage.setItem("joinedGroup", JSON.stringify(this.groups.find(x => x.id == group)));
    localStorage.setItem("joinedChannels", JSON.stringify(this.channels.filter(x => x.groupID == group)));
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
       channels: this.channels.filter(x => x.groupID == groupID)
      }
    }

    console.log(data);

    modal.componentInstance.fromParent = data;
    modal.result.then((result) => {
      console.log(result);
    });
  }

}
