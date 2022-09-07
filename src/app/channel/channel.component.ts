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

    if (localStorage.length == 0) {
      this.router.navigateByUrl("");
    }

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

  deleteChannel() {
    let chnList: any = localStorage.getItem("Channels");
    chnList = JSON.parse(chnList);
    let mbrList: any = localStorage.getItem("Members");
    mbrList = JSON.parse(mbrList);

    mbrList = mbrList.filter((x: any) => x.channel != this.channelID || x.group != this.groupID);
    chnList = chnList.filter((x: any) => x.id != this.channelID || x.groupID != this.groupID);

    localStorage.setItem("Channels", JSON.stringify(chnList));
    localStorage.setItem("Members", JSON.stringify(mbrList));

    this.channel = chnList.filter((x: any) => x.groupID == this.groupID);

    this.switchChannel(this.channel[0].id);
  }

  switchChannel(channel: number) {
    let url = "channel/" + this.groupID + "/" + channel;
    this.router.navigateByUrl(url);
  }

  delete(from: string, userID: any) {
    let mbrList: any = localStorage.getItem("Members");
    mbrList = JSON.parse(mbrList);

    let indArr = mbrList.reduce((arr: number[], x: any, ind: number) => {
      if (from == "Group") {
        if (x.group == this.groupID) {arr.push(ind);}
      } else {
        if (x.group == this.groupID && x.channel == this.channelID) {arr.push(ind);}
      }
      return arr;
    }, []);

    console.log(userID);

    for (let i of indArr) {
      mbrList[i].members = mbrList[i].members.filter((x: any) => x.userID != userID);
    }

    console.log(mbrList);

    localStorage.setItem("Members", JSON.stringify(mbrList));
    this.ngOnInit();
  }

}
