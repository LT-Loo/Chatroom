import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.css']
})
export class ChannelComponent implements OnInit {

  constructor(private router: Router,
    private route: ActivatedRoute) { }

  groupID: any = "";
  channelID: any = "";
  user: any = {};
  channels: any[] = [];
  groups: any = {};
  channel: any = {};
  members: any = {};
  group: any = {};

  ngOnInit(): void {

    this.route.paramMap.subscribe(
      params => {
        this.groupID = params.get("group");
        this.channelID = params.get("channel");
      }
    );

    this.router.routeReuseStrategy.shouldReuseRoute = () => false;

    let usr = localStorage.getItem("userDetails");
    let chns = localStorage.getItem("Channels");
    let grp = localStorage.getItem("Groups");
    let mbrs = localStorage.getItem("Members");
    if (usr && chns && grp && mbrs) {
      this.user = JSON.parse(usr);
      this.channels = JSON.parse(chns);
      this.groups = JSON.parse(grp);
      this.members = JSON.parse(mbrs);
      console.log("bfor:", this.members);
    }
    this.channel = this.channels.find((x: any) => x.id == this.channelID);
    this.members = this.members.find((x: any) => x.channel == this.channelID && x.group == this.groupID);
    this.channels = this.channels.filter(x => x.groupID == this.groupID);
    this.group = this.groups.find((x: any) => x.id == this.groupID);
    console.log("usr:", this.user);
    console.log("grp:",this.group);
    console.log("chns:", this.channels);
    console.log("chn:", this.channel);
    console.log("mbr:", this.members);
  }

  leave() {
    this.router.navigateByUrl("account/" + this.user.id);
  }

  switchChannel(channel: number) {
    console.log(channel);
    let url = "channel/" + this.groupID + "/" + channel;
    this.router.navigateByUrl(url);
  }

}
