import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BillboardService {
  private apiUrl = `${environment.apiUrl}/admin/ads`;

  constructor(private http: HttpClient) {}

  getBillboards(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getBillboardById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  addBillboard(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  updateBillboardById(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  deleteBillboardById(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
