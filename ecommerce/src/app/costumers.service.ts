import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class CostumersService {

  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) { }

  public getCostumer(): Observable<any> {
    return this.http.get(this.apiUrl);
    
  }
  
  public getCostumerByID(id:string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
    
  }

  public deleteCostumerById(id:string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
    
  }

}
