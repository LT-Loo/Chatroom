import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { v4 as uuid4 } from 'uuid';

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
  select: number = 0;
  selectName: any = {};

  user: any = {};
  group: any = {};
  channels: any[] = [];
  members: any[] = [];

  newGroup: any = {
    name: "",
    channel: "",
    channelList: [],
    invalidChannel: false,
    invalidGroup: false
  };

  newChannel: any = {
    name: "",
    member: "",
    memberList: [],
    invalidChannel: false,
    invalidMember: false
  }

  addToChannel: any = {
    member: "",
    memberList: [],
    invalidMember: false
  }

  newUser: any = {
    username: "",
    email: "",
    role: "User",
    validUser: true,
    empty: false
  }

  chgRole: any = {
    username: "",
    role: "User",
    validUser: true
  }

  constructor(public activeModal: NgbActiveModal,
    private router: Router) { }

  ngOnInit(): void {
    this.modal = this.fromParent.modal;
    this.user = this.fromParent.user;
    this.group = this.fromParent.group;
    this.channels = this.fromParent.channels;
    this.members = this.fromParent.members;
    console.log("prnt:", this.fromParent);
  }

  closeModal(sendData: any) {
    this.activeModal.close(sendData);
  }

  createChannel() {this.modal = "newChannel";}

  createGroup() {this.modal = "newGroup";}

  addMember() {this.modal = "addMember";}

  back() {
    if(this.modal == "newChannel" || this.modal == "addMember") {this.modal = "details";}
    else {this.activeModal.close();}
  }

  selectChannel(channel: number) {
    this.select = channel;
    this.selectName = this.channels.find((x: any) => x.id == this.select && x.groupID == this.group.id);
  }

  joinChannel() {
    if (this.select < 1) {this.select = this.channels[0].id;}
    let url = "channel/" + this.group.id + "/" + this.select;
    this.activeModal.close();
    this.router.navigateByUrl(url);
  }

  createUser() {
    let usrList: any = localStorage.getItem("Users");
    usrList = JSON.parse(usrList);

    if (this.newUser.username == "" || this.newUser.email == "") {
      this.newUser.empty = true;
      this.newUser.validUser = true;
      return;
    }

    if (usrList.map((x: any) => x.username).includes(this.newUser.username)) {
      this.newUser.validUser = false;
      this.newUser.username = "";
    } else {
      let user = {
        id: uuid4(),
        username: this.newUser.username,
        email: this.newUser.email,
        role: this.newUser.role,
        lastActive: new Date().toUTCString()
      }
      console.log(user);
      usrList.push(user);
      localStorage.setItem("Users", JSON.stringify(usrList));
      
      this.newUser.username = "";
      this.newUser.email = "";
      this.newUser.role = "";  
      this.newUser.validUser = true;
    }
    this.newUser.empty = false; 
  }

  chgUserRole() {
    let usrList: any = localStorage.getItem("Users");
    usrList = JSON.parse(usrList);

    if (!usrList.map((x: any) => x.username).includes(this.chgRole.username) || this.user.username == this.chgRole.username) {
      this.chgRole.validUser = false;
      this.chgRole.username = "";
      return
    } else {
      this.chgRole.validUser = true;
      if (this.chgRole.username) {
        let index = usrList.findIndex((x: any) => {
          return x.username == this.chgRole.username;
        });
        usrList[index].role = this.chgRole.role;
        localStorage.setItem("Users", JSON.stringify(usrList));

        this.chgRole.username = "";
        this.activeModal.close();
      }
    }
  }

  newGroupAddChannel() {
    if (!this.newGroup.channelList.includes(this.newGroup.channel)) {
      this.newGroup.channelList.push(this.newGroup.channel);
      this.newGroup.channel = "";
      this.newGroup.invalidChannel = false;
    }
    else {this.newGroup.invalidChannel = true;}
  }

  getUserList(type: string = "") {
    let userList: any = [];
    let list: any = [];
    if (this.user.role == "Group Assis") {
      if (type == "newChannel") {
        list = this.members.filter((x: any) => x.group == this.group.id);
      } else {
        list = this.members.filter((x: any) => x.group == this.group.id && x.channel != this.select);
      }
      for (let ls of list) {
        for (let mbr of ls.members) {
          if (!userList.find((x: any) => mbr.username == x.username)) {userList.push(mbr)};
        }
      }
    } else {
      userList = localStorage.getItem("Users");
      userList = JSON.parse(userList); 
      if (type != "newChannel") {
        let rmList = this.members.filter((x: any) => x.group == this.group.id && x.channel == this.select);
        for (let rm of rmList) {
          for (let mbr of rm.members) {
            userList = userList.filter((x: any) => x.username != mbr.username);
          }
        }
      }
    }

    userList = userList.map((x: any) => x.username);

    console.log("userList", userList);

    return userList;
  }

  newChannelAddMember() {
    let userList = this.getUserList("newChannel");
    
    if (!this.newChannel.memberList.includes(this.newChannel.member)
        && userList.includes(this.newChannel.member)) {
      this.newChannel.memberList.push(this.newChannel.member);
      this.newChannel.member = "";
      this.newChannel.invalidMember = false;
    }
    else {this.newChannel.invalidMember = true;}
  }

  addMemberToChannel() {
    let userList = this.getUserList();
    if (!this.addToChannel.memberList.includes(this.addToChannel.member)
        && userList.includes(this.addToChannel.member)) {
      this.addToChannel.memberList.push(this.addToChannel.member);
      this.addToChannel.member = "";
      this.addToChannel.invalidMember = false;
    }
    else {this.addToChannel.invalidMember = true;}
    console.log(this.addToChannel.memberList);
  }

  createItem(modal: string = "") {
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
      if (grpList.map((x: any) => x.name).includes(this.newGroup.name)) {
        this.newGroup.invalidGroup = true;
        this.newGroup.name = "";
        return;
      } else {
        saveChange = true;
        this.newGroup.invalidGroup = true;
          let grp = {
          id: uuid4(),
          name: this.newGroup.name,
          dateTime: new Date().toUTCString()
        }
        grpList.push(grp);

        for (let c of this.newGroup.channelList) {
          let chn: any = {
            id: uuid4(),
            groupID: grp.id,
            name: c,
            date: new Date().toUTCString()
          }
          let mbr: any = {
            channel: chn.id,
            group: grp.id,
            members: [this.user]
          }
          chnList.push(chn);
          mbrList.push(mbr);
        }
      }
    }
    if (modal == "newChannel") {
      console.log((chnList.map((x: any) => x.name)));
      if ((chnList.map((x: any) => x.name)).includes(this.newChannel.name)) {
        this.newChannel.invalidChannel = true;
        this.newChannel.name = "";
        return;
      } else {
        this.newChannel.invalidChannel = false;
        saveChange = true;
        let chn: any = {
          id: uuid4(),
          groupID: this.group.id,
          name: this.newChannel.name,
          date: new Date().toUTCString()
        }
        let chnMbr: any = {
          channel: chn.id,
          group: this.group.id,
          members: []
        }
        chnMbr.members.push(usrList.find((x: any) => x.username == this.user.username || x.role == "Super Admin"));
        for (let mbr of this.newChannel.memberList) {
          chnMbr.members.push(usrList.find((x: any) => x.username == mbr && x.username != this.user.username));
        }
        chnList.push(chn);
        mbrList.push(chnMbr);
      }
    }
    if (modal == "addMember") {
      if (this.addToChannel.memberList) {
        let index = mbrList.findIndex((x: any) => {
          return x.group == this.group.id && x.channel == this.select;
        });
        for (let usr of this.addToChannel.memberList) {
          mbrList[index].members.push(usrList.find((x: any) => x.username == usr));
        }
      }
      close = false;
    }

    if (saveChange) {
      localStorage.setItem("Groups", JSON.stringify(grpList));
      localStorage.setItem("Channels", JSON.stringify(chnList));
      localStorage.setItem("Members", JSON.stringify(mbrList));
    } 

    if (close) {this.activeModal.close()}
    else {this.back();}
    
  }

  deleteItem(item: string) {
    let grpList: any = localStorage.getItem("Groups");
    grpList = JSON.parse(grpList);
    let chnList: any = localStorage.getItem("Channels");
    chnList = JSON.parse(chnList);
    let mbrList: any = localStorage.getItem("Members");
    mbrList = JSON.parse(mbrList);

    if (item == "Group") {
      mbrList = mbrList.filter((x: any) => x.group != this.group.id);
      chnList = chnList.filter((x: any) => x.groupID != this.group.id);
      grpList = grpList.filter((x: any) => x.id != this.group.id);
    }
    else if (item == "Channel") {
      mbrList = mbrList.filter((x: any) => x.channel != this.select || x.group != this.group.id);
      chnList = chnList.filter((x: any) => x.id != this.select || x.groupID != this.group.id);
      this.channels = chnList;
    }

    localStorage.setItem("Groups", JSON.stringify(grpList));
    localStorage.setItem("Channels", JSON.stringify(chnList));
    localStorage.setItem("Members", JSON.stringify(mbrList));
    this.activeModal.close();
  }

}
