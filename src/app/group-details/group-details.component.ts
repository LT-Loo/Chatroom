import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { v4 as uuid4 } from 'uuid';

import { UserDataService } from '../services/user-data.service';
import { GroupChannelDataService } from '../services/group-channel-data.service';

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

  constructor(public activeModal: NgbActiveModal,
    private router: Router,
    private userService: UserDataService,
    private groupService: GroupChannelDataService) { }

  ngOnInit(): void {
    this.modal = this.fromParent.modal;
    this.user = this.fromParent.user;
    this.groupID = this.fromParent.groupID;
    this.channels = this.fromParent.channels;
    this.user.role = this.user.superOrAdmin;
    // this.members = this.fromParent.members;
    this.groupService.getGroup(this.fromParent.groupID).subscribe((res) => {
      if (res.success) {
        this.group = res.itemData;
        this.user.role = this.channels[0].role;
        this.groupService.getGroupMembers(this.groupID).subscribe(res => {
          if (res.success) {this.members = res.list;}
        });
      }
      // console.log(res);
    });

    this.getUserList();
    console.log("userList", this.userList);
    // console.log("prnt:", this.fromParent);
  }

  // ngOnChanges(): void {
  //   console.log("run");
  //   this.userService.getUserChannels(this.user._id, this.groupID).subscribe(res => {
  //     this.channels = res.list;
  //   });
  // }

  closeModal(sendData: any = null) {
    this.activeModal.close(sendData);
  }

  createChannel() {
    this.modal = "newChannel";
  }

  createGroup() {this.modal = "newGroup";}

  addMember() {
    console.log(this.groupID);
    if (this.select != "") {this.modal = "addMember";}
  }

  back() {
    this.select = "";
    if(this.modal == "newChannel" || this.modal == "addMember") {this.modal = "details";}
    else {this.activeModal.close();}
  }

  selectChannel(channel: string) {
    this.select = channel;
    this.selectChn = this.channels.find((x: any) => x.channelID == this.select);
  }

  joinChannel() {
    if (this.select == "") {this.select = this.channels[0].channelID;}
    let url = "channel/" + this.group._id + "/" + this.select;
    this.activeModal.close();
    this.router.navigateByUrl(url);
  }

  createUser() {
    // let usrList: any = localStorage.getItem("Users");
    // usrList = JSON.parse(usrList);

    // this.newUser.nameEmpty = false;
    // this.newUser.emailEmpty = false;
    // this.newUser.validUser = true;

    if (this.newUser.username == "") {this.newUser.nameEmpty = true;}
    else {this.newUser.nameEmpty = false;}

    if (this.newUser.email == "") {this.newUser.emailEmpty = true;}
    else {this.newUser.emailEmpty = false;}

    if (this.newUser.emailEmpty || this.newUser.userEmpty) {return;}

    this.userService.getAllUsers().subscribe(res => {
      if (res.success) {
        let allUsers = res.items;
        if(allUsers.find((x: any) => x.username == this.newUser.username)) {
          this.newUser.validUser = false;
          return;
        } else {
          this.newUser.validUser = true;
          let newUserData = {
            username: this.newUser.username,
            email: this.newUser.email,
            lastActive: new Date().toLocaleString(),
            superOrAdmin: "none"
          }
          this.userService.register(newUserData).subscribe(res => {
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

    
    // if (usrList.map((x: any) => x.username).includes(this.newUser.username)) {
    //   this.newUser.validUser = false;
    //   // this.newUser.username = "";
    // } else {
    //   let user = {
    //     id: uuid4(),
    //     username: this.newUser.username,
    //     email: this.newUser.email,
    //     role: this.newUser.role,
    //     lastActive: new Date().toUTCString()
    //   }
    //   console.log(user);
    //   usrList.push(user);
    //   localStorage.setItem("Users", JSON.stringify(usrList));
      
    //   this.newUser.username = "";
    //   this.newUser.email = "";
    //   this.newUser.role = "";  
    //   this.newUser.validUser = true;
    // }
    // this.newUser.empty = false; 
  }

  chgUserRole() {
    // let usrList: any = localStorage.getItem("Users");
    // usrList = JSON.parse(usrList);

    if (this.chgRole.username == "") {this.chgRole.userEmpty = true;}
    else {this.chgRole.userEmpty = false;}

    if (this.chgRole.role == "Choose Role") {this.chgRole.roleEmpty = true;}
    else {this.chgRole.roleEmpty = false;}

    if (this.chgRole.roleEmpty || this.chgRole.userEmpty) {
      this.chgRole.validUser = true;
      return;
    }

    console.log(this.userList);
    if (!this.userList.find((x: any) => x.username == this.chgRole.username) || this.user.username == this.chgRole.username) {
      this.chgRole.validUser = false;
      
      // return
    } else {
      this.chgRole.validUser = true;
      let change = {
        username: this.chgRole.username,
        role: this.chgRole.role
      }
      console.log(change);
      this.userService.upgradeUser(change).subscribe(res => {
        this.closeModal();
      })
      // if (this.chgRole.username) {
      //   let index = usrList.findIndex((x: any) => {
      //     return x.username == this.chgRole.username;
      //   });
      //   usrList[index].role = this.chgRole.role;
      //   localStorage.setItem("Users", JSON.stringify(usrList));

      //   this.chgRole.username = "";
      //   this.activeModal.close();
      // }
    }
  }

  newGroupAddChannel() {

    if (!this.newGroup.channel) {this.newGroup.channelEmpty = true;}
    else if (!this.newGroup.channelList.includes(this.newGroup.channel.toLowerCase())) {
      this.newGroup.channelList.push(this.newGroup.channel);
      this.newGroup.channel = "";
      this.newGroup.channelEmpty = false;
      this.newGroup.invalidChannel = false;
    }
    else {this.newGroup.invalidChannel = true;}
  }

  getUserList(type: string = "") {
    // let userList: any = [];
    // let list: any = [];
    // if (this.user.role == "Group Assis") {
    //   if (type == "newChannel") {
    //     list = this.members.filter((x: any) => x.group == this.group.id);
    //   } else {
    //     list = this.members.filter((x: any) => x.group == this.group.id && x.channel != this.select);
    //   }
    //   for (let ls of list) {
    //     for (let mbr of ls.members) {
    //       if (!userList.find((x: any) => mbr.username == x.username)) {userList.push(mbr)};
    //     }
    //   }
    // } else {
    //   userList = localStorage.getItem("Users");
    //   userList = JSON.parse(userList); 
    //   if (type != "newChannel") {
    //     let rmList = this.members.filter((x: any) => x.group == this.group.id && x.channel == this.select);
    //     for (let rm of rmList) {
    //       for (let mbr of rm.members) {
    //         userList = userList.filter((x: any) => x.username != mbr.username);
    //       }
    //     }
    //   }
    // }

    // userList = userList.map((x: any) => x.username);

    // console.log("userList", userList);

    // return userList;

    // let userList: any = [];

    if (this.user.role == "assis") {
      this.groupService.getGroupMembers(this.groupID).subscribe(res => {
        if (res.success) {this.userList = res.list;}
      });
    } else if (this.user.role == "super" || this.user.role == "admin") {
      this.userService.getAllUsers().subscribe(res => {
        if (res.success) {this.userList = res.items;}
        console.log("in subscribe", this.userList);
      });
    }

    console.log("outside subscribe", this.userList);

    // return userList;
  }

  async newChannelAddMember() {
    // let userList = this.getUserList("newChannel");
    // await this.getUserList();
    console.log("infunrtion", this.userList);
    if (this.newChannel.member == "") {this.newChannel.memberEmpty = true; return;}
    else {this.newChannel.memberEmpty = false;}

    if (!this.newChannel.memberList.includes(this.newChannel.member)
        && this.userList.find((x: any) => x.username == this.newChannel.member)) {
      this.newChannel.memberList.push(this.newChannel.member);
      this.newChannel.member = "";
      this.newChannel.invalidMember = false;
    }
    else {this.newChannel.invalidMember = true;}
  }

  addMemberToChannel() {
    // let userList: any = this.getUserList();

    if (this.addToChannel.member == "") {
      this.addToChannel.memberEmpty = true;
      return;
    } else {this.addToChannel.memberEmpty = false;}

    if (!this.addToChannel.memberList.includes(this.addToChannel.member)
        && this.userList.find((x: any) => x.username == this.addToChannel.member)) {
      this.addToChannel.memberList.push(this.addToChannel.member);
      this.addToChannel.member = "";
      this.addToChannel.invalidMember = false;
    }
    else {this.addToChannel.invalidMember = true;}
    // console.log(this.addToChannel.memberList);
  }

  async createItem(modal: string = "") {
    let saveChange = true;
    let close = true;
    let grpList: any = localStorage.getItem("Groups");
    grpList = JSON.parse(grpList);
    let chnList: any = localStorage.getItem("Channels");
    chnList = JSON.parse(chnList);
    let mbrList: any = localStorage.getItem("Members");
    mbrList = JSON.parse(mbrList);
    let usrList: any = localStorage.getItem("Users");
    usrList = JSON.parse(usrList);

    if (modal == "") {modal = this.modal;}

    if (modal == "newGroup") {

      let groupData = {
        name: this.newGroup.name,
        dateTime: new Date().toLocaleString(),
        channelList: this.newGroup.channelList,
        creator: this.user
      };

      let newGroup: any = {};
      this.groupService.newGroup(groupData).subscribe((res) => {
        if (res.success) {this.closeModal();}
      });  
    }

    if (modal == "newChannel") {
      // console.log((chnList.map((x: any) => x.name)));
      // await this.getUserList();
      if (this.newChannel.name == "") {this.newChannel.channelEmpty = true; return;}
      else {this.newChannel.channelEmpty = false;}

      if (this.channels.find(x => x.channelName == this.newChannel.name)) {
        this.newChannel.invalidChannel = true;
        // this.newChannel.name = "";
        return;
      } else {
        this.newChannel.invalidChannel = false;
        saveChange = true;
        // close = false;
        // let chn: any = {
        //   id: uuid4(),
        //   groupID: this.group.id,
        //   name: this.newChannel.name,
        //   date: new Date().toUTCString()
        // }
        // let chnMbr: any = {
        //   channel: chn.id,
        //   group: this.group.id,
        //   members: []
        // }
        // let members = [];
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
                this.fromParent.channels = res.list;
                // console.log(this.fromParent.channels);
                this.back();
              }
            });
          }
        });

        // chnMbr.members.push(usrList.find((x: any) => x.username == this.user.username || x.role == "Super Admin"));
        // for (let mbr of this.newChannel.memberList) {
        //   chnMbr.members.push(usrList.find((x: any) => x.username == mbr && x.username != this.user.username));
        // }
        // chnList.push(chn);
        // mbrList.push(chnMbr);
      }
    }
    if (modal == "addMember") {
      if (this.addToChannel.memberList) {
        let data = {
          channelID: this.select,
          groupID: this.groupID,
          memberList: this.addToChannel.memberList
        };

        // console.log(data);
        this.groupService.addMemberToChannel(data).subscribe(res => {
          if (res.success) {this.back();}
          this.addToChannel = {
            member: "",
            memberList: [],
            invalidMember: false,
            memberEmpty: false
          }
        });
        // let index = mbrList.findIndex((x: any) => {
        //   return x.group == this.group.id && x.channel == this.select;
        // });
        // for (let usr of this.addToChannel.memberList) {
        //   mbrList[index].members.push(usrList.find((x: any) => x.username == usr));
        // }
      }
      // close = false;
    }

    if (saveChange) {
      localStorage.setItem("Groups", JSON.stringify(grpList));
      localStorage.setItem("Channels", JSON.stringify(chnList));
      localStorage.setItem("Members", JSON.stringify(mbrList));
    } 

    // if (close) {this.closeModal();}
    // else {this.back();}
    
  }

  deleteItem(item: string) {
    // let grpList: any = localStorage.getItem("Groups");
    // grpList = JSON.parse(grpList);
    // let chnList: any = localStorage.getItem("Channels");
    // chnList = JSON.parse(chnList);
    // let mbrList: any = localStorage.getItem("Members");
    // mbrList = JSON.parse(mbrList);

    if (item == "Group") {
      this.groupService.deleteGroup(this.groupID).subscribe(res => {
        if (res.success) {this.closeModal();}
      });
      // mbrList = mbrList.filter((x: any) => x.group != this.group.id);
      // chnList = chnList.filter((x: any) => x.groupID != this.group.id);
      // grpList = grpList.filter((x: any) => x.id != this.group.id);
    }
    else if (item == "Channel") {
      this.groupService.deleteChannel(this.select).subscribe(res => {
        if (res.success) {
          this.userService.getUserChannels(this.user._id, this.groupID).subscribe(res => {
            this.fromParent.channels = res.list;
          });
        }
      });
      // mbrList = mbrList.filter((x: any) => x.channel != this.select || x.group != this.group.id);
      // chnList = chnList.filter((x: any) => x.id != this.select || x.groupID != this.group.id);
      // this.channels = chnList;
    }

    // localStorage.setItem("Groups", JSON.stringify(grpList));
    // localStorage.setItem("Channels", JSON.stringify(chnList));
    // localStorage.setItem("Members", JSON.stringify(mbrList));
    // this.activeModal.close();
  }

}
