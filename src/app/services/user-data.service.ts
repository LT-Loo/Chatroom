import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  constructor(private http: HttpClient) { }

  login(loginData: any) {return this.http.post<any>("http://localhost:3000/login", loginData);}

  getUserByID(id: string) {return this.http.post<any>("http://localhost:3000/getUserByID", {id});}
}
