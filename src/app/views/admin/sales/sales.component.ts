import { Component, OnInit, ViewChild } from '@angular/core';
import { FirebaseService } from 'src/app/service/firebase.service';
import { HttpcallsService } from 'src/app/service/http-service/httpcalls.service';
declare var $: any; // Declare jQuery

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css']
})
export class SalesComponent implements OnInit {
  @ViewChild('childModal') public childModal: any;

  orderCart = [];
  objSummary = {
    productsQuanaity: 0,
    price: 0,
    discount: 0,
    tax: 0,
    billAmount: 0
  }
  allProductList = [];
  filterProductList = [];
  categoryList = [{
    catImg: "",
    catName: "All Category",
    key: "All"
  }];
  constructor(
    public objFirebaseService: FirebaseService,
    public apiServices: HttpcallsService
  ) { }

  ngOnInit(): void {
    this.getAllproduct();
    this.getAllcategory();
  }

  closeModel() {
    $('#exampleModal').modal('hide');
  }

  openPrintModel() {
    $('#printModal').modal('show');
  }

  getAllproduct() {
    this.objFirebaseService.getAllDataFromTable("product").subscribe(data => {
      this.allProductList = [];
      this.filterProductList = [];
      if (data != null) {
        let SubArr = Object.keys(data);
        for (var loop = 0; loop < SubArr.length; loop++) {
          const object = Object.assign({ key: SubArr[loop] }, data[SubArr[loop]]);
          this.allProductList.push(object);
          this.filterProductList.push(object);
        }
      }
    })
  }

  filterCategory(objCat) {
    if (objCat.key === 'All') {
      this.filterProductList = [...this.allProductList];
    } else {
      this.filterProductList = [...this.allProductList.filter(data => data.productCategoryID === objCat.key)];
    }

  }

  productClick(objProduct) {
    const index = this.orderCart.findIndex(data => data.key === objProduct.key);
    if (index === -1) {
      const object = Object.assign({ quantity: 1 }, objProduct);
      this.orderCart.push(object);
    } else {
      this.orderCart[index].quantity = this.orderCart[index].quantity + 1;
    }
  }

  calculateSummary() {
    this.objSummary = {
      productsQuanaity: 0,
      price: 0,
      discount: 0,
      tax: 0,
      billAmount: 0
    };

    this.objSummary.productsQuanaity = this.orderCart.length;
    this.orderCart.forEach(element => {
      this.objSummary.discount = this.objSummary.discount + (element.productDiscountAmount * element.quantity);
      this.objSummary.price = this.objSummary.price + (element.productPrice * element.quantity);
    });

    this.objSummary.tax = (this.objSummary.price / 100) * 17;
    this.objSummary.billAmount = ((this.objSummary.price - this.objSummary.discount) + this.objSummary.tax);
  }

  reset() {
    this.objSummary = {
      productsQuanaity: 0,
      price: 0,
      discount: 0,
      tax: 0,
      billAmount: 0
    };
    this.orderCart = [];
    this.closeModel();
  }

  createID() {
    let date = new Date().getTime().toString();
    date = date.substring(date.length - 6);
    return date
  }

  createOrder() {
    const objParam = {
      orderID: this.createID(),
      orderDate: JSON.stringify(new Date()),
      orderProduct: this.orderCart,
      orderSummary: this.objSummary,
      orderStatus: "P"
    }
    // this.objFirebaseService.addDataIntoTable("userLogin", {
    //   userID: this.createID(),
    //   userName: 'Ibtesam Ahmed',
    //   userPassword: "programmer",
    //   userRole: ['order', 'sales', 'category', 'product'],
    //   userNumber: "03339107704"
    // }).then(data => {
    //   this.reset();
    // })
    this.objFirebaseService.addDataIntoTable("salesOrder", objParam).then(data => {
      const tokenFCM = localStorage.getItem("FCMToken");
      this.apiServices.postNotifications("New Order Created", `Total Bill Amount is : ${this.objSummary.billAmount}`, tokenFCM);
      this.reset();
      // this.openPrintModel();
    })
  }


  delete(objCartItem) {
    const index = this.orderCart.findIndex(data => data.key === objCartItem.key);
    this.orderCart.splice(index, 1);
  }

  getAllcategory() {
    this.objFirebaseService.getAllDataFromTable("category").subscribe(data => {
      this.categoryList = [{
        catImg: "",
        catName: "All Category",
        key: "All"
      }];
      if (data != null) {
        let SubArr = Object.keys(data);
        for (var loop = 0; loop < SubArr.length; loop++) {
          const object = Object.assign({ key: SubArr[loop] }, data[SubArr[loop]]);
          this.categoryList.push(object);
        }
      }
    })
  }


  // Print Working in progress
  showPrint() {
    this.isPrintShow = true;
  }

  isPrintShow = false;
  currentDate: string = new Date().toLocaleDateString();
  tableNumber: number = 1;
  items: any[] = [
    { name: 'Pizza', price: 10.00 },
    { name: 'Salad', price: 5.00 },
    { name: 'Salad', price: 5.00 },
    { name: 'Salad', price: 5.00 }
  ];
  getTotal(): number {
    return this.items.reduce((total, item) => total + item.price, 0);
  }
  // Print Working in progress


}
