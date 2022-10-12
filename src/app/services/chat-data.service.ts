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
    console.log("run socker");
    this.socket = io(URL);
    return () => {this.socket.disconnect();}
  }

  // Request to join channel
  join(username: string, channelID: string) {
    this.socket.emit("join", {username: username, channelID: channelID});
  }

  // Request to leave channel
  leave() {this.socket.emit("leave", {});}

  // Request to switch channel
  switch(channelID: string) {this.socket.emit("switch", channelID);}

  // Send message
  send(chat: any) {this.socket.emit("message", chat);}

  // Receive join request's respone
  getJoin() {
    return new Observable<any>(observer => {
      this.socket.on("join", (data: any) => {
        observer.next(data); 
      });
    });
  }

  // Receive leave request's response
  getLeave() {
    return new Observable<any>(observer => {
      this.socket.on("leave", (data: any) => {
        observer.next(data);
      });
    });
  }

  // Receive switch request's response
  getSwitch() {
    return new Observable<any>(observer => {
      this.socket.on("switch", (data: any) => {
        observer.next(data);
      });
    });
  }

  // Get message
  getMessage() {
    return new Observable<any>(observer => {
      this.socket.on("message", (data: any) => {
        observer.next(data);
      });
    });
  }

}
