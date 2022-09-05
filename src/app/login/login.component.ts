import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const SERVER = "http://localhost:3000";

const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json"})
};

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username: string = "";
  password: string = "";
  valid: boolean = true;

  constructor(private router: Router,
    private httpClient: HttpClient) { }

  ngOnInit(): void {}

  // Verify user
  login() {
    this.httpClient.post(SERVER + "/login", {username: this.username, pwd: this.password}, httpOptions)
     .subscribe((user: any) => {
      console.log(user);
      if (user.valid) { // If user valid
        localStorage.setItem("userDetails", JSON.stringify(user));
        this.router.navigateByUrl('/account/' + user.id);
      }
      else {
        this.valid = false;
      }
     });
  }

}
