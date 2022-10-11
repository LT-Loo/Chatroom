import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GroupChannelDataService {

  constructor(private http: HttpClient) { }

  newGroup(data: any) {return this.http.post<any>("http://localhost:3000/newGroup", data);}

  newChannel(data: any) {return this.http.post<any>("http://localhost:3000/newChannel", data);}

  getGroup(id: string) {return this.http.post<any>("http://localhost:3000/getItem", {collection: "group", _id: id});}

  getChannel(id: string) {return this.http.post<any>("http://localhost:3000/getItem", {collection: "channel", _id: id});}

  getChannelMembers(id: string) {return this.http.post<any>("http://localhost:3000/getList", {collection: "member", data: {channelID: id}});}

  getGroupMembers(id: string) {return this.http.post<any>("http://localhost:3000/getList", {collection: "member", data: {groupID: id}});}

  getSuper() {return this.http.post<any>("http://localhost:3000/getList", {collection: "user", data: {superOrAdmin: 'super'}});}

  getAdmin(id: string) {return this.http.post<any>("http://localhost:3000/getList", {collection: "member", data: {groupID: id, role: "admin"}});}

  getAssis(id: string) {return this.http.post<any>("http://localhost:3000/getList", {collection: "member", data: {groupID: id, role: "assis"}});}

  addMemberToChannel(data: any) {return this.http.post<any>("http://localhost:3000/addMember", data);}

  deleteGroup(id: string) {return this.http.post<any>("http://localhost:3000/deleteGroup", {id: id});}

  deleteChannel(id: string) {return this.http.post<any>("http://localhost:3000/deleteChannel", {id: id});}

  deleteFromGroup(userID: string, groupID: string) {return this.http.post<any>("http://localhost:3000/deleteMany", {collection: "member", data: {userID: userID, groupID: groupID}});}

  deleteFromChannel(userID: string, channelID: string) {return this.http.post<any>("http://localhost:3000/deleteMany", {collection: "member", data: {userID: userID, channelID: channelID}});}

  deleteMembers(type: string, id: string) {
    let data: any = {};
    if (type == "group") {data = {groupID: id};}
    else if (type == "channel") {data = {channelID: id};}

    return this.http.post<any>("http://localhost:3000/deleteMany", {collection: "member", data: data});
  }





}
