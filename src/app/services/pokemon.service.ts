import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import {
  Observable,
  catchError,
  combineLatest,
  forkJoin,
  map,
  mergeMap,
  of,
  throwError,
} from 'rxjs';
import { Pokemon, Result } from '../models/pokemon.interface';

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  url = environment.urlBase;

  constructor(private httpClient: HttpClient) {}

  getAllPokemons = (
    limit: number = 5,
    offset: number = 0
  ): Observable<Result> => {
    return this.httpClient
      .get<Result>(`${this.url}?limit=${limit}&offset=${offset}`)
      .pipe(
        mergeMap((x: any) => {
          const pokemonNames = x.results.map(
            (pokemon: Pokemon) => pokemon.name
          );
          const pokemonRequests = pokemonNames.map((pokemonName: string) =>
            this.getPokemonByNameOrId(pokemonName)
          );

          return forkJoin(pokemonRequests).pipe(
            map((pokemonData: any) => {
              x.results.forEach((pokemon: Pokemon, index: number) => {
                pokemon.id = pokemonData[index]['id'];
                pokemon.name = pokemonData[index]['name'];
                pokemon.abilities = pokemonData[index]['abilities'];
                pokemon.types = pokemonData[index]['types'];
                pokemon.image = pokemonData[index]['image'];
                pokemon.stats = pokemonData[index]['stats'];
                pokemon.height = pokemonData[index]['height'];
                pokemon.weight = pokemonData[index]['weight'];
                pokemon.cries = pokemonData[index]['cries'];
              });
              return x;
            })
          );
        })
      );
  };

  getPokemonByNameOrId(NameOrID: string): Observable<Pokemon> {
    return this.httpClient
      .get<Pokemon>(`${this.url}/${NameOrID}`)
      .pipe(
        map((pokemon: Pokemon) => {
          pokemon.image =
            pokemon['sprites']['other']['dream_world']['front_default'];
          return pokemon;
        })
      )
      .pipe(catchError(this.handleError));
  }

  private handleError(error: Response) {
    if (error.status === 404)
      return throwError(() => new Error('Pokemon not found'));
    if (error.status === 400) return throwError(() => new Error('Bad request'));
    return throwError(() => new Error('A problem has occurred'));
  }
}
