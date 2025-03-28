// Updated category.component.ts
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from '../categories.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  public myForm!: FormGroup;
  public editMode: boolean = false;
  public categories: any[] = [];
  private editCat: any;
  public loading: boolean = false;
  public imageUrl: string = '';
  private imageFile: File | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private catService: CategoryService,
    private router: Router
  ) {}

  onImageChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.imageFile = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imageUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  openImage() {
    const inputElement = document.getElementById('image');
    if (inputElement) {
      inputElement.click();
    }
  }

  ngOnInit(): void {
    this.myForm = this.formBuilder.group({
      header: ['', Validators.required],
      description: ['', Validators.required],
      image: ['']
    });
    this.getAllCategories();
  }

  getAllCategories() {
    this.catService.getCategories().subscribe(
      (data: any[]) => {
        this.categories = data;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  public update(id: string) {
    this.editMode = true;
    this.catService.getCategoryById(id).subscribe(
      (data: any) => {
        this.editCat = data;
        this.myForm.patchValue({
          header: this.editCat.name,
          description: this.editCat.description
        });

        this.imageUrl = this.editCat.image;
        this.imageFile = null;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  onSubmit() {
    if (this.myForm.valid) {
      const categoryData = {
        name: this.myForm.value.header,
        description: this.myForm.value.description,
        image: this.imageFile || this.imageUrl
      };

      if (this.editMode) {
        this.loading = true;
        this.catService.updateCategoryById(this.editCat._id, categoryData).subscribe(
          () => {
            this.loading = false;
            this.editMode = false;
            this.getAllCategories();
            this.resetForm();
          },
          (error) => {
            console.error(error);
            this.loading = false;
          }
        );
      } else {
        this.loading = true;
        this.catService.addCategory(categoryData).subscribe(
          () => {
            this.loading = false;
            this.getAllCategories();
            this.resetForm();
          },
          (error) => {
            console.error(error);
            this.loading = false;
          }
        );
      }
    }
  }

  private resetForm() {
    this.myForm.reset();
    this.imageUrl = '';
    this.imageFile = null;
  }

  public delete(id: string) {
    this.catService.deleteCategoryById(id).subscribe(
      () => {
        this.getAllCategories();
      },
      (error) => {
        console.error(error);
      }
    );
  }

  public navigateTo(id: string) {
    this.router.navigate(['customers', id]);
  }

  public formatPrice(price: any): string {
    if (typeof price === 'number') {
      return price.toFixed(2) + '$';
    }
    return 'N/A';
  }

  public formatReadableDate(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    };
    return new Date(dateString).toLocaleString('en-US', options);
  }
}
