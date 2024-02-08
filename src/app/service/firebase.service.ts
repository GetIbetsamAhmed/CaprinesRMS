import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireStorage } from '@angular/fire/storage';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  ImageUploadUrl$ = new Subject<any>();

  databaseName = "caprinesRMS";
  constructor(
    private database: AngularFireDatabase,
    private storage: AngularFireStorage,
  ) { }

  getAllDataFromTable(tableName: string) {
    return this.database.object(`${this.databaseName}/${tableName}`).valueChanges();
  }

  getSingleDataFromFireabse(tableName: string, keyName: string) {
    return this.database.object(`${this.databaseName}/${tableName}/${keyName}`).valueChanges();
  }

  addDataIntoTable(tableName: string, data: any) {
    return this.database.list(`${this.databaseName}/${tableName}`).push(data);
  }

  updateDataIntoTable(tableName: string, keyName: string, data: any) {
    return this.database.list(`${this.databaseName}/${tableName}`).update(keyName, data);
  }

  deleteDataIntoTable(tableName: string, keyName: string) {
    return this.database.list(`${this.databaseName}/${tableName}`).remove(keyName);
  }

  createID() {
    let date = new Date().getTime().toString();
    date = date.substring(date.length - 6);
    return date
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    const filePath = 'images/' + file.name;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    // observe the percentage changes
    task.percentageChanges().subscribe(percentage => {
      console.log('Upload is ' + percentage + '% done');
    });

    // get notified when the download URL is available
    task.snapshotChanges().subscribe(snapshot => {
      fileRef.getDownloadURL().subscribe(url => {
        this.ImageUploadUrl$.next(url);
        // You can save the URL to your database or perform any other action with it
      });
    });
  }


}
