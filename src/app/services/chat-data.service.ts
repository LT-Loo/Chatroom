import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { io } from "socket.io-client";

import { ImageUploadService } from '../services/image-upload.service';

const URL = "http://localhost:3000";

@Injectable({
  providedIn: 'root'
})
export class ChatDataService {

  private socket: any; // Client socket

  constructor(private http: HttpClient,
    private imageService: ImageUploadService) { }

  // Setup connection to server socket
  initSocket() {
    this.socket = io(URL);
    return () => {this.socket.disconnect();}
  }

  // Request to join channel
  join(username: string, channelID: string) {
    this.socket.emit("join", {username: username, channelID: channelID});
  }

  // Request to leave channel
  leave() {this.socket.emit("leave");}

  // Request to switch channel
  switch(channelID: string) {this.socket.emit("switch", channelID);}

  // Send message
  send(chatData: any) {
    this.socket.emit("message");
    // call http to save message
  }

  // Respone for join request
  getJoin() {
    return new Observable<any>(observer => {
      this.socket.on("join", (data: any) => {
        observer.next(data); // get channel data and navigate to channel
      });
    });
  }

  // Respone for leave request
  getLeave() {
    return new Observable<any>(observer => {
      this.socket.on("leave", (data: any) => {
        observer.next(data); // Leave channel
      });
    });
  }

  // Respone for switch request
  getSwtich() {
    return new Observable<any>(observer => {
      this.socket.on("switch", (data: any) => {
        observer.next(data);
        // Get chat history from database and reload page to switch
      });
    });
  }

  // Get notice if someone joined/left channel
  getNotice() {
    return new Observable<any>(observer => {
      this.socket.on("notice", (data: any) => {
        observer.next(data);
        // Get chat data from database and push to message variable
      });
    });
  }

  // Get message
  getMessage() {
    return new Observable<any>(observer => {
      this.socket.on("message", (data: any) => {
        observer.next(data);
        // Get chat data from server and push to message variable
        // no need get from database again
      });
    });
  }

  // Listen for changes happen within channel
  getChange() {
    return new Observable<any>(observer => {
      this.socket.on("change", (data: string) => {
        observer.next(data);
        // Avoid reloading just get necessary data from database
      })
    });
  }

}
