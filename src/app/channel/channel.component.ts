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
  channels: any = [];
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

    this.user = localStorage.getItem("userDetails");
    this.user = JSON.parse(this.user);
    this.channels = localStorage.getItem("channels");
    this.channels = JSON.parse(this.channels);
    this.group = localStorage.getItem("group");
    this.group = JSON.parse(this.group);
    this.channel = this.channels.find((x: any) => x.id == this.channelID);
  }

  joinChannel() {

  }

  leave() {
    this.router.navigateByUrl("/account/" + this.user.id);
  }

  switchChannel(channel: number) {
    console.log(channel);
    let url = "channel/" + this.groupID + "/" + channel;
    this.router.navigateByUrl(url);
  }

}
