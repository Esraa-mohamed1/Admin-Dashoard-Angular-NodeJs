import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = `${environment.apiUrl}/admin/categories`;

  constructor(private http: HttpClient) {}

  getCategories(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getCategoryById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  addCategory(data: any): Observable<any> {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    
    if (data.image instanceof File) {
      formData.append('image', data.image);
    } else if (typeof data.image === 'string' && data.image.trim() !== '') {
      // Handle the case where image is a base64 string or URL
      // Convert base64 to file if needed
      if (data.image.startsWith('data:')) {
        const file = this.dataURLtoFile(data.image, 'image.jpg');
        formData.append('image', file);
      }
    }
    
    return this.http.post(this.apiUrl, formData);
  }

  updateCategoryById(id: string, data: any): Observable<any> {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    
    if (data.image instanceof File) {
      formData.append('image', data.image);
    } else if (typeof data.image === 'string' && data.image.trim() !== '') {
      // Handle the case where image is a base64 string or URL
      // Convert base64 to file if needed
      if (data.image.startsWith('data:')) {
        const file = this.dataURLtoFile(data.image, 'image.jpg');
        formData.append('image', file);
      }
    }
    
    return this.http.put(`${this.apiUrl}/${id}`, formData);
  }

  deleteCategoryById(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  
  // Helper method to convert base64 to file
  private dataURLtoFile(dataurl: string, filename: string): File {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }
}
