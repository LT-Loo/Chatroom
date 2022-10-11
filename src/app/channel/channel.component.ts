import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ObjectId } from 'mongodb';

import { UserDataService } from '../services/user-data.service';
import { GroupChannelDataService } from '../services/group-channel-data.service';
import { ImageUploadService } from '../services/image-upload.service';

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.css']
})
export class ChannelComponent implements OnInit {

  constructor(private router: Router,
    private route: ActivatedRoute,
    private userService: UserDataService,
    private groupService: GroupChannelDataService,
    private imageService: ImageUploadService) { }

  groupID: any = "";
  channelID: any = "";
  user: any = {};
  channels: any[] = [];
  groups: any = {};
  channel: any = {};
  members: any[] = [];
  group: any = {};
  
  chat: any = {
    message: "",
    images: null,
    imageNum: 0,
  }

  ngOnInit(): void {

    if (sessionStorage.length == 0) {
      this.router.navigateByUrl("");
    }

    this.route.paramMap.subscribe(
      params => {
        this.groupID = params.get("group");
        this.channelID = params.get("channel");
      }
    );

    this.router.routeReuseStrategy.shouldReuseRoute = () => false;

    let userID = sessionStorage.getItem("auth");
    // let chns = localStorage.getItem("Channels");
    // let grp = localStorage.getItem("Groups");
    // let mbrs = localStorage.getItem("Members");
    if (userID) {
      this.userService.getUserByID(userID).subscribe((res) => {
        if (res.success) {this.user = res.userData;}
        this.userService.getUserChannels(userID, this.groupID).subscribe((res) => {
          if (res.success) {
            this.channels = res.list;
            this.channel = res.list.find((x: any) => x.channelID == this.channelID);
            this.user.role = this.channel.role;
            this.groupService.getChannelMembers(this.channelID).subscribe((res) => {
              if (res.success) {this.members = res.list;}
              console.log(this.members);
            });
          }
        });
      });
      // this.user = JSON.parse(usr);
      // this.channels = JSON.parse(chns);
      // this.groups = JSON.parse(grp);
      // this.members = JSON.parse(mbrs);
      // console.log("bfor:", this.members);
    }

    // this.channel = this.channels.find((x: any) => x.id == this.channelID);
    // this.members = this.members.find((x: any) => x.channel == this.channelID && x.group == this.groupID);
    // this.channels = this.channels.filter(x => x.groupID == this.groupID);
    // this.group = this.groups.find((x: any) => x.id == this.groupID);
    // console.log("usr:", this.user);
    // console.log("grp:",this.group);
    // console.log("chns:", this.channels);
    // console.log("chn:", this.channel);
    // console.log("mbr:", this.members);
  }

  leave() {
    this.router.navigateByUrl("account/" + this.user._id);
  }

  deleteChannel() {
    this.groupService.deleteChannel(this.channelID).subscribe(res => {
      if (res.success) {
        this.userService.getUserChannels(this.user._id, this.groupID).subscribe(res => {
          this.channels = res.list;
          this.switchChannel(this.channels[0].channelID);
        });
      }
    });
    // let chnList: any = localStorage.getItem("Channels");
    // chnList = JSON.parse(chnList);
    // let mbrList: any = localStorage.getItem("Members");
    // mbrList = JSON.parse(mbrList);

    // mbrList = mbrList.filter((x: any) => x.channel != this.channelID || x.group != this.groupID);
    // chnList = chnList.filter((x: any) => x.id != this.channelID || x.groupID != this.groupID);

    // localStorage.setItem("Channels", JSON.stringify(chnList));
    // localStorage.setItem("Members", JSON.stringify(mbrList));

    // this.channel = chnList.filter((x: any) => x.groupID == this.groupID);

    // this.switchChannel(this.channels[0].channelID);
  }

  switchChannel(channel: number) {
    let url = "channel/" + this.groupID + "/" + channel;
    this.router.navigateByUrl(url);
  }

  delete(from: string, userID: any) {
    // let mbrList: any = localStorage.getItem("Members");
    // mbrList = JSON.parse(mbrList);

    if (from == "Group") {
      this.groupService.deleteFromGroup(userID, this.groupID).subscribe(res => {
        if (res.success) {this.ngOnInit();}
      });
    } else {
      this.groupService.deleteFromChannel(userID, this.channelID).subscribe(res => {
        if (res.success) {this.ngOnInit();}
      });
    }

    // let indArr = mbrList.reduce((arr: number[], x: any, ind: number) => {
    //   if (from == "Group") {
    //     if (x.group == this.groupID) {arr.push(ind);}
    //   } else {
    //     if (x.group == this.groupID && x.channel == this.channelID) {arr.push(ind);}
    //   }
    //   return arr;
    // }, []);

    // console.log(userID);

    // for (let i of indArr) {
    //   mbrList[i].members = mbrList[i].members.filter((x: any) => x.userID != userID);
    // }

    // console.log(mbrList);

    // localStorage.setItem("Members", JSON.stringify(mbrList));
    // this.ngOnInit();
  }

  onFileSelected(event: any) {
    this.chat.images = event.target.files; 
    this.chat.imageNum = this.chat.images.length;
    console.log("select file");
    console.log(this.chat.images);
  }

  clearImage() {
    this.chat.images = null;
    this.chat.imageNum = 0;
  }

  sendChat() {
    const fd = new FormData();

    if (this.chat.imageNum > 0) {
      for (let i = 0; i < this.chat.imageNum; i++) {
        fd.append('images', this.chat.images[i]);
      }
      this.imageService.chatImgUpload(fd).subscribe(res => {
        if (res.success) {console.log(res.filenames);}
      });
    }
    // fd.append('image', this.settings.file, this.settings.file.name);

    // this.imageService.imgUpload(fd).subscribe(res => {
    //   if (res.success) {
    //     // let imagepath = res.filename;
    //     let data = {
    //       _id: this.user._id,
    //       pfp: res.filename
    //     }
    //     this.userService.updateUser(data).subscribe(res => {
    //       if (res.success) {this.closeModal();}
    //     });
    //   }
      // console.log("to serverrrr");
    // });
  }

}
