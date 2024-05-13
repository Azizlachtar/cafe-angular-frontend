import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {BillService} from '../../services/bill.service';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {SnackbarService} from '../../services/snackbar.service';
import {MatTableDataSource} from '@angular/material/table';
import {GlobalConstants} from '../../shared/global-constants';
import {ViewBillProductsComponent} from '../dialog/view-bill-products/view-bill-products.component';
import {ConfirmationComponent} from '../dialog/confirmation/confirmation.component';
import {saveAs} from 'file-saver';

@Component({
  selector: 'app-view-bill',
  templateUrl: './view-bill.component.html',
  styleUrls: ['./view-bill.component.scss']
})
export class ViewBillComponent implements OnInit {

  displayedColumns: string[] = ['name', 'email', 'contactNumber', 'paymentMethod', 'total', 'view'];
  dataSource: any;
  responseMessage: any;
  constructor(
    private router: Router,
    private billService: BillService,
    public dialog: MatDialog,
    private ngxService: NgxUiLoaderService,
    private snackbarService: SnackbarService
  ) { }

  ngOnInit(): void {
    this.ngxService.start();
    this.tableDate();
  }

  // tslint:disable-next-line:typedef
   tableDate() {
    this.billService.getBills().subscribe((response: any) => {
      this.ngxService.stop();
      this.dataSource = new MatTableDataSource(response);
      // tslint:disable-next-line:no-shadowed-variable
    }, (error: any) => {
      this.ngxService.stop();
      console.log(error.error?.message);
      if (error.error?.message){
        this.responseMessage = error.error?.message;
      }else {
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
    });
  }

  // tslint:disable-next-line:typedef
  applyFilter(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // tslint:disable-next-line:typedef
  handleViewAction(values: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      data: values
    };
    dialogConfig.width = '1000px';
    const dialogRef = this.dialog.open(ViewBillProductsComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });

  }

  // tslint:disable-next-line:typedef
  handleDeleteAction(values: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message: 'delete' + values.name + 'bill',
      confirmation: true
    };
    const dialogRef = this.dialog.open(ConfirmationComponent, dialogConfig);
    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((response) => {
      this.ngxService.start();
      this.deleteBill(values.id);
      dialogRef.close();
    });

  }

  // tslint:disable-next-line:typedef
  private deleteBill(id: any) {
    this.billService.delete(id).subscribe(
      (response: any) => {
        this.ngxService.start(); // You might want to start the loading indicator here
        this.tableDate(); // Refresh the table data
        this.responseMessage = response?.message;
        this.snackbarService.openSnackBar(this.responseMessage, 'success');
      },
      (error) => {
        if (error.error) {
          this.responseMessage = error.error?.message;
        } else {
          this.responseMessage = GlobalConstants.genericError;
        }
        this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
      }
    );
  }





  // tslint:disable-next-line:typedef
  downloadReportAction(values: any) {
    this.ngxService.start();
    let data = {
      name: values.name,
      email: values.email,
      uuid: values.uuid,
      contactNumber: values.contactNumber,
      paymentMethod: values.paymentMethod,
      totalAmount: values.totalAmount,
      productDetails: values.productDetails
    };
    this.downloadFile(values.uuid, data);

  }


  // tslint:disable-next-line:typedef
  private downloadFile(fileName: string, data: any) {
    this.billService.getPdf(data).subscribe((response) => {
      saveAs(response, fileName + '.pdf');
      this.ngxService.stop();
    });
    }
}
