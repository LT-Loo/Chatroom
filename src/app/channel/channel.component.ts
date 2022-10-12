import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

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
  // group: any = {};

  msgConnection: any;
  leaveConnection: any;
  switchConnection: any;
  joinConnection: any;
  chatHistory: any[] = [];

  // chatbox: any;
  
  chat: any = {
    message: "",
    images: null,
    imageNum: 0,
    imgFilename: null
  }

  ngOnInit(): void {

    if (sessionStorage.length == 0) { // Redirect user to login page if not authenticated
      this.router.navigateByUrl("");
    }

    this.route.paramMap.subscribe( // Extract group and channel IDs from url
      params => {
        this.groupID = params.get("group");
        this.channelID = params.get("channel");
      }
    );

    this.router.routeReuseStrategy.shouldReuseRoute = () => false; // Reuse route

    let userID = sessionStorage.getItem("auth"); // Get user ID from session storage

    if (userID) {
      this.userService.getUserByID(userID).subscribe((res) => { // Get user data
        if (res.success) {this.user = res.userData;}
        this.userService.getUserChannels(userID, this.groupID).subscribe((res) => { // Get channels user joined
          if (res.success) {
            this.channels = res.list;
            this.channel = res.list.find((x: any) => x.channelID == this.channelID);
            this.user.role = this.channel.role;
            this.groupService.getChannelData(this.channelID).subscribe((res) => { // Get channel data
              if (res.success) {
                this.members = res.list.members;
                this.chatHistory = res.list.chat.history;

                // Listen for message from server 
                this.msgConnection = this.chatService.getMessage().subscribe(data => {
                  this.chatHistory.push(data); // Push message into array
                });
              }
            });
          }
        });
      });
    }
  }

  // Leave channel
  leave() {
    this.router.navigateByUrl("account/" + this.user._id);
    this.chatService.leave();
  }

  // Delete current channel
  deleteChannel() {
    this.groupService.deleteChannel(this.channelID).subscribe(res => { // Delete channel
      if (res.success) {
        this.userService.getUserChannels(this.user._id, this.groupID).subscribe(res => { // Get new list of channels
          this.channels = res.list;
          this.switchChannel(this.channels[0].channelID); // Switch to first channel (default)
        });
      }
    });
  }

  // Switch channel
  switchChannel(channel: string) {
    let url = "channel/" + this.groupID + "/" + channel;
    this.chatService.switch(channel);
    this.switchConnection = this.chatService.getSwitch().subscribe(res => {
      if (res) {this.router.navigateByUrl(url);}
    });
    
  }

  // Remove member from group or channel
  delete(from: string, userID: any) {

    if (from == "Group") {
      this.groupService.deleteFromGroup(userID, this.groupID).subscribe(res => {
        if (res.success) {this.ngOnInit();}
      });
    } else {
      this.groupService.deleteFromChannel(userID, this.channelID).subscribe(res => {
        if (res.success) {this.ngOnInit();}
      });
    }
  }

  // Get files uploaded by user
  onFileSelected(event: any) {
    this.chat.images = event.target.files; 
    this.chat.imageNum = this.chat.images.length;
  }

  // Clear image files
  clearImage() {
    this.chat.images = null;
    this.chat.imageNum = 0;
  }

  // Send message to channel
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

    // If image uploaded, store image in server
    if (this.chat.imageNum > 0) {
      for (let i = 0; i < this.chat.imageNum; i++) {
        fd.append('images', this.chat.images[i]);
      }
      this.imageService.imgUpload(fd).subscribe(res => {
        if (res.success) {
          chatData.images = res.filenames;
          this.chatService.send(chatData); // Send message request to server
        }
      });
    } else {this.chatService.send(chatData);} // Send message request to server

    // Reset message box
    this.chat = {
      message: "",
      images: null,
      imageNum: 0,
      imgFilename: null
    }
  }
}
