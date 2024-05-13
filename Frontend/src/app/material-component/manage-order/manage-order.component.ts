import { Component, OnInit } from '@angular/core';
import {CategoryService} from '../../services/category.service';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {SnackbarService} from '../../services/snackbar.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ProductService} from '../../services/product.service';
import {GlobalConstants} from '../../shared/global-constants';
import {BillService} from '../../services/bill.service';
import {saveAs} from 'file-saver';

@Component({
  selector: 'app-manage-order',
  templateUrl: './manage-order.component.html',
  styleUrls: ['./manage-order.component.scss']
})
export class ManageOrderComponent implements OnInit {

  displayedColumns: string[] = ['name', 'category', 'price', 'quantity', 'total', 'edit'];
  dataSource: any = [];
  manageOrderForm: any = FormGroup;
  responseMessage: any;
  categorys: any = [];
  products: any = [];
  price: any;
  totalAmount = 0;
  constructor(
    private formBuilder: FormBuilder,
    private categoryService: CategoryService,
    private productService: ProductService,
    private billService: BillService,
    private ngxService: NgxUiLoaderService,
    private snackbarService: SnackbarService
  ) { }

  ngOnInit(): void {
    this.ngxService.start();
    this.getCategorys();
    this.manageOrderForm = this.formBuilder.group({
      name: [null, [Validators.required, Validators.pattern(GlobalConstants.nameRegex)]],
      email: [null, [Validators.required, Validators.pattern(GlobalConstants.emailRegex)]],
      contactNumber: [null, [Validators.required, Validators.pattern(GlobalConstants.contactNumberRegex)]],
      paymentMethod: [null, [Validators.required]],
      product: [null, [Validators.required]],
      category: [null, [Validators.required]],
      quantity: [null, [Validators.required]],
      price: [null, [Validators.required]],
      total: [0, [Validators.required]],
    });
  }

  // tslint:disable-next-line:typedef
  getCategorys() {
    this.categoryService.getFiltredCategorys().subscribe((response: any) => {
      this.ngxService.stop();
      this.categorys = response;
      // tslint:disable-next-line:no-shadowed-variable
    }, (error: any) => {
      this.ngxService.stop();
      console.log(error);
      if (error.error?.message){
        this.responseMessage = error.error?.message;
      }else {
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
    });
  }

  // tslint:disable-next-line:typedef
  getProductsByCategory(value: any){
    this.productService.getProductByCategory(value.id).subscribe((response: any) => {
      this.products = response;
      this.manageOrderForm.controls.price.setValue('');
      this.manageOrderForm.controls.quantity.setValue('');
      this.manageOrderForm.controls.total.setValue(0);
      // tslint:disable-next-line:no-shadowed-variable
    }, (error: any) => {
      console.log(error);
      if (error.error?.message){
        this.responseMessage = error.error?.message;
      }else {
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
    });
  }

  // tslint:disable-next-line:typedef
  getProductDetails(value: any){
    this.productService.getById(value.id).subscribe((response: any) => {
      this.price = response.price;
      this.manageOrderForm.controls.price.setValue(response.price);
      this.manageOrderForm.controls.quantity.setValue('1');
      this.manageOrderForm.controls.total.setValue(this.price * 1);
      // tslint:disable-next-line:no-shadowed-variable
    }, (error: any) => {
      console.log(error);
      if (error.error?.message){
        this.responseMessage = error.error?.message;
      }else {
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
    });
  }

  // tslint:disable-next-line:typedef
  setQuantity(value: any){
    // tslint:disable-next-line:prefer-const
    let temp = this.manageOrderForm.controls.quantity.value;
    if (temp > 0){
      // tslint:disable-next-line:max-line-length
      this.manageOrderForm.controls.total.setValue(this.manageOrderForm.controls.quantity.value * this.manageOrderForm.controls.price.value);
      // tslint:disable-next-line:triple-equals
    }else if (temp != ''){
      this.manageOrderForm.controls.quantity.setValue('1');
      // tslint:disable-next-line:max-line-length
      this.manageOrderForm.controls.total.setValue(this.manageOrderForm.controls.quantity.value * this.manageOrderForm.controls.price.value);
    }
  }

  // tslint:disable-next-line:typedef
  validateProductAdd(){
    // tslint:disable-next-line:max-line-length
    if (this.manageOrderForm.controls.total.value === 0 || this.manageOrderForm.controls.total.value === null || this.manageOrderForm.controls.quantity.value <= 0 ){
      return true;
    }
    else {
      return false;
    }
  }

  // tslint:disable-next-line:typedef
  validateSubmit(){
    // tslint:disable-next-line:max-line-length
    if (this.totalAmount === 0 || this.manageOrderForm.controls.name.value === null ||
      this.manageOrderForm.controls.email.value === null ||
      this.manageOrderForm.controls.contactNumber.value === null ||
      this.manageOrderForm.controls.paymentMethod.value === null){
      return true;
    }
    else {
      return false;
    }
  }

  // tslint:disable-next-line:typedef
  add(){
    const formData = this.manageOrderForm.value;
    const productName = this.dataSource.find((e: {id: number}) => e.id === formData.product.id);
    if (productName === undefined){
      this.totalAmount = this.totalAmount + formData.total;
      this.dataSource.push({id: formData.product.id, name: formData.product.name, category: formData.category.name,
        quantity: formData.quantity, price: formData.price, total: formData.total});
      this.dataSource = [...this.dataSource];
      this.snackbarService.openSnackBar('Product Added successfully', 'success');
    }else {
      this.snackbarService.openSnackBar(GlobalConstants.productExistError, GlobalConstants.error);
    }
  }

  // tslint:disable-next-line:typedef
  handleDeleteAction(value: any, element: any) {
   this.totalAmount = this.totalAmount - element.total;
   this.dataSource.splice(value, 1);
   this.dataSource = [...this.dataSource];
  }

  // tslint:disable-next-line:typedef
  submitAction() {
    const formData = this.manageOrderForm.value;
    formData.totalAmount = this.totalAmount; // Set totalAmount in formData

    const data = {
      name: formData.name,
      email: formData.email,
      contactNumber: formData.contactNumber,
      paymentMethod: formData.paymentMethod,
      totalAmount: formData.totalAmount.toString(),
      productDetails: JSON.stringify(this.dataSource),
    };

    this.ngxService.start();
    this.billService.generateReport(data).subscribe(
      (response: any) => {
        this.downloadFile(response?.uuid); // Corrected the function name and response object
        this.manageOrderForm.reset();
        this.dataSource = [];
        this.totalAmount = 0;
      },
      (error: any) => {
        console.log(error);
        if (error.error?.message) {
          this.responseMessage = error.error?.message;
        } else {
          this.responseMessage = GlobalConstants.genericError;
        }
        this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
      }
    );
  }




  // tslint:disable-next-line:typedef
  private downloadFile(fileName: string) {
    // tslint:disable-next-line:prefer-const
    let data = {
      uuid: fileName
    };
    this.billService.getPdf(data).subscribe(
      (response: any) => {
        saveAs(response, fileName + '.pdf');
        this.ngxService.stop();
      });
  }




}
