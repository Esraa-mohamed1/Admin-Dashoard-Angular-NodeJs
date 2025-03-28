// Updated product-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService, Product } from '../../product-service.service';
import { CategoryService } from '../../categories.service';
import { TagsService } from '../../tags.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  public product: Product | null = null;
  public productForm: FormGroup;
  public imageUrl: string = '';
  public isopen: boolean = true;
  public loading: boolean = false;
  public categories: any[] = [];
  public tags: any[] = [];

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private catService: CategoryService,
    private tagService: TagsService
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      image: [''],
      description: ['', Validators.required],
      category: ['', Validators.required],
      stock: [1, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    this.loadTags();
    this.loadProduct();
  }

  private loadCategories(): void {
    this.catService.getCategories().subscribe(
      (data: any[]) => (this.categories = data),
      (error) => console.error('Error loading categories:', error)
    );
  }

  private loadTags(): void {
    this.tagService.getAllTags().subscribe(
      (data: any[]) => (this.tags = data),
      (error) => console.error('Error loading tags:', error)
    );
  }

  private loadProduct(): void {
    this.route.paramMap.subscribe((params) => {
      const productId = params.get('id');
      if (productId) {
        this.productService.getProductById(productId).subscribe(
          (response) => {
            // Directly use the response, no .data property needed
            this.product = response;
            this.populateForm();
          },
          (error) => console.error('Error loading product:', error)
        );
      }
    });
  }

  private populateForm(): void {
    if (!this.product) return;
    
    this.productForm.patchValue({
      name: this.product.name,
      price: this.product.price,
      image: this.product.image,
      description: this.product.description,
      category: this.product.category._id,
      stock: this.product.stock
    });
    this.imageUrl = this.product.image;
  }

  public openEditForm(): void {
    this.isopen = !this.isopen;
  }
  
  public deleteProduct(id: string): void {
    this.productService.deleteProductById(id).subscribe(
      () => {
        console.log('Product deleted successfully');
        this.router.navigate(['/products']);
      },
      (err) => console.error('Error deleting product:', err)
    );
  }
  
  public onSubmit(): void {
    if (this.productForm.valid && this.product) {
      this.loading = true;
      const updatedProduct = {
        ...this.productForm.value,
        image: this.imageUrl
      };

      this.productService.updateProductById(this.product._id, updatedProduct).subscribe(
        () => {
          this.loading = false;
          this.router.navigate(['/products']);
        },
        (err) => {
          console.error('Error updating product:', err);
          this.loading = false;
        }
      );
    }
  }

  public onImageChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => (this.imageUrl = reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  public openImage(): void {
    const inputElement = document.getElementById('image');
    inputElement?.click();
  }

  public formatPrice(price: any): string {
    if (typeof price === 'number') {
      return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return 'N/A';
  }

  public formatReadableDate(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleString('en-US', options);
  }
  
  public getCategoryName(): string {
    return this.product?.category?.name || 'Unknown Category';
  }

  // Get full image URL if necessary
  public getImageUrl(imagePath: string): string {
    if (!imagePath) return 'assets/placeholder-image.png';
    
    if (imagePath.startsWith('http')) {
      return imagePath;
    } else {
      // If it's a relative path, you might need to add your base URL
      // This depends on how your images are served
      return imagePath;
    }
  }
}
