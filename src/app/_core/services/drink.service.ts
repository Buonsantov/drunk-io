import { Injectable } from '@angular/core';
import { Drink } from '../model/drink-model';

@Injectable({
    providedIn: 'root',
  })
  export class DrinkService {
    drink?: Drink;

    setDrink(selectedDrink: Drink) {
        this.drink = selectedDrink;
       }

    getDrink(){
        return this.drink;
    }

  };


  