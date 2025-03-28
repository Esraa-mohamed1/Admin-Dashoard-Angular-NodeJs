// Updated billboards.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BillboardService } from '../billboard.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-billboards',
  templateUrl: './billboards.component.html',
  styleUrls: ['./billboards.component.css']
})
export class BillboardsComponent implements OnInit {
  public myForm!: FormGroup;
  public editMode: boolean = false;
  public imageUrl: string = '';
  public billboards: any[] = [];
  public loading: boolean = false;
  private updateBillboardById: any;

  constructor(
    private formBuilder: FormBuilder,
    private billboardService: BillboardService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.getBillboards();
  }

  // Initialize form
  private initForm(): void {
    this.myForm = this.formBuilder.group({
      header: ['', Validators.required],
      description: ['', Validators.required],
      image: ['']
    });
  }

  // Fetch all billboards
  private getBillboards(): void {
    this.billboardService.getBillboards().subscribe(
      (res: any) => (this.billboards = res),
      (err: any) => this.toastr.error('Error loading billboards')
    );
  }

  // Image change handler
  public onImageChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => (this.imageUrl = reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  // Open image selector
  public openImage(): void {
    const inputElement = document.getElementById('image');
    inputElement?.click();
  }

  // Format price display
  public formatPrice(price: any): string {
    return typeof price === 'number' ? `${price.toFixed(2)}$` : 'N/A';
  }

  // Format date display
  public formatReadableDate(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    };
    return new Date(dateString).toLocaleString('en-US', options);
  }

  // Submit form (Create or Update)
  public onSubmit(): void {
    if (this.myForm.invalid) {
      this.toastr.error('Please complete the form');
      return;
    }

    const adData = {
      ...this.myForm.value,
      image: this.imageUrl
    };

    if (this.editMode) {
      this.updateAd(this.updateBillboardById._id, adData);
    } else {
      this.createAd(adData);
    }
  }

  // Create new ad
  private createAd(adData: any): void {
    this.loading = true;
    this.billboardService.addBillboard(adData).subscribe(
      () => {
        this.toastr.success('Ad created successfully');
        this.resetForm();
        this.getBillboards();
      },
      () => {
        this.toastr.error('Error creating ad');
        this.loading = false;
      }
    );
  }

  // Update existing ad
  private updateAd(id: string, updatedData: any): void {
    this.billboardService.updateBillboardById(id, updatedData).subscribe(
      () => {
        this.toastr.success('Ad updated successfully');
        this.resetForm();
        this.getBillboards();
      },
      () => this.toastr.error('Error updating ad')
    );
  }

  // Edit ad handler
  public update(id: string): void {
    this.editMode = true;
    this.billboardService.getBillboardById(id).subscribe(
      (res: any) => {
        this.updateBillboardById = res;
        this.myForm.patchValue({
          header: this.updateBillboardById.header,
          description: this.updateBillboardById.description
        });
        this.imageUrl = this.updateBillboardById.image;
      },
      () => this.toastr.error('Error loading ad details')
    );
  }

  // Delete ad handler
  public delete(id: string): void {
    this.billboardService.deleteBillboardById(id).subscribe(
      () => {
        this.toastr.success('Ad deleted successfully');
        this.getBillboards();
      },
      () => this.toastr.error('Error deleting ad')
    );
  }

  // Reset form after submission
  private resetForm(): void {
    this.myForm.reset();
    this.imageUrl = '';
    this.loading = false;
    this.editMode = false;
  }
}
