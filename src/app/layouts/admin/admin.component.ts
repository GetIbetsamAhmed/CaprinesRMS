import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { FirebaseService } from "src/app/service/firebase.service";

@Component({
  selector: "app-admin",
  templateUrl: "./admin.component.html",
})
export class AdminComponent implements OnInit {

  fcmList = [];

  constructor(public objFirebaseService: FirebaseService, private router: Router) { }

  ngOnInit(): void {
    this.getFCM();
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
}
