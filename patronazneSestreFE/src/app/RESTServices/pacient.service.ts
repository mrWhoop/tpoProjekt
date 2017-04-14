import { Injectable } from '@angular/core';
import { Http, Response, Headers} from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Uporabnik } from '../uporabnik';
import { Pacient } from './vrniPacient';
import { Posta } from './vrniPacient';
import { Spol } from './vrniPacient';
import { Uporabnikdrugi } from './vrniPacient';
import { Vloga } from './vrniPacient';
import { LocalStorageService } from 'angular-2-local-storage';

//klasa za service
@Injectable()
export class PacientService{
 private baseUrl: String = 'localhost:8080/patronazneSestre/v1';
 constructor(private http : Http,private localStorageService: LocalStorageService){}
 
 //service za prejemanje pacienta
 get(zz: number): Observable<Pacient> {
	 var username = localStorage.getItem('username');
	 var pass = localStorage.getItem('password');
	var headers = new Headers({'Content-Type': 'application/json','Authorization':'Basic ' + btoa(username+':'+pass)});
	
	let pacient$ = this.http.get(`${this.baseUrl}/pacient/zz/${zz}`, {headers: headers}).map((res) => { return this.mapPacient(res)});
	
	return pacient$
	
 }
 
 //vmesna funkcija
 mapPacient(response: Response): Pacient{
  return this.toPacient(response.json());
}
//pretvorba json objekta v angular objekt
 toPacient(r:any): Pacient{
  let pacient = <Pacient>({
    hisnaStevilka: r.hisnaStevilka,
    ime: r.ime,
    priimek: r.priimek,
    stevilkaZdravstvenegaZavarovanja: r.stevilkaZdravstvenegaZavarovanja,
	telefonskaStevilka: r.telefonskaStevilka,
	ulica: r.ulica,
	posta: r.posta,
	spol: r.spol,
	uporabnik: r.uporabnik,
  });
  
  return pacient;
}

}