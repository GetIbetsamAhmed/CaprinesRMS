import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FirebaseService } from 'src/app/service/firebase.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  productform: FormGroup;
  buttonName = "Save";
  image = "https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-image-512.png";
  productSelectedKey = "";
  productList = [];
  categoryList = [];
  productTable = "product";
  constructor(public objFirebaseService: FirebaseService) { }

  ngOnInit(): void {
    this.productform = new FormGroup({
      name: new FormControl(""),
      categoryID: new FormControl(""),
      price: new FormControl(""),
      discountAmount: new FormControl(""),
      description: new FormControl(""),
    });
    this.getAllproduct();
    this.getAllcategory();
  }

  getAllproduct() {
    this.objFirebaseService.getAllDataFromTable(this.productTable).subscribe(data => {
      this.productList = [];
      if (data != null) {
        let SubArr = Object.keys(data);
        for (var loop = 0; loop < SubArr.length; loop++) {
          const object = Object.assign({ key: SubArr[loop] }, data[SubArr[loop]]);
          this.productList.push(object);
        }
      }
    })
  }

  getAllcategory() {
    this.objFirebaseService.getAllDataFromTable("category").subscribe(data => {
      this.categoryList = [];
      if (data != null) {
        let SubArr = Object.keys(data);
        for (var loop = 0; loop < SubArr.length; loop++) {
          const object = Object.assign({ key: SubArr[loop] }, data[SubArr[loop]]);
          this.categoryList.push(object);
        }
      }
    })
  }

  reset() {
    this.buttonName = "Save";
    this, this.productform.patchValue({
      name: "",
      categoryID: "",
      price: "",
      discountAmount: "",
      description: "",
    })
    this.productSelectedKey = "";
    this.image = "https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-image-512.png";
  }

  editProduct(param: any) {
    debugger;
    this.productSelectedKey = param.key;
    this.buttonName = "Upddate";
    this.productform.patchValue({
      name: param.productName,
      categoryID: param.productCategoryID,
      price: param.productPrice,
      discountAmount: param.productDiscountAmount,
      description: param.productDescription,
    })
    this.image = param.productImg;
  }
  actionproduct() {
    const value = this.productform.value;
    const obj = {
      productName: value.name,
      productImg: this.image,
      productCategoryID: value.categoryID,
      productPrice: value.price,
      productDiscountAmount: value.discountAmount,
      productDescription: value.description,
    };
    debugger;

    if (this.productSelectedKey === '') {
      this.objFirebaseService.addDataIntoTable(this.productTable, obj).then(data => {
        this.reset();
      })
    } else {
      this.objFirebaseService.updateDataIntoTable(this.productTable, this.productSelectedKey, obj).then(data => {
        this.reset();
      })
    }
  }

  onFileChanged(param) {
    this.objFirebaseService.onFileSelected(param);
    this.objFirebaseService.ImageUploadUrl$.subscribe(data => {
      this.image = data;
      this.objFirebaseService.ImageUploadUrl$.complete();
    })
  }


}
