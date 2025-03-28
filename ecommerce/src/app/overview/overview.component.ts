// Updated overview.component.ts
import { Component, OnInit } from '@angular/core';
import { ProductService, Product } from '../product-service.service';
import { OrderService } from '../orders.service';
import { CostumersService } from '../costumers.service';
import { CategoryService } from '../categories.service';
import { TagsService } from '../tags.service';
import { CommentService } from '../comments.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css'],
})
export class OverviewComponent implements OnInit {
  public products: Product[] = [];
  public orders: any = [];
  public customers: any[] = [];
  public totalAmount: number = 0;
  public nbOrders: number = 0;
  public categories: any[] = [];
  public tags: any[] = [];
  public comments: any[] = [];
  public errorMsg: any[] = [];

  constructor(
    private productService: ProductService,
    private orderService: OrderService,
    private customerService: CostumersService,
    private categoryService: CategoryService,
    private tagService: TagsService,
    private commentService: CommentService,
    private router: Router,
    private http: HttpClient,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.fetchProducts();
    this.fetchCustomers();
    this.fetchOrders();
    this.fetchCategories();
    this.fetchTags();
    this.fetchComments();
  }

  /** Fetch Methods **/
  private fetchProducts(): void {
    this.productService.getProducts().subscribe(
      (res) => {
        // Handle both array and object with data property
        this.products = Array.isArray(res) ? res : (res.data || []);
      },
      (err) => this.toastr.error('Error fetching products')
    );
  }

  private fetchCustomers(): void {
    this.customerService.getCostumer().subscribe(
      (res: any) => (this.customers = res.customers),
      (err) => this.toastr.error('Error fetching customers')
    );
  }

  private fetchOrders(): void {
    this.orderService.getOrders().subscribe(
      (res) => {
        this.orders = res.orders;
        this.totalAmount = this.calculateTotalAmount(this.orders);
        this.nbOrders = this.orders.length;
      },
      (err) => this.toastr.error('Error fetching orders')
    );
  }

  private fetchCategories(): void {
    this.categoryService.getCategories().subscribe(
      (res) => (this.categories = res),
      (err) => this.toastr.error('Error fetching categories')
    );
  }

  private fetchTags(): void {
    this.tagService.getAllTags().subscribe(
      (res) => (this.tags = res),
      (err) => this.toastr.error('Error fetching tags')
    );
  }

  private fetchComments(): void {
    this.commentService.getComments().subscribe(
      (res) => (this.comments = res),
      (err) => this.toastr.error('Error fetching comments')
    );
  }

  /** Delete Methods **/
  public deleteProductById(id: string): void {
    this.productService.deleteProductById(id).subscribe(
      () => {
        this.toastr.success('Product deleted successfully');
        this.fetchProducts();
      },
      (err) => this.toastr.error('Error deleting product')
    );
  }

  public deleteCommentById(id: string): void {
    this.commentService.deleteCommentById(id).subscribe(
      () => {
        this.toastr.success('Comment deleted successfully');
        this.fetchComments();
      },
      (err) => this.toastr.error('Error deleting comment')
    );
  }

  public deleteOrderById(id: string): void {
    this.orderService.deleteOrderById(id).subscribe(
      (res) => {
        this.toastr.success('Order deleted successfully');
        this.updateProductQuantities(res, false);
        this.fetchOrders();
      },
      (err) => this.toastr.error('Error deleting order')
    );
  }

  public deleteCustomerById(id: string): void {
    this.customerService.deleteCostumerById(id).subscribe(
      () => {
        this.toastr.success('Customer deleted successfully');
        this.fetchCustomers();
      },
      (err) => this.toastr.error('Error deleting customer')
    );
  }

  public deleteCategoryById(id: string): void {
    this.categoryService.deleteCategoryById(id).subscribe(
      () => {
        this.toastr.success('Category deleted successfully');
        this.fetchCategories();
      },
      (err) => this.toastr.error('Error deleting category')
    );
  }

  public deleteTagById(id: string): void {
    this.tagService.deleteTagById(id).subscribe(
      () => {
        this.toastr.success('Tag deleted successfully');
        this.fetchTags();
      },
      (err) => this.toastr.error('Error deleting tag')
    );
  }

  /** Utility Methods **/
  private updateProductQuantities(result: any, status?: boolean): void {
    for (const updatedProduct of result.order.products) {
      const productId = updatedProduct.product._id;
      const allQuantity = parseInt(updatedProduct.product.stock || updatedProduct.product.quantity, 10);
      const subQuantity = parseInt(updatedProduct.quantity, 10);
      const newQuantity = status ? allQuantity - subQuantity : allQuantity + subQuantity;

      this.http
        .put(`${environment.apiUrl}/admin/products/${productId}`, { stock: newQuantity })
        .subscribe(
          () => this.toastr.success('Product quantity updated'),
          (err) => this.toastr.error('Error updating product quantity')
        );
    }
  }

  public toggleOrderStatusById(id: string): void {
    const orderToUpdate = this.orders.find((order: any) => order._id === id);
    if (orderToUpdate) {
      const newStatus = !orderToUpdate.status;
      this.orderService.updateOrderStatus(id, status).subscribe(
        () => {
          this.toastr.success('Order status updated');
          orderToUpdate.status = newStatus;
          this.fetchOrders();
        },
        (err) => this.toastr.error('Error updating order status')
      );
    }
  }

  public calculateTotalAmount(orders: any[]): number {
    return orders
      .filter((order) => order.status === true)
      .reduce((total, order) => total + order.totalAmount, 0);
  }

  /** Navigation **/
  public navigateToProduct(productId: string): void {
    this.router.navigate(['/products', productId]);
  }

  /** Format Methods **/
  public formatReadableDate(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Date(dateString).toLocaleString('en-US', options);
  }
}
