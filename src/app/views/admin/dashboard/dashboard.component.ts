import { Component, OnInit } from "@angular/core";
import { FirebaseService } from "src/app/service/firebase.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
})
export class DashboardComponent implements OnInit {
  constructor(public abc: FirebaseService) { }

  ngOnInit() {

  }
}
