import { Component, OnInit } from "@angular/core";
import { FirebaseService } from "src/app/service/firebase.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
})
export class DashboardComponent implements OnInit {
  constructor(public objFirebaseService: FirebaseService) { }
  seeMore = '';
  allOrderList = [];
  todayOrder = [];
  pendingOrder = [];
  completedOrder = [];
  rejectedOrder = [];

  ngOnInit(): void {
    this.getAllorder();
  }

  getAllorder() {
    this.objFirebaseService.getAllDataFromTable("salesOrder").subscribe(data => {
      this.allOrderList = [];
      if (data != null) {
        let SubArr = Object.keys(data);
        for (var loop = 0; loop < SubArr.length; loop++) {
          const object = Object.assign({ key: SubArr[loop] }, data[SubArr[loop]]);
          this.allOrderList.push(object);
        }
        this.calculateStats();
      }
    })
  }

  calculateStats() {
    this.todayOrder = [];
    this.pendingOrder = [];
    this.completedOrder = [];
    this.rejectedOrder = [];
    this.allOrderList.reverse();
    this.allOrderList.forEach(element => {
      if (this.todayOrder.length < 5) {
        this.todayOrder.push(element);
      }

      if (element.orderStatus === 'P') {
        if (this.pendingOrder.length < 5) {
          this.pendingOrder.push(element);
        }
      } else if (element.orderStatus === 'C') {
        if (this.completedOrder.length < 5) {
          this.completedOrder.push(element);
        }
      } else if (element.orderStatus === 'R') {
        if (this.rejectedOrder.length < 5) {
          this.rejectedOrder.push(element);
        }
      }
    });
  }
}
