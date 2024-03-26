import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { FirebaseService } from "src/app/service/firebase.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
})
export class LoginComponent implements OnInit {
  constructor(public objFirebaseService: FirebaseService, private router: Router) { }

  loginform: FormGroup;
  allUserList = [];
  fcmList = [];


  ngOnInit(): void {
    this.loginform = new FormGroup({
      userID: new FormControl(""),
      password: new FormControl(""),
    });
    this.getAlluser();
  }

  getAlluser() {
    this.objFirebaseService.getAllDataFromTable("userLogin").subscribe(data => {
      this.allUserList = [];
      if (data != null) {
        let SubArr = Object.keys(data);
        for (var loop = 0; loop < SubArr.length; loop++) {
          const object = Object.assign({ key: SubArr[loop] }, data[SubArr[loop]]);
          this.allUserList.push(object);
        }
      }
    })
  }

  getFCM() {
    this.objFirebaseService.getAllDataFromTable("notificationFCM").subscribe(data => {
      this.fcmList = [];
      if (data != null) {
        let SubArr = Object.keys(data);
        for (var loop = 0; loop < SubArr.length; loop++) {
          const object = Object.assign({ key: SubArr[loop] }, data[SubArr[loop]]);
          this.fcmList.push(object);
        }
        localStorage.removeItem("FCMToken");
        localStorage.setItem("FCMToken", this.fcmList[0].token.toString());
      }
    })
  }

  login() {
    const value = this.loginform.value;
    const user = this.allUserList.find(data => data.userID === value.userID && data.userPassword === value.password);
    if (user === undefined) {
      alert('invalid username or password');
    } else {
      this.router.navigate(['/admin/sales']);
    }
  }
}
