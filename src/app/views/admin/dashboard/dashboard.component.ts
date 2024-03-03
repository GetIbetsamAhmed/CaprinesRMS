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
  seeAllSelectedOrders = [];
  ngOnInit(): void {
    this.getAllorder();
  }

  dateFormat(date: any) {
    debugger;
    return date.replace(/^"(.*)"$/, '$1');
  }

  goBack() {
    this.seeAllSelectedOrders = [];
    this.seeMore = '';
  }

  seeAll(param: string) {
    if (param === 'P') {
      this.seeMore = "All Pending Orders";
      this.seeAllSelectedOrders = this.allOrderList.filter(data => data.orderStatus === 'P');
    } else if (param === 'C') {
      this.seeMore = "All Completed Orders";
      this.seeAllSelectedOrders = this.allOrderList.filter(data => data.orderStatus === 'C');
    } else if (param === 'R') {
      this.seeMore = "All Cencled Orders";
      this.seeAllSelectedOrders = this.allOrderList.filter(data => data.orderStatus === 'R');
    }

  }

  updateStatus(param: string, key: string, index: any) {
    if (param === 'C') {
      //Completed
      this.objFirebaseService.updateDataIntoTable("salesOrder", key, {
        orderStatus: 'C'
      }).then(data => {
        this.seeAllSelectedOrders.splice(index, 1);
      })
    } else {
      //Rejected
      this.objFirebaseService.updateDataIntoTable("salesOrder", key, {
        orderStatus: 'R'
      }).then(data => {
        this.seeAllSelectedOrders.splice(index, 1);
      })
    }
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
