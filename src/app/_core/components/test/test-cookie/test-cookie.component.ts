import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/_core/model/user-model';
import { CookieDrunkService } from 'src/app/_core/services/cookie.service';
import { Drink } from 'src/app/_core/model/drink-model';
import { DrinkService } from 'src/app/_core/services/drink.service';



@Component({
  selector: 'app-test-cookie',
  templateUrl: './test-cookie.component.html',
  styleUrls: ['./test-cookie.component.scss']
})
export class TestCookieComponent implements OnInit{

  constructor(
    private cookieDrunkService: CookieDrunkService,
    private DrinkService: DrinkService,
  ){}
  ngOnInit(): void {
    
    console.log('#[Cookie] Init');
    const user = new User();
    user.nome = 'Vito Buonsanto';
    user.cookie = true;
    user.peso = 90;
    user.profiloSelezionato = true;
    user.sesso = 'M';

    console.log('#[Cookie] User: ', user);

    this.cookieDrunkService.setUser(user);
    const users = this.cookieDrunkService.getUsers();
    console.log('#[Cookie] Users: ', users);
    const profilo = this.cookieDrunkService.getProfiloSelezionato();
    console.log('#[Cookie] Profilo Selezionato: ', profilo);

    const vito = this.cookieDrunkService.getUser('8117e2f1-bae8-4124-bdc8-899e136488b8');
    console.log('#[Cookie] Profilo Vito: ', vito);

    vito.peso = 150;
    this.cookieDrunkService.setUser(vito);

    console.log('#[Cookie] Profilo Vito Mod: ', vito);


    const user2 = new  User();

    user2.nome = 'Fabrizio Favia';
    user2.cookie = true;
    user2.peso = 60;
    user2.profiloSelezionato = false;
    user2.sesso = 'M';
    this.cookieDrunkService.setUser(user2);
    this.cookieDrunkService.setProfiloSelezionato('58ae7659-ec48-4e46-b6ee-5fda4080d39f');
    const profiloSelezionato = this.cookieDrunkService.getProfiloSelezionato();
    console.log('#[Cookie] Profilo Selezionato: ', profiloSelezionato);
    const users2 = this.cookieDrunkService.getUsers();
    console.log('#[Cookie] Users: ', users2);


    /* PROVA DRINK */
    const drink1 = new Drink('peroni', 'Alcolico', 33, 8);
    this.DrinkService.setDrink(drink1);
  }
}
