import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

import { UserDataService } from '../services/user-data.service';
import { GroupChannelDataService } from '../services/group-channel-data.service';
import { ImageUploadService } from '../services/image-upload.service';
import { ChatDataService } from '../services/chat-data.service';

@Component({
  selector: 'app-group-details',
  templateUrl: './group-details.component.html',
  styleUrls: ['./group-details.component.css']
})
export class GroupDetailsComponent implements OnInit {

  @Input() fromParent: any;

  modal: string = "";
  groupName: string = "";
  groupValid: boolean = true;
  channelList: boolean = true;
  select: string = "";
  selectChn: any = {};
  userList: any[] = [];
  ioConnection: any;

  user: any = {};
  groupID: string = "";
  group: any = {};
  channels: any[] = [];
  members: any[] = [];
  admins: any[] = [];
  assises: any[] = [];

  newGroup: any = {
    name: "",
    channel: "",
    channelList: [],
    channelEmpty: false,
    invalidChannel: false
  };

  newChannel: any = {
    name: "",
    member: "",
    memberList: [],
    invalidChannel: false,
    invalidMember: false,
    channelEmpty: false,
    memberEmpty: false
  }

  addToChannel: any = {
    member: "",
    memberList: [],
    invalidMember: false,
    memberEmpty: false
  }

  newUser: any = {
    username: "",
    email: "",
    validUser: true,
    nameEmpty: false,
    emailEmpty: false
  }

  chgRole: any = {
    username: "",
    role: "Choose Role",
    validUser: true,
    userEmpty: false,
    roleEmpty: false
  }

  settings: any = {
    file: null,
    imagepath: "",
    newPwd: "",
    confirmPwd: "",
    match: true,
    blank: false
  }

  constructor(public activeModal: NgbActiveModal,
    private router: Router,
    private userService: UserDataService,
    private groupService: GroupChannelDataService,
    private imageService: ImageUploadService,
    private chatService: ChatDataService) { }

  ngOnInit(): void {
    // Retrieve data sent from parent
    this.modal = this.fromParent.modal;
    this.user = this.fromParent.user;
    this.groupID = this.fromParent.groupID;
    this.channels = this.fromParent.channels;
    this.user.role = this.user.superOrAdmin;

    // Get group data (For Group Details Modal)
    this.groupService.getGroup(this.fromParent.groupID).subscribe((res) => {
      if (res.success) {
        this.group = res.itemData;
        this.user.role = this.channels[0].role;
        this.groupService.getGroupMembers(this.groupID).subscribe(res => {
          if (res.success) {this.members = res.list;}
        });
      }
    });

    this.getUserList(); // Get list of users based on role

  }

  // Close modal
  closeModal(sendData: any = null) {
    this.activeModal.close(sendData);
  }

  createChannel() {this.modal = "newChannel";} // Change modal to New Channel Modal

  createGroup() {this.modal = "newGroup";} // Change modal to New Group Modal

  // Add user to member list
  addMember() {
    console.log(this.groupID);
    if (this.select != "") {this.modal = "addMember";}
  }

  // Switch modal or close modal
  back() {
    this.select = "";
    if(this.modal == "newChannel" || this.modal == "addMember") {this.modal = "details";}
    else {this.activeModal.close();}
  }

  // Select channel
  selectChannel(channel: string) {
    this.select = channel;
    this.selectChn = this.channels.find((x: any) => x.channelID == this.select);
  }

  // Join selected channel
  joinChannel() {
    if (this.select == "") {this.select = this.channels[0].channelID;}
    let url = "channel/" + this.group._id + "/" + this.select;
    this.chatService.initSocket(); // Create and connect socket to server
    this.chatService.join(this.user.username, this.select); // Send join request
    this.ioConnection = this.chatService.getJoin().subscribe(res => { // Redirect route if request approved
      if (res) {
        this.activeModal.close();
        this.router.navigateByUrl(url);
      }
    });   
  }

  // Create new user (For Admin Modal)
  createUser() {

    // Input validation
    if (this.newUser.username == "") {this.newUser.nameEmpty = true;}
    else {this.newUser.nameEmpty = false;}

    if (this.newUser.email == "") {this.newUser.emailEmpty = true;}
    else {this.newUser.emailEmpty = false;}

    if (this.newUser.emailEmpty || this.newUser.userEmpty) {return;}

    this.userService.getAllUsers().subscribe(res => { // Get all users in database
      if (res.success) {
        let allUsers = res.items;
        if(allUsers.find((x: any) => x.username == this.newUser.username)) { // Check duplicate username
          this.newUser.validUser = false;
          return;
        } else { // If user valid, create user
          this.newUser.validUser = true;
          let newUserData = {
            username: this.newUser.username,
            email: this.newUser.email,
            lastActive: new Date().toLocaleString(),
            superOrAdmin: "none"
          }
          this.userService.register(newUserData).subscribe(res => { // Send data to server
            if (res.success) {
              this.newUser.username = "";
              this.newUser.email = "";
              this.newUser.emptyName = false;
              this.newUser.emptyEmail = false;
              this.newUser.validUser = true;

              if (confirm(`New account for ${res.item.username} successfully created. Please change your password as soon as possible.`)) {
                this.activeModal.close();
              }
            } else {
              if (confirm(`Failed to create account for ${this.newUser.username}.`)) {
                this.activeModal.close();
              }
            }
          });
        }
      }
    });
  }

  // Change/Upgrade user role
  chgUserRole() {

    // Input validation
    if (this.chgRole.username == "") {this.chgRole.userEmpty = true;}
    else {this.chgRole.userEmpty = false;}

    if (this.chgRole.role == "Choose Role") {this.chgRole.roleEmpty = true;}
    else {this.chgRole.roleEmpty = false;}

    if (this.chgRole.roleEmpty || this.chgRole.userEmpty) {
      this.chgRole.validUser = true;
      return;
    }

    // Check if user exists
    if (!this.userList.find((x: any) => x.username == this.chgRole.username) || this.user.username == this.chgRole.username) {
      this.chgRole.validUser = false;
    } else { // Is user exists
      this.chgRole.validUser = true;
      let change = {
        username: this.chgRole.username,
        role: this.chgRole.role
      }
      this.userService.upgradeUser(change).subscribe(res => { // Send data to server
        this.closeModal();
      })
    }
  }

  // Add channel to new group (For New Group Modal)
  newGroupAddChannel() {

    // Input validation
    if (!this.newGroup.channel) {this.newGroup.channelEmpty = true;}
    // Check duplicate channel name in group
    else if (!this.newGroup.channelList.includes(this.newGroup.channel.toLowerCase())) {
      this.newGroup.channelList.push(this.newGroup.channel); // Add channel if valid
      this.newGroup.channel = "";
      this.newGroup.channelEmpty = false;
      this.newGroup.invalidChannel = false;
    }
    else {this.newGroup.invalidChannel = true;}
  }

  // Get list of users based on role
  getUserList() {

    if (this.user.role == "assis") { // Group Assis - Get group members
      this.groupService.getGroupMembers(this.groupID).subscribe(res => {
        if (res.success) {this.userList = res.list;}
      });
    } else if (this.user.role == "super" || this.user.role == "admin") { // Super or Group Admin - Get all users
      this.userService.getAllUsers().subscribe(res => {
        if (res.success) {this.userList = res.items;}
        console.log("in subscribe", this.userList);
      });
    }
  }

  // Add member to new channel
  async newChannelAddMember() {

    // Input validation
    if (this.newChannel.member == "") {this.newChannel.memberEmpty = true; return;}
    else {this.newChannel.memberEmpty = false;}

    // Add member to list if user valid
    if (!this.newChannel.memberList.includes(this.newChannel.member)
        && this.userList.find((x: any) => x.username == this.newChannel.member)) {
      this.newChannel.memberList.push(this.newChannel.member);
      this.newChannel.member = "";
      this.newChannel.invalidMember = false;
    }
    else {this.newChannel.invalidMember = true;}
  }

  // Add member to existing channel
  addMemberToChannel() {

    // Input validation
    if (this.addToChannel.member == "") {
      this.addToChannel.memberEmpty = true;
      return;
    } else {this.addToChannel.memberEmpty = false;}

    // Add member to list if user exist
    if (!this.addToChannel.memberList.includes(this.addToChannel.member)
        && this.userList.find((x: any) => x.username == this.addToChannel.member)) {
      this.addToChannel.memberList.push(this.addToChannel.member);
      this.addToChannel.member = "";
      this.addToChannel.invalidMember = false;
    }
    else {this.addToChannel.invalidMember = true;}
  }

  // Create group / channel or add member
  async createItem(modal: string = "") {

    if (modal == "") {modal = this.modal;}

    // Create new Group
    if (modal == "newGroup") {

      let groupData = {
        name: this.newGroup.name,
        dateTime: new Date().toLocaleString(),
        channelList: this.newGroup.channelList,
        creator: this.user
      };

      this.groupService.newGroup(groupData).subscribe((res) => {
        if (res.success) {this.closeModal();}
      });  
    }

    // Create new channel
    if (modal == "newChannel") {
      
      // Input validation
      if (this.newChannel.name == "") {this.newChannel.channelEmpty = true; return;}
      else {this.newChannel.channelEmpty = false;}

      // Check for duplicate channel name in group
      if (this.channels.find(x => x.channelName == this.newChannel.name)) {
        this.newChannel.invalidChannel = true;
        return;
      } else { // If channel name valid, send data to server to be stored
        this.newChannel.invalidChannel = false;
        let channelData = {
          name: this.newChannel.name,
          groupID: this.groupID,
          dateTime: new Date().toLocaleString(),
          memberList: this.newChannel.memberList
        }

        this.groupService.newChannel(channelData).subscribe(res => {
          if (res.success) {
            this.userService.getUserChannels(this.user._id.toString(), this.groupID).subscribe(res => {
              if (res.success) {
                this.fromParent.channels = res.list; // Update channel list
                this.back();
              }
            });
          }
        });
      }
    }

    // Add member to channel
    if (modal == "addMember") {
      if (this.addToChannel.memberList) {
        let data = {
          channelID: this.select,
          groupID: this.groupID,
          memberList: this.addToChannel.memberList
        };

        this.groupService.addMemberToChannel(data).subscribe(res => {
          if (res.success) {this.back();}
          this.addToChannel = { // Reset form
            member: "",
            memberList: [],
            invalidMember: false,
            memberEmpty: false
          }
        });
      }
    }
  }

  // Delete group or channel
  deleteItem(item: string) {

    if (item == "Group") { // Delete group
      this.groupService.deleteGroup(this.groupID).subscribe(res => {
        if (res.success) {this.closeModal();}
      });
    }
    else if (item == "Channel") { // Delete channel
      this.groupService.deleteChannel(this.select).subscribe(res => {
        if (res.success) {
          this.userService.getUserChannels(this.user._id, this.groupID).subscribe(res => {
            this.fromParent.channels = res.list; // Update channel list
          });
        }
      });
    }
  }

  // Get image file
  onFileSelected(event: any) {
    this.settings.file = event.target.files[0]; 
  }

  // Store image in database
  onUpload() {
    const fd = new FormData();
    fd.append('images', this.settings.file, this.settings.file.name);

    this.imageService.imgUpload(fd).subscribe(res => {
      if (res.success) {
        let data = {
          _id: this.user._id,
          pfp: res.filenames[0]
        }
        this.userService.updateUser(data).subscribe(res => { // Update user data
          if (res.success) {this.closeModal();}
        });
      }
    });
  }

  // Change user password
  changePassword() {
    // Input validation
    if (this.settings.newPwd == "" || this.settings.confirmPwd == "") {
      this.settings.blank = true;
      return;
    } else {this.settings.blank = false;}

    if (this.settings.newPwd != this.settings.confirmPwd) {this.settings.match = false; return;}
    else {this.settings.match = true;}

    // If input valid, update user data
    if (confirm("Confirm to change password?")) {
      let data = {
        _id: this.user._id,
        password: this.settings.newPwd
      };

      this.userService.updateUser(data).subscribe(res => {
        if (res.success) {
          if (confirm("Password changed successfully.")) {this.closeModal();}
        }
      })
    }
  }
}
