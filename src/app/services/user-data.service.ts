import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  constructor(private http: HttpClient) { }

  login(loginData: any) {return this.http.post<any>("http://localhost:3000/login", loginData);}

  getUserByID(id: string) {return this.http.post<any>("http://localhost:3000/getUserByID", {id});}

  getUserGroups(id: string) {return this.http.post<any>("http://localhost:3000/getList", {collection: "member", data: {userID: id}});}

  getUserChannels(userID: any, groupID: string) {return this.http.post<any>("http://localhost:3000/getList", {collection: "member", data: {userID: userID, groupID: groupID}});}

  register(registerData: any) {return this.http.post<any>("http://localhost:3000/register", registerData);}

  getAllUsers() {return this.http.post<any>("http://localhost:3000/getAll", {collection: "user"});}

  upgradeUser(data: any) {return this.http.post<any>("http://localhost:3000/upgradeUser", data);}
}
