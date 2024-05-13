import {Component, EventEmitter, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {CategoryService} from '../../../services/category.service';
import {SnackbarService} from '../../../services/snackbar.service';
import {ProductService} from '../../../services/product.service';
import {GlobalConstants} from '../../../shared/global-constants';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  onAddProduct = new EventEmitter();
  onEditProduct = new EventEmitter();
  productForm: any = FormGroup;
  dialogAction: any = 'Add';
  action: any = 'Add';
  responseMessage: any;
  categorys: any = [];
  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any,
              private formBuilder: FormBuilder,
              private categoryService: CategoryService,
              private productService: ProductService,
              public dialogRef: MatDialogRef<ProductComponent>,
              private snackbarService: SnackbarService) { }

  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      name: [null, Validators.required ],
      categoryId: [null, Validators.required],
      price: [null, Validators.required ],
      description: [null, Validators.required]
    });
    if (this.dialogData.action === 'Edit'){
      this.dialogAction = 'Edit';
      this.action = 'Update';
      this.productForm.patchValue(this.dialogData.data);
    }
    this.getCategory();
  }


  // tslint:disable-next-line:typedef
  private getCategory() {
    this.categoryService.getCategory().subscribe((response: any) => {
      this.categorys = response;
      // tslint:disable-next-line:no-shadowed-variable
    }, (error) => {
      console.log(error);
      if (error.error?.message){
        return this.responseMessage = error.error?.message;
      }else {
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
    });
  }

  // tslint:disable-next-line:typedef
  handleSubmit(){
    if (this.dialogAction === 'Edit'){
      this.edit();
    }
    else {
      this.add();
    }
  }

  // tslint:disable-next-line:typedef
  private edit() {
    const formData = this.productForm.value;
    const data = {
      id: this.dialogData.data.id,
      name: formData.name,
      categoryId: formData.categoryId,
      price: formData.price,
      description: formData.description
    };

    this.productService.update(data).subscribe((response: any) => {
      this.dialogRef.close();
      this.onEditProduct.emit();
      this.responseMessage = response.message;
      this.snackbarService.openSnackBar(this.responseMessage, 'success');
      // tslint:disable-next-line:no-shadowed-variable
    }, (error) => {
      this.dialogRef.close();
      console.error(error);
      if (error.error?.message){
        return this.responseMessage = error.error?.message;
      }else {
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
    });
  }

  // tslint:disable-next-line:typedef
  private add() {
    const formData = this.productForm.value;
    const data = {
      name: formData.name,
      categoryId: formData.categoryId,
      price: formData.price,
      description: formData.description
    };

    this.productService.add(data).subscribe((response: any) => {
      this.dialogRef.close();
      this.onAddProduct.emit();
      this.responseMessage = response.message;
      this.snackbarService.openSnackBar(this.responseMessage, 'success');
      // tslint:disable-next-line:no-shadowed-variable
    }, (error) => {
      this.dialogRef.close();
      console.error(error);
      if (error.error?.message){
        return this.responseMessage = error.error?.message;
      }else {
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
    });
  }
}
