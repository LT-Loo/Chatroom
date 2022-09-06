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
  group: any = {};
  channel: any = {};

  ngOnInit(): void {
    this.route.paramMap.subscribe(
      params => {
        this.groupID = params.get("group");
        this.channelID = params.get("channel");
      }
    );

    this.router.routeReuseStrategy.shouldReuseRoute = () => false;

    let usr = localStorage.getItem("userDetails");
    let chns = localStorage.getItem("joinedChannels");
    let grp = localStorage.getItem("joinedGroup");
    if (usr && chns && grp) {
      this.user = JSON.parse(usr);
      this.channels = JSON.parse(chns);
      this.group = JSON.parse(grp);
    }
    this.channel = this.channels.find((x: any) => x.id == this.channelID);
    console.log(this.user);
    console.log(this.group);
    console.log(this.channels);
    console.log(this.channel);
  }

  leave() {
    localStorage.removeItem("joinedGroup");
    localStorage.removeItem("joinedChannels");
    this.router.navigateByUrl("account/" + this.user.id);
  }

  switchChannel(channel: number) {
    console.log(channel);
    let url = "channel/" + this.groupID + "/" + channel;
    this.router.navigateByUrl(url);
  }

}
