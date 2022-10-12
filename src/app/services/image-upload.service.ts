import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ImageUploadService {

  constructor(private http: HttpClient) { }

  imgUpload(data: any) {return this.http.post<any>("http://localhost:3000/uploadImages", data);}

}
