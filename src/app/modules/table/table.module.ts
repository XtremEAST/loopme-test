import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from './components/table/table.component';
import { TableRowComponent } from './components/table-row/table-row.component';
import { TableFilterComponent } from './components/table-filter/table-filter.component';
import {ReactiveFormsModule} from '@angular/forms';



@NgModule({
  declarations: [TableComponent, TableRowComponent, TableFilterComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports: [TableComponent]
})
export class TableModule { }
