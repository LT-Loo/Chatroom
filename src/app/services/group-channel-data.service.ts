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

  getChannelData(id: string) {return this.http.post<any>("http://localhost:3000/getChannelData", {id: id});}

  getGroupMembers(id: string) {return this.http.post<any>("http://localhost:3000/getList", {collection: "member", data: {groupID: id}});}

  addMemberToChannel(data: any) {return this.http.post<any>("http://localhost:3000/addMember", data);}

  deleteGroup(id: string) {return this.http.post<any>("http://localhost:3000/deleteGroup", {id: id});}

  deleteChannel(id: string) {return this.http.post<any>("http://localhost:3000/deleteChannel", {id: id});}

  deleteFromGroup(userID: string, groupID: string) {return this.http.post<any>("http://localhost:3000/deleteMany", {collection: "member", data: {userID: userID, groupID: groupID}});}

  deleteFromChannel(userID: string, channelID: string) {return this.http.post<any>("http://localhost:3000/deleteMany", {collection: "member", data: {userID: userID, channelID: channelID}});}

}
