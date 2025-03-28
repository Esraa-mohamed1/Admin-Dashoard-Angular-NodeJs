// Updated products.component.ts
import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductService } from '../../product-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: {
    _id: string;
    name: string;
    description: string;
  };
  stock: number;
  image: string;
  createdAt: string;
  updatedAt: string;
}

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {
  displayedColumns: string[] = [
    '_id',
    'image',
    'name',
    'stock',
    'price',
    'category',
    'createdAt',
    'updatedAt',
    'actions'
  ];

  products: Product[] = [];
  currentRoutePath: string = '';
  dataSource = new MatTableDataSource<Product>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private router: Router,
    private productService: ProductService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.trackRoute();
    this.loadProducts();
  }

  // Track current route
  private trackRoute(): void {
    this.route.url.subscribe((urlSegments) => {
      this.currentRoutePath = urlSegments.map((segment) => segment.path).join('/');
    });
  }

  // Load all products
  private loadProducts(): void {
    this.productService.getProducts().subscribe(
      (res) => {
        this.products = Array.isArray(res) ? res : (res.data || []);
        this.dataSource.data = this.products;
        this.setupTable();
      },
      (err) => {
        console.error('Error fetching products:', err);
      }
    );
  }

  // Initialize paginator and sorting after data loads
  private setupTable(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    // Custom filter predicate to handle nested category object
    this.dataSource.filterPredicate = (data: Product, filter: string) => {
      const searchText = filter.toLowerCase();
      return data.name.toLowerCase().includes(searchText) || 
             data.description.toLowerCase().includes(searchText) ||
             data.category.name.toLowerCase().includes(searchText);
    };
  }

  // Navigate to product details page
  public navigateToProduct(productId: string): void {
    this.router.navigate(['/products', productId]);
  }

  public filterChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = value;
  }
  

  // Format date for display
  public formatReadableDate(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    };
    return new Date(dateString).toLocaleString('en-US', options);
  }

  // Compare dates for styling
  public compareDates(updatedDate: string, createdDate: string): string {
    return new Date(updatedDate).getTime() === new Date(createdDate).getTime() 
      ? 'text-black' 
      : 'font-medium text-green-600';
  }

  // Format price for display
  public formatPrice(price: any): string {
    if (typeof price === 'number') {
      // Convert to local currency format (e.g., 250,000.00)
      return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return 'N/A';
  }

  // Get full image URL if necessary
  public getImageUrl(imagePath: string): string {
    if (!imagePath) return 'assets/placeholder-image.png';
    
    if (imagePath.startsWith('http')) {
      return imagePath;
    } else {
      // Assuming the API URL is set in environment
      // You may need to adjust this based on your actual image storage setup
      return imagePath;
    }
  }
}
