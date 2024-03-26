import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpcallsService {

  constructor(private http: HttpClient) { }

  postNotifications(title, message, ids) {
    const apiUrl = 'https://fcm.googleapis.com/fcm/send';
    let body = {
      registration_ids: ids,
      notification: {
        title: title,
        body: message,
        mutable_content: true,
        sound: "Tri-tone"
      },
      "android": {
        "priority": "high"
      }
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'key=AAAAJHJnM5c:AAAAJVrwEUA:APA91bFHkFwgj4ARh6X2C6qUCpmXjoUO2IB1KcqDZ-_RtCA3hY_3tfJt6FwwyrsqDC-GZoDs4YybkyZx42xXzA77LDYubz-bpIx25UtB70YbG_M9PdrES53e4VE1-eNJJ0J3AmxOmZ2p', // Add any other headers as needed
    });
    const options = { headers: headers };

    this.http.post(apiUrl, JSON.stringify(body), options).subscribe(
      (data) => {
        debugger;
        console.log('Data received:', data);
        // Handle the data
      },
      (error) => {
        alert(error);
        console.error('Error occurred:', error);
        // Handle errors
      }
    );
  }

}
