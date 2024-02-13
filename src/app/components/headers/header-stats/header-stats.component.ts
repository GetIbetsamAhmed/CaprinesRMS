import { Component, OnInit } from "@angular/core";
import { FirebaseService } from "src/app/service/firebase.service";

@Component({
  selector: "app-header-stats",
  templateUrl: "./header-stats.component.html",
})
export class HeaderStatsComponent implements OnInit {

  allOrderList = [];
  todayOrder = 0;
  pendingOrder = 0;
  completedOrder = 0;
  rejectedOrder = 0;
  constructor(public objFirebaseService: FirebaseService) { }

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
    this.todayOrder = 0;
    this.pendingOrder = 0;
    this.completedOrder = 0;
    this.rejectedOrder = 0;
    this.allOrderList.forEach(element => {
      this.todayOrder++;
      if (element.orderStatus === 'P') {
        this.pendingOrder++;
      } else if (element.orderStatus === 'C') {
        this.completedOrder++;
      } else if (element.orderStatus === 'R') {
        this.rejectedOrder++;
      }
    });
  }
}
