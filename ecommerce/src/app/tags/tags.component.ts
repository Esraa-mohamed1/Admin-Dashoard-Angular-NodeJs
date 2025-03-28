import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TagsService } from '../tags.service';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.css']
})
export class TagsComponent implements OnInit {

  public myForm!: FormGroup;
  public editMode: boolean = false;
  public tags: any[] = [];
  private baseUrl = 'http://localhost:3000/api/v1/tags';
  private editTag: any;
  public loading: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private tagS: TagsService
  ) { }

  public formatReadableDate(dateString: any) {
    const options: any = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    const date = new Date(dateString);
    return date.toLocaleString('en-US', options);
  }

  ngOnInit(): void {
    this.myForm = this.formBuilder.group({
      code: ['', Validators.required], // رمز العلامة
      discount: ['', [Validators.required, Validators.min(1), Validators.max(100)]], // نسبة الخصم
      expiryDate: ['', Validators.required], // تاريخ انتهاء العلامة
    });

    this.getAllTags();
  }

  // جلب جميع العلامات
  getAllTags() {
    this.tagS.getAllTags().subscribe(
      (data: any[]) => {
        this.tags = data;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  // تعديل العلامة عبر ID
  public update(id: string) {
    this.editMode = true;
    this.tagS.getTagById(id).subscribe(
      (data: any) => {
        this.editTag = data;
        this.myForm.patchValue({
          code: this.editTag.code,
          discount: this.editTag.discount,
          expiryDate: this.editTag.expiryDate.split('T')[0], // لضبط التاريخ بشكل صحيح
        });
      },
      (error) => {
        console.error(error);
      }
    );
  }

  onSubmit() {
    if (this.myForm.valid) {
      if (this.editMode) {
        const updatedData = {
          code: this.myForm.value.code,
          discount: this.myForm.value.discount,
          expiryDate: new Date(this.myForm.value.expiryDate).toISOString(),
        };

        this.tagS.updateTagById(this.editTag._id, updatedData).subscribe(
          (data) => {
            console.log(data);
            this.editMode = false;
            this.getAllTags();
            this.myForm.reset();
          },
          (error) => {
            console.error(error);
          }
        );
      } else {
        this.loading = true;
        console.log(this.myForm.value);

        const newTag = {
          code: this.myForm.value.code,
          discount: this.myForm.value.discount,
          expiryDate: new Date(this.myForm.value.expiryDate).toISOString(),
        };

        this.tagS.createTag(newTag).subscribe(
          (data) => {
            console.log(data);
            this.loading = false;
            this.getAllTags();
            this.myForm.reset();
          },
          (error) => {
            console.error(error);
            this.loading = false;
          }
        );
      }
    }
  }

  // حذف العلامة عبر ID
  public delete(id: string) {
    this.tagS.deleteTagById(id).subscribe(
      (data) => {
        console.log(data);
        this.getAllTags();
      },
      (error) => {
        console.error(error);
      }
    );
  }
}
