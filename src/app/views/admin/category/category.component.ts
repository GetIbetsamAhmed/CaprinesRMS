import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/service/firebase.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  categoryform: FormGroup;
  buttonName = "Save";
  image = "https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-image-512.png";
  categorySelectedKey = "";
  categoryList = [];
  categoryTable = "category";
  constructor(public objFirebaseService: FirebaseService) { }

  ngOnInit(): void {
    this.categoryform = new FormGroup({
      name: new FormControl(""),
    });
    this.getAllCategory();
  }

  getAllCategory() {
    this.objFirebaseService.getAllDataFromTable(this.categoryTable).subscribe(data => {
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
    this, this.categoryform.patchValue({
      name: ""
    })
    this.image = "https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-image-512.png";
  }

  editCategory(param: any) {
    this.categorySelectedKey = param.key;
    this.buttonName = "Upddate";
    this, this.categoryform.patchValue({
      name: param.catName
    })
    this.image = param.catImg;
  }

  actionCategory() {
    const obj = {
      catImg: this.image,
      catName: this.categoryform.value.name
    }
    if (this.categorySelectedKey === '') {
      this.objFirebaseService.addDataIntoTable(this.categoryTable, obj).then(data => {
        this.reset();
      })
    } else {
      this.objFirebaseService.updateDataIntoTable(this.categoryTable, this.categorySelectedKey, obj).then(data => {
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
