import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private apiUrl = `${environment.apiUrl}/comments`;

  constructor(private http: HttpClient) {}

  getComments(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getCommentById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  addComment(comment: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, comment);
  }

  updateComment(id: string, updatedComment: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, updatedComment);
  }

  deleteCommentById(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
