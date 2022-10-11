import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// import { HttpClient, HttpHeaders } from '@angular/common/http';

import { UserDataService } from '../services/user-data.service';

// const SERVER = "http://localhost:3000";

// const httpOptions = {
//   headers: new HttpHeaders({ "Content-Type": "application/json"})
// };

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username: string = "";
  password: string = "";
  valid: boolean = true;
  error: boolean = false;

  constructor(private router: Router,
    private service: UserDataService) { }

  ngOnInit(): void {}

  // Verify user
  login() {
    if (this.username && this.password) {
      this.error = false;
      this.service.login({username: this.username, password: this.password}).subscribe((res) => {
        this.valid = res.success;
        if (this.valid) {
          sessionStorage.setItem("auth", res.userData._id);
          this.router.navigateByUrl('account/' + res.userData._id);
        }
      });  
    } else {this.error = true;}
    
  }

}
