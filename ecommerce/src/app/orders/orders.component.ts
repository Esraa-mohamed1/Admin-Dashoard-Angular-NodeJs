// Updated orders.component.ts
import { Component, OnInit } from '@angular/core';
import { OrderService } from '../orders.service';
import { ProductService} from '../product-service.service';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

interface OrderProduct {
  product: any;
  quantity: number;
  _id: string;
}

interface Order {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  products: OrderProduct[];
  totalPrice: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  statusOrder: boolean = false;
  selectedOrder: Order | null = null;

  constructor(
    private http: HttpClient,
    private orderS: OrderService,
    private productS: ProductService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.fetchOrders();
  }

  private fetchOrders(): void {
    this.orderS.getOrders().subscribe(
      (res) => {
        this.orders = res;
        this.statusOrder = true;
      },
      (error) => {
        console.error('Error fetching orders:', error);
        this.toastr.error('Failed to load orders', 'Error');
      }
    );
  }

  showProductDetails(order: Order): void {
    this.selectedOrder = order;
  }

  closeProductModal(): void {
    this.selectedOrder = null;
  }

  public formatReadableDate(dateString: any): string {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    };
    return new Date(dateString).toLocaleString('en-US', options);
  }

  public toggleOrderStatus(id: string): void {
    const orderToUpdate = this.orders.find(order => order._id === id);
    if (orderToUpdate) {
      // Toggle between 'pending' and 'completed'
      const newStatus = orderToUpdate.status === 'pending' ? 'completed' : 'pending';
      this.orderS.updateOrderStatus(id, newStatus).subscribe(
        () => {
          orderToUpdate.status = newStatus;
          this.toastr.success(`Order status updated to ${newStatus}`, 'Success');
        },
        (err) => {
          console.error('Error updating order status:', err);
          this.toastr.error('Failed to update order status', 'Error');
        }
      );
    }
  }

  public deleteOrderById(id: string): void {
    this.orderS.deleteOrderById(id).subscribe(
      () => {
        this.orders = this.orders.filter(order => order._id !== id);
        this.toastr.success('Order deleted successfully', 'Success');
      },
      (err) => {
        console.error('Error deleting order by ID:', err);
        this.toastr.error('Failed to delete order', 'Error');
      }
    );
  }
}
