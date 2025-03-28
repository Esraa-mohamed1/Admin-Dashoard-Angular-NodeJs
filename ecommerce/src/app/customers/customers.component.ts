import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CostumersService } from '../costumers.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {
  public result: any[] = [];

  constructor(
    private router: Router,
    private costumersService: CostumersService
  ) {}

  ngOnInit(): void {
    this.fetchCustomers();
  }

  fetchCustomers() {
    this.costumersService.getCostumer().subscribe(
      (res: any) => {
        this.result = res.customers;
      },
      (err) => {
        console.error('Error fetching customers:', err);
      }
    );
  }

  public navigateTo(id: string) {
    this.router.navigate(['customers', id]);
  }

  public formatPrice(price: any): string {
    return typeof price === 'number' ? price.toFixed(2) + '$' : 'N/A';
  }

  public formatReadableDate(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    };
    return new Date(dateString).toLocaleString('en-US', options);
  }
}
