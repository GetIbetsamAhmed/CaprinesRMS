import { Component, OnInit, ViewChild } from '@angular/core';
import { FirebaseService } from 'src/app/service/firebase.service';

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
  constructor(public objFirebaseService: FirebaseService) { }

  ngOnInit(): void {
    this.getAllproduct();
    this.getAllcategory();
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
    this.childModal.hide();
  }

  createOrder() {
    alert();
    const objParam = {
      orderDate: JSON.stringify(new Date()),
      orderProduct: this.orderCart,
      orderSummary: this.objSummary
    }
    this.objFirebaseService.addDataIntoTable("salesOrder", objParam).then(data => {
      this.reset();
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
}
