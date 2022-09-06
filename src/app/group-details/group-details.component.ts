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
    // localStorage.setItem("group", JSON.stringify(this.fromParent.group));
    // localStorage.setItem("channels", JSON.stringify(this.fromParent.channels));
    let url = "channel/" + this.group.id + "/" + this.select;
    this.activeModal.close();
    this.router.navigateByUrl(url);
  }

  addToGroup() {
    // If group exist, show channel form, otherwise show error message
  }

  newGroupAddChannel() {
    if (!this.newGroup.channelList.includes(this.newGroup.channel)) {
      this.newGroup.channelList.push(this.newGroup.channel);
      this.newGroup.channel = "";
      this.newGroup.invalidChannel = false;
    }
    else {this.newGroup.invalidChannel = true;}
  }

  getUserList() {
    let userList: any = localStorage.getItem("Users");
    userList = JSON.parse(userList); 

    let rmList: any = this.members.filter((x: any) => x.channel == this.select && x.group == this.group.id);

    for (let chn of rmList) {
      for (let usr of chn.members) {
        userList = userList.filter((x: any) => x.username != usr.username);
      }
    }

    userList = userList.map((x: any) => x.username);

    console.log(userList);

    return userList;
  }

  newChannelAddMember() {
    let userList = this.getUserList();
    
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

  createItem() {
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

    if (this.modal == "newGroup") {
      if (grpList.includes(this.newGroup.name)) {
        this.newGroup.invalidGroup = true;
        this.newGroup.name = "";
        saveChange = false;
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
    if (this.modal == "newChannel") {
      console.log((chnList.map((x: any) => x.name)));
      if ((chnList.map((x: any) => x.name)).includes(this.newChannel.name)) {
        this.newChannel.invalidChannel = true;
        this.newChannel.name = "";
        saveChange = false;
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
        for (let mbr of this.newChannel.memberList) {
          chnMbr.members.push(usrList.find((x: any) => x.username == mbr));
        }
        chnList.push(chn);
        mbrList.push(chnMbr);
      }
    }
    if (this.modal == "addMember") {
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
