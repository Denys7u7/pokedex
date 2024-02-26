import { NgModule } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSortModule } from '@angular/material/sort';

@NgModule({
  exports: [
    MatTableModule,
    MatDialogModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatSortModule,
  ],
})
export class MaterialModule {}
