// Updated new-product.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService} from '../../product-service.service';
import { CategoryService } from '../../categories.service';
import { TagsService } from '../../tags.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.component.html',
  styleUrls: ['./new-product.component.css']
})
export class NewProductComponent implements OnInit {
  public productForm: FormGroup;
  public imageUrl: string = '';
  public categories: any[] = [];
  public tags: any[] = [];
  public loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private catService: CategoryService,
    private tagService: TagsService,
    private toastr: ToastrService
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      image: [''],
      description: ['', Validators.required],
      category: ['', Validators.required],
      discount: [0, [Validators.min(0)]],
      quantity: [1, [Validators.required, Validators.min(0)]],
      tag: [''],
      featured: [false]
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    this.loadTags();
  }

  private loadCategories(): void {
    this.catService.getCategories().subscribe(
      (data) => (this.categories = data),
      (error) => this.toastr.error('Error loading categories', 'Error')
    );
  }

  private loadTags(): void {
    this.tagService.getAllTags().subscribe(
      (data) => (this.tags = data),
      (error) => this.toastr.error('Error loading tags', 'Error')
    );
  }

  public onSubmit(): void {
    if (this.productForm.invalid) {
      this.toastr.error('Please complete the form correctly.', 'Form Error');
      return;
    }

    this.loading = true;
    const productData = {
      ...this.productForm.value,
      image: this.imageUrl,
      createdAt: new Date()
    };

    this.productService.addProduct(productData).subscribe(
      () => {
        this.toastr.success('Product added successfully!');
        this.productForm.reset();
        this.imageUrl = '';
        this.loading = false;
      },
      (err) => {
        console.error('Error adding product:', err);
        this.toastr.error('An error occurred while adding the product.', 'Error');
        this.loading = false;
      }
    );
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
      return `${price.toFixed(2)}$`;
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
}
