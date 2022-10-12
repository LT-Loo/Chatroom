import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ObjectId } from 'mongodb';

import { UserDataService } from '../services/user-data.service';
import { GroupChannelDataService } from '../services/group-channel-data.service';
import { ImageUploadService } from '../services/image-upload.service';
import { ChatDataService } from '../services/chat-data.service';

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
    private imageService: ImageUploadService,
    private chatService: ChatDataService) { }

  groupID: any = "";
  channelID: any = "";
  user: any = {};
  channels: any[] = [];
  groups: any = {};
  channel: any = {};
  members: any[] = [];
  group: any = {};

  msgConnection: any;
  leaveConnection: any;
  switchConnection: any;
  joinConnection: any;
  chatHistory: any[] = [];

  chatbox: any;
  
  chat: any = {
    message: "",
    images: null,
    imageNum: 0,
    imgFilename: null
  }

  ngOnInit(): void {

    console.log("here is channel");

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

    if (userID) {
      this.userService.getUserByID(userID).subscribe((res) => {
        if (res.success) {this.user = res.userData;}
        this.userService.getUserChannels(userID, this.groupID).subscribe((res) => {
          if (res.success) {
            this.channels = res.list;
            this.channel = res.list.find((x: any) => x.channelID == this.channelID);
            this.user.role = this.channel.role;
            this.groupService.getChannelData(this.channelID).subscribe((res) => {
              if (res.success) {
                this.members = res.list.members;
                this.chatHistory = res.list.chat.history;

                // this.chatService.initSocket();
                // this.chatService.join(this.user.username, this.channelID);
                // this.joinConnection = this.chatService.getJoin().subscribe(result => {
                //   if (result) {
                //     this.chatHistory = result.chatHistory;
                //     // this.scroll.nativeElement.scrollTop = this.scroll.nativeElement.scrollHeight;

                    
                //   }
                // });

                this.msgConnection = this.chatService.getMessage().subscribe(data => {
                  this.chatHistory.push(data);
                  // this.scroll.nativeElement.scrollTop = this.scroll.nativeElement.scrollHeight;
                  // console.log(data);
                  // console.log(this.chatHistory);
                });

                
                // console.log("chat history", this.chatHistory);
              }
              // console.log(this.members);
            });
          }
        });
      });
      // this.user = JSON.parse(usr);
      // this.channels = JSON.parse(chns);
      // this.groups = JSON.parse(grp);
      // this.members = JSON.parse(mbrs);
      // console.log("bfor:", this.members);

      // this.msgConnection = this.chatService.getMessage().subscribe(data => {
      //   this.chatHistory.push(data);
      //   console.log(data);
      //   console.log(this.chatHistory);
      // });
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

  // ngAfterViewInit() {
  //   this.chatbox = document.getElementById("chatbox");
  //   this.chatbox.scrollTop = this.chatbox.scrollHeight;
  // }

  // join() {
  //   if (sessionStorage.getItem("reload") == "0") {
  //     this.chatService.initSocket();
  //     sessionStorage.setItem("reload", "1");
  //   } else {}
  // }

  leave() {
    this.chatService.leave();
    this.leaveConnection = this.chatService.getLeave().subscribe(res => {
      if (res) {this.router.navigateByUrl("account/" + this.user._id);}
    })
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

  switchChannel(channel: string) {
    let url = "channel/" + this.groupID + "/" + channel;
    this.chatService.switch(channel);
    this.switchConnection = this.chatService.getSwitch().subscribe(res => {
      if (res) {this.router.navigateByUrl(url);}
    });
    
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

    let chatData = {
      type: 'message',
      username: this.user.username,
      pfp: this.user.pfp,
      dateTime: new Date().toLocaleString(),
      message: this.chat.message,
      images: null
    }

    if (this.chat.imageNum > 0) {
      for (let i = 0; i < this.chat.imageNum; i++) {
        fd.append('images', this.chat.images[i]);
      }
      this.imageService.imgUpload(fd).subscribe(res => {
        if (res.success) {
          chatData.images = res.filenames;
          this.chatService.send(chatData);
          console.log(res.filenames);
        }
      });
    } else {this.chatService.send(chatData);}

    this.chat = {
      message: "",
      images: null,
      imageNum: 0,
      imgFilename: null
    }
  }

}
