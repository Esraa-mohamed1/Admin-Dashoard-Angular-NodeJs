// Updated header.component.ts
import { Component, OnInit } from '@angular/core';
import { ProductService, Product } from '../product-service.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  public errorMsg: any[] = [];
  public divTop = '-200px';
  public showLoginModal = false;
  public loginForm: FormGroup;
  public isLoggingIn = false;

  constructor(
    private productService: ProductService,
    private toastr: ToastrService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.loginForm = this.fb.group({
      name: ['nada', Validators.required],
      email: ['nada@example.com', [Validators.required, Validators.email]],
      password: ['admin123', Validators.required],
      role: ['admin']
    });
  }

  /** Toggle login modal visibility */
  public toggleLoginModal(): void {
    this.showLoginModal = !this.showLoginModal;
  }

  /** Submit login form */
  public login(): void {
    if (this.loginForm.valid) {
      this.isLoggingIn = true;
      this.authService.login(this.loginForm.value).subscribe(
        response => {
          this.isLoggingIn = false;
          this.toastr.success('Login successful!', 'Success');
          this.toggleLoginModal();
        },
        error => {
          this.isLoggingIn = false;
          this.toastr.error('Login failed. Please check your credentials.', 'Error');
          console.error('Login error:', error);
        }
      );
    } else {
      this.toastr.warning('Please fill in all required fields correctly.', 'Warning');
    }
  }

  /** Check if user is logged in */
  public isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  /** Logout the user */
  public logout(): void {
    this.authService.logout();
    this.toastr.info('You have been logged out.', 'Info');
  }

  /** Fetch products and check stock */
  private checkProductStock(): void {
    this.productService.getProducts().subscribe(
      (res) => {
        // Handle both array and object with data property
        const products = Array.isArray(res) ? res : (res.data || []);
        
        this.errorMsg = products
          .filter((product) => product.stock === 0)
          .map((product) => ({
            name: product.name,
            id: product._id,
            image: product.image,
            errorMessage: `Error: Stock for ${product.name} is 0. Please update the stock.`,
          }));

        if (this.errorMsg.length) {
          this.toastr.warning('Some products have zero stock!', 'Warning');
        }
      },
      (err) => {
        this.toastr.error('Error fetching products', 'Error');
        console.error('Error fetching products:', err);
      }
    );
  }

  ngOnInit(): void {
    this.checkProductStock();
  }

  /** Toggle dropdown visibility */
  public togglePosition(): void {
    this.divTop = this.divTop === '-200px' ? '60px' : '-200px';
  }

  /** Format date for display */
  public formatReadableDate(dateString: any): string {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Date(dateString).toLocaleString('en-US', options);
  }

  /** Format price for display */
  public formatPrice(price: any): string {
    if (typeof price === 'number') {
      return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return 'N/A';
  }
}
