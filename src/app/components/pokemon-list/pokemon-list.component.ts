import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { Pokemon, Result } from 'src/app/models/pokemon.interface';
import { PokemonService } from 'src/app/services/pokemon.service';
import { DetailsDialogComponent } from '../details-dialog/details-dialog.component';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.scss'],
})
export class PokemonListComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  displayedColumns: string[] = [
    'name',
    'weight',
    'types',
    'abilities',
    'image',
    'actions',
  ];

  data!: Result;
  dataSource = new MatTableDataSource<Pokemon>([]);

  constructor(
    private pokemonService: PokemonService,
    public dialog: MatDialog
  ) {}

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this.getPokemons();
  }

  getPokemons = (limit: number = 5, offset: number = 0) => {
    this.pokemonService.getAllPokemons(limit, offset).subscribe({
      next: (value) => {
        this.data = value;
        this.dataSource = new MatTableDataSource<Pokemon>(value.results);
      },
    });
  };

  getServerData(event: PageEvent): void {
    if (event.pageIndex === 0) {
      this.getPokemons(event.pageSize, 0);
    }

    event.pageIndex > event.previousPageIndex!
      ? this.getPokemons(
          event.pageSize,
          (event.previousPageIndex! + 1) * event.pageSize
        )
      : this.getPokemons(
          event.pageSize,
          (event.previousPageIndex! - 1) * event.pageSize
        );
  }

  openDialog(data: Pokemon): void {
    const dialogRef = this.dialog.open(DetailsDialogComponent, {
      width: '60vw',
      data: data,
    });
  }

  sortData(sort: Sort) {
    console.log(this.data.results);
    if (sort.direction === 'asc') {
      this.dataSource.data = this.dataSource.data.sort(function (a, b) {
        if (sort.active === 'name') {
          if (a.name > b.name) return 1;
          if (a.name < b.name) return -1;
          return 0;
        } else {
          if (a.weight > b.weight) return 1;
          if (a.weight < b.weight) return -1;
          return 0;
        }
      });
    } else if (sort.direction === 'desc') {
      this.dataSource.data = this.dataSource.data.sort(function (a, b) {
        if (sort.active === 'name') {
          if (a.name < b.name) return 1;
          if (a.name > b.name) return -1;
          return 0;
        } else {
          if (a.weight < b.weight) return 1;
          if (a.weight > b.weight) return -1;
          return 0;
        }
      });
    } else {
      console.log(this.data.results);
      this.dataSource.data = this.data.results;
    }
  }

  search(event: Event) {
    let searchValue = (event.target as HTMLInputElement).value;
    if (searchValue === '') {
      this.getPokemons();
    } else {
      this.pokemonService
        .getPokemonByNameOrId(searchValue.toLowerCase())
        .subscribe({
          next: (value) => (this.dataSource.data = [value]),
          error: () => this.getPokemons(),
        });
    }
  }
}
