import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

interface ProductCategory {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  stock: number;
  image: string;
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/admin/products`;

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[] | {data: Product[]}> {
    return this.http.get<Product[] | {data: Product[]}>(this.apiUrl);
  }

  getProductById(productId: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${productId}`);
  }

  addProduct(productData: any): Observable<Product> {
    const formData = new FormData();
    formData.append('name', productData.name);
    formData.append('description', productData.description);
    formData.append('price', productData.price);
    formData.append('category', productData.category);
    if (productData.stock) {
      formData.append('stock', productData.stock);
    }
    if (productData.image) {
      formData.append('image', productData.image);
    }
  
    const headers = { 'Accept': 'application/json' };
  
    return this.http.post<Product>(this.apiUrl, formData, { headers });
  }
  
  updateProductById(productId: string, productData: any): Observable<Product> {
    if (productData instanceof FormData) {
      return this.http.put<Product>(`${this.apiUrl}/${productId}`, productData);
    }
    
    const updatedData = { ...productData };
    if (updatedData.quantity !== undefined && updatedData.stock === undefined) {
      updatedData.stock = updatedData.quantity;
      delete updatedData.quantity;
    }
    
    return this.http.put<Product>(`${this.apiUrl}/${productId}`, updatedData);
  }

  deleteProductById(productId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${productId}`);
  }
}
