import 'rxjs/add/operator/switchMap';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Http, Response, Headers} from '@angular/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { izpisDNService } from '../izpisDelovnihNalogov/izpisDN.service';

@Component({
	selector: 'seznamObiskov',
	templateUrl: './seznamObiskov.component.html',
	styleUrls: ['./seznamObiskov.component.css']
})

export class seznamObiskovComponent implements OnInit{
	private restUrl = 'http://localhost:8080/patronazneSestre/v1';
	constructor(private router:Router, private http: Http, private DNService: izpisDNService){}

	aliJeLockanZD = false;
	aliJeLockanMS = false;
	nadomestne: any[] = [{'sifra':0}];
	res:any;
	aliObstaja: boolean = false;
	obiski = [{'name': '','id':0}];
	pacienti = [{'ime':'','priimek':'','id':0}];
	sestre = [{'ime':'','sifra':'','id':0}];
	izdajatelji= [{'ime':'','sifra':'','id':0}];
	opravljenost=[{'opravljenost':''},{'opravljenost':'Opravljen'},{'opravljenost':'Neopravljen'}];


	izbraniPredvideniDatumOd='';
	izbraniPredvideniDatumDo='';
	izbraniDejanskiDatumOd='';
	izbraniDejanskiDatumDo='';


	sekundarnaTabelaObiskovVsi: any[];
	sekundarnaTabelaObiskovDejanski: any[] = [{idObiska:0,izdajatelj:'',vrstaObiska:'',patronaznaSestra:'',pacienti:'',predvideniDatumObiska:'',dejanskiDatumObiska:'',opravljenost:'',porocilo:'',kaksno:''}]
	izbranaOpravljenost = this.opravljenost[0];
	izbraniIzdajatelj = this.izdajatelji[0];
	izbraniObisk = this.obiski[0];
	izbraniPacient = this.pacienti[0];
	izbranaSestra = this.sestre[0];

	tabelaObiskovVsi: any[];
	tabelaDejanskiObiskov: any[] = [{idObiska:0,izdajatelj:'',vrstaObiska:'',patronaznaSestra:'',pacienti:'',predvideniDatumObiska:'',dejanskiDatumObiska:'',opravljenost:'','nadomestna':'',porocilo:'',kaksno:''}]
	izvajalecZdravstvenihStoritev:number= 0;

	ngOnInit(){
		var headers3 = new Headers({'Content-Type': 'application/json','Authorization':'Basic ' + btoa(localStorage.getItem('email')+':'+localStorage.getItem('password'))});


			this.http.get(`${this.restUrl}/zdravstveniDelavec/${localStorage['iduporabnik']}`, {headers: headers3}).subscribe(res => {
				this.res = res.json();
				var vmesna = JSON.stringify(this.res);
				var dobiZd = JSON.parse(vmesna);

				localStorage.setItem('idZdravstvenegaDelavca',dobiZd.idzdravstveniDelavec.toString());
				localStorage.setItem('idIzv',dobiZd.izvajalecZdravstvenihStoritev.idizvajalecZdravstvenihStoritev);
			if(localStorage['vloga'] == 'Zdravnik' || localStorage['vloga'] == 'PatronaznaSluzba'){
				this.izdajatelji[0].ime = dobiZd.ime+" "+dobiZd.priimek;
				this.izdajatelji[0].sifra = dobiZd.sifra;
				this.izdajatelji[0].id = dobiZd.idzdravstveniDelavec;
			}else if(localStorage['vloga'] == 'PatronaznaSestra'){

				this.sestre[0].ime = dobiZd.ime+" "+dobiZd.priimek;
				this.sestre[0].sifra = dobiZd.sifra;
				this.sestre[0].id = dobiZd.idzdravstveniDelavec;

			}
			});
		setTimeout(() => {
		/*if(localStorage['vloga'] == 'Zdravnik'){
			this.DNService.getDelovneNaloge(Number(localStorage.getItem('idZdravstvenegaDelavca'))).subscribe(res => {this.tabelaObiskovVsi = res;
				let i = 0; //stevec za obiske
				let d = 0; //stevec za paciente
				let j = 0; //stevec za vrste obiskov
				let m = 0; //stevec za zdravstvene delavce

				for(let dn of this.tabelaObiskovVsi){
					for(let ob of dn.obisks){
						let obisk = <any> ({idObiska:0,izdajatelj:'',vrstaObiska:'',patronaznaSestra:'',pacienti:'',predvideniDatumObiska:'',dejanskiDatumObiska:'',opravljenost:''});
						this.aliObstaja = false;
						obisk.idObiska = ob.idobisk;
						obisk.vrstaObiska = dn.vrstaObiska.opis;
						obisk.pacienti = dn.pacients[0].ime+' '+dn.pacients[0].priimek;
						if(ob.opravljen == 0){
							obisk.opravljenost = 'Neopravljen';
						}else{
							obisk.opravljenost = 'Opravljen';
						}
						//setanje patronaznih sester

						for(let zdr of dn.zdravstveniDelavecs){
							this.aliObstaja = false;
							if(zdr.okolis != null){
								obisk.patronaznaSestra = zdr.sifra+" "+obisk.patronaznaSestra;

								//pregled Sester
								for(let ses of this.sestre){
									if(ses.id == zdr.idzdravstveniDelavec){
										this.aliObstaja = true;
										break;
									}
								}
								if(this.aliObstaja == false){
									let novaS = <any> ({sifra:'',id:0})
									novaS.sifra = zdr.sifra;
									novaS.id = zdr.idzdravstveniDelavec;
									this.sestre[m] = novaS
									m = m+1;
								}
							}else{
								obisk.izdajatelj = zdr.sifra;
							}
						}

						//datumi
						obisk.predvideniDatumObiska = ob.datumObiska;
						obisk.dejanskiDatumObiska = ob.dejanskiDatumObiska;
						//zapisovanje objekta v dejanski
						this.tabelaDejanskiObiskov[i] = obisk;
						i = i+1;
					}
					//dodaj v subseznam obiskov
					for(let vrsta of this.obiski){
						if(vrsta.id == dn.vrstaObiska.idvrstaObiska){
							this.aliObstaja = true;
							break;
						}
					}
					if(this.aliObstaja == false){
						let obisk = <any> ({'name':'','id':0});
						obisk.name = dn.vrstaObiska.opis;
						obisk.id = dn.vrstaObiska.idvrstaObiska;
						this.obiski[j] = obisk;
						j = j+1;
					}
					//dodaj v subseznam pacientov
					this.aliObstaja = false;
					for(let pacient of this.pacienti){
						if(pacient.id == dn.pacients[0].idpacient){
							this.aliObstaja = true;
							break;
						}
					}
					if(this.aliObstaja == false){
						let pacien = <any>({idpacient:0,ime:'',priimek:''});
						pacien.id = dn.pacients[0].idpacient;
						pacien.ime = dn.pacients[0].ime;
						pacien.priimek = dn.pacients[0].priimek;
						this.pacienti[d] = pacien;
						d = d+1;
					}


				}
				this.tabelaDejanskiObiskov = this.bubbleSort(this.tabelaDejanskiObiskov);
				this.tabelaObiskovVsi = this.tabelaDejanskiObiskov;
			});*/
		if(localStorage['vloga'] == 'PatronaznaSestra' || localStorage['vloga'] == 'Zdravnik'){
			this.DNService.getDelovneNaloge(Number(localStorage.getItem('idZdravstvenegaDelavca')),0).subscribe(res => {this.tabelaObiskovVsi = res;
				let i = 0; //stevec za obiske
				let d = 0; //stevec za paciente
				let j = 0; //stevec za vrste obiskov
				let m = 0; //stevec za zdravstvene delavce
				let n = 0;
				if(localStorage['vloga'] == 'PatronaznaSestra'){
					this.aliJeLockanMS = true;
				}else{
					this.aliJeLockanZD = true;
				}
				console.log(this.tabelaObiskovVsi);
				for(let dn of this.tabelaObiskovVsi){
					for(let ob of dn.obisks){
						let obisk = <any> ({idObiska:0,izdajatelj:'',vrstaObiska:'',patronaznaSestra:'',pacienti:'',predvideniDatumObiska:'',dejanskiDatumObiska:'',opravljenost:'',nadomestna:''});
						this.aliObstaja = false;
						obisk.idObiska = ob.idobisk;
						obisk.vrstaObiska = dn.vrstaObiska.opis;
						if(ob.nadomestnaSestra != null){
							if(localStorage.getItem('idZdravstvenegaDelavca') != ob.nadomestnaSestra.idzdravstveniDelavec){
								continue;
							}
							obisk.nadomestna = ob.nadomestnaSestra.ime+" "+ob.nadomestnaSestra.priimek+" ["+ob.nadomestnaSestra.sifra+"]";
						}else{
							obisk.nadomestna = 'ni nadomeščanja';
						}
						obisk.pacienti = dn.pacients[0].ime+' '+dn.pacients[0].priimek;
						if(ob.opravljen == 0){
							obisk.opravljenost = 'Neopravljen';
							if(localStorage.getItem('vloga') == 'Zdravnik'){
								obisk.kaksno = 'Ni poročila';
								obisk.porocilo = '*';
							}else{
								obisk.porocilo = '/vnosObisk/'+ob.idobisk+"/"+dn.iddelovniNalog;
								obisk.kaksno = 'Dodaj poročilo'
							}
							if(ob.fixenDatum == 0){
								obisk.porocilo = '*';
								obisk.kaksno = 'Fiksni datum';
							}
						}else{
							obisk.opravljenost = 'Opravljen';

							obisk.porocilo = '/vnosObisk/'+ob.idobisk+"/"+dn.iddelovniNalog;
							if(localStorage.getItem('vloga') == 'Zdravnik'){
								obisk.kaksno = 'Podrobnosti poročila'
							}else{
								obisk.kaksno = 'Podrobnosti/Popravki poročila'
							}
						}

						//setanje patronaznih sester
						if(localStorage['vloga'] == 'PatronaznaSestra'){
							m = 1;
						}else{
							n = 1;
						}
						var nd = 0;
						for(let b of dn.obisks){
							if(b.nadomestnaSestra != null){
								let nov: any = ({'sifra':0});
								nov.sifra = b.nadomestnaSestra.sifra;
								this.nadomestne[nd] = nov;
								nd = nd+1;
							}
						}
						for(let zdr of dn.zdravstveniDelavecs){
							this.aliObstaja = false;
							if(zdr.okolis != null){
								if(obisk.nadomestna != 'ni nadomeščanja'){

									if(zdr.sifra == ob.nadomestnaSestra.sifra){
										obisk.patronaznaSestra =zdr.ime+' '+zdr.priimek+' ['+zdr.sifra+"] "+obisk.patronaznaSestra;
									}
								}
								var nekBool = false;
								for(let b of this.nadomestne){
									if(zdr.sifra == b.sifra){
										nekBool = true;
										break;

									}
								}
								if(nekBool == false){
									obisk.patronaznaSestra =zdr.ime+' '+zdr.priimek+' ['+zdr.sifra+"] "+obisk.patronaznaSestra;
								}

								//pregled Sester
								console.log(this.sestre);
								for(let ses of this.sestre){

									if(obisk.nadomestna != 'ni nadomeščanja'){
										if((nekBool == true && zdr.sifra != ob.nadomestnaSestra.sifra)){
											this.aliObstaja = true;

										}
									}
									if(ses.id == zdr.idzdravstveniDelavec || this.aliObstaja == true){
										this.aliObstaja = true;
										break;
									}
								}
								if(this.aliObstaja == false){
									let novaS = <any> ({ime:'',sifra:'',id:0});
									novaS.ime = zdr.ime+' '+zdr.priimek;
									novaS.sifra = zdr.sifra;
									novaS.id = zdr.idzdravstveniDelavec;
									this.sestre[m] = novaS
									m = m+1;
								}

							}else{
								for(let zdravnik of this.izdajatelji){
									if(zdravnik.id == zdr.idzdravstveniDelavec){
										this.aliObstaja = true;
										break;
									}
								}
								if(this.aliObstaja == false){
									let noviZdr = <any>({ime:'',sifra:'',id:0});
									noviZdr.ime = zdr.ime+' '+zdr.priimek;
									noviZdr.sifra = zdr.sifra;
									noviZdr.id = zdr.idzdravstveniDelavec;
									console.log(this.izdajatelji);
									this.izdajatelji[n] = noviZdr;
									n = n+1;
								}

								obisk.izdajatelj = zdr.ime+" "+zdr.priimek+" ["+zdr.sifra+"]";

							}
						}

						//datumi
						obisk.predvideniDatumObiska = ob.datumObiska;
						obisk.dejanskiDatumObiska = ob.dejanskiDatumObiska;
						//zapisovanje objekta v dejanski
						this.tabelaDejanskiObiskov[i] = obisk;
						i = i+1;
					}
					this.aliObstaja = false;
					//dodaj v subseznam obiskov
					for(let vrsta of this.obiski){
						if(vrsta.id == dn.vrstaObiska.idvrstaObiska){
							this.aliObstaja = true;
							break;
						}
					}
					if(this.aliObstaja == false){
						let obisk = <any> ({'name':'','id':0});
						obisk.name = dn.vrstaObiska.opis;
						obisk.id = dn.vrstaObiska.idvrstaObiska;
						this.obiski[j] = obisk;
						j = j+1;
					}

					//dodaj v subseznam pacientov
					this.aliObstaja = false;
					for(let s of dn.pacients){
						this.aliObstaja = false;
						for(let pacient of this.pacienti){

							if(pacient.id == s.idpacient){
								this.aliObstaja = true;
								break;
							}
						}
						if(this.aliObstaja == false){
							let pacien = <any>({idpacient:0,ime:'',priimek:''});
							pacien.id = s.idpacient;
							pacien.ime = s.ime;
							pacien.priimek = s.priimek;
							this.pacienti[d] = pacien;
							d = d+1;
						}
					}


				}
				this.tabelaDejanskiObiskov = this.bubbleSort(this.tabelaDejanskiObiskov);
				this.tabelaObiskovVsi = this.tabelaDejanskiObiskov;
				this.Onsubmit();
			});
		}else if(localStorage['vloga'] == 'PatronaznaSluzba'){


			this.DNService.getDelovneNalogePrekIzv2(Number(localStorage.getItem('idIzv')),0).subscribe(res => {this.tabelaObiskovVsi = res;

				let i = 0; //stevec za obiske
				let d = 0; //stevec za paciente
				let j = 0; //stevec za vrste obiskov
				let m = 0; //stevec za zdravstvene delavce
				let n = 1;
				for(let dn of this.tabelaObiskovVsi){
					for(let ob of dn.obisks){
						let obisk = <any> ({idObiska:0,izdajatelj:'',vrstaObiska:'',patronaznaSestra:'',pacienti:'',predvideniDatumObiska:'',dejanskiDatumObiska:'',opravljenost:'',nadomestna:''});
						this.aliObstaja = false;
						obisk.idObiska = ob.idobisk;
						obisk.vrstaObiska = dn.vrstaObiska.opis;
						if(ob.nadomestnaSestra != null){
							obisk.nadomestna = ob.nadomestnaSestra.ime+" "+ob.nadomestnaSestra.priimek+" ["+ob.nadomestnaSestra.sifra+"]";
						}else{
							obisk.nadomestna = 'ni nadomeščanja';
						}
						for(let pac of dn.pacients){
							obisk.pacienti = pac.ime+' '+pac.priimek+','+obisk.pacienti;
						}
						if(ob.opravljen == 0){
							obisk.opravljenost = 'Neopravljen';
							obisk.kaksno = 'Ni poročila';
							obisk.porocilo = '*';
						}else{
							obisk.opravljenost = 'Opravljen';
							obisk.porocilo = '/vnosObisk/'+ob.idobisk+"/"+dn.iddelovniNalog;
							obisk.kaksno = 'Podrobnosti poročila';
						}
						//setanje patronaznih sester
						var nd = 0;
						for(let b of dn.obisks){
							if(b.nadomestnaSestra != null){
								let nov: any = ({'sifra':0});
								nov.sifra = b.nadomestnaSestra.sifra;
								this.nadomestne[nd] = nov;
								nd = nd+1;
							}
						}
						for(let zdr of dn.zdravstveniDelavecs){
							this.aliObstaja = false;
							if(zdr.okolis != null){
								if(obisk.nadomestna != 'ni nadomeščanja'){
									if(zdr.sifra == ob.nadomestnaSestra.sifra){
										obisk.patronaznaSestra = zdr.ime+" "+zdr.priimek+" ["+zdr.sifra+"] "+obisk.patronaznaSestra;
									}
								}

								var nekBool = false;
								for(let b of this.nadomestne){
									if(zdr.sifra == b.sifra){
										nekBool = true;
										break;

									}
								}
								if(nekBool == false){
									obisk.patronaznaSestra =zdr.ime+' '+zdr.priimek+' ['+zdr.sifra+"] "+obisk.patronaznaSestra;
								}

								//pregled Sester
								for(let ses of this.sestre){
									if(obisk.nadomestna != 'ni nadomeščanja'){
										if((nekBool == true && zdr.sifra != ob.nadomestnaSestra.sifra)){
											this.aliObstaja = true;

										}
									}
									if((ses.id == zdr.idzdravstveniDelavec) || (this.aliObstaja == true)){
										this.aliObstaja = true;
										break;
									}
								}
								if(this.aliObstaja == false){
									let novaS = <any> ({ime:'',sifra:'',id:0});
									novaS.ime = zdr.ime+" "+zdr.priimek;
									novaS.sifra = zdr.sifra;
									novaS.id = zdr.idzdravstveniDelavec;
									this.sestre[m] = novaS
									m = m+1;
								}
							}else{
								this.aliObstaja = false;
								for(let zdravnik of this.izdajatelji){
									if(zdravnik.id == zdr.idzdravstveniDelavec){
										this.aliObstaja = true;
										break;
									}
								}
								if(this.aliObstaja == false){
									let noviZdr = <any>({ime:'',sifra:'',id:0});
									noviZdr.ime = zdr.ime+" "+zdr.priimek;
									noviZdr.sifra = zdr.sifra;
									noviZdr.id = zdr.idzdravstveniDelavec;
									this.izdajatelji[n] = noviZdr;
									n = n+1;
								}
								obisk.izdajatelj = zdr.ime+" "+zdr.priimek+" ["+zdr.sifra+"]";
							}
						}

						//datumi
						obisk.predvideniDatumObiska = ob.datumObiska;
						obisk.dejanskiDatumObiska = ob.dejanskiDatumObiska;
						//zapisovanje objekta v dejanski
						this.tabelaDejanskiObiskov[i] = obisk;
						i = i+1;
					}
					//dodaj v subseznam obiskov
					this.aliObstaja=false;
					for(let vrsta of this.obiski){
						if(vrsta.id == dn.vrstaObiska.idvrstaObiska){
							this.aliObstaja = true;
							break;
						}
					}
					if(this.aliObstaja == false){
						let obisk = <any> ({'name':'','id':0});
						obisk.name = dn.vrstaObiska.opis;
						obisk.id = dn.vrstaObiska.idvrstaObiska;
						this.obiski[j] = obisk;
						j = j+1;
					}
					//dodaj v subseznam pacientov
					this.aliObstaja = false;
					for(let s of dn.pacients){
						this.aliObstaja = false;
						for(let pacient of this.pacienti){

							if(pacient.id == s.idpacient){
								this.aliObstaja = true;
								break;
							}
						}
						if(this.aliObstaja == false){
							let pacien = <any>({idpacient:0,ime:'',priimek:''});
							pacien.id = s.idpacient;
							pacien.ime = s.ime;
							pacien.priimek = s.priimek;
							this.pacienti[d] = pacien;
							d = d+1;
						}
					}



				}
				this.tabelaDejanskiObiskov = this.bubbleSort(this.tabelaDejanskiObiskov);
				this.tabelaObiskovVsi = this.tabelaDejanskiObiskov;
				this.Onsubmit();
			});

		}

	},1000);
	}
	bubbleSort(tabela: any[]): any[]{
		for(var i=0; i < tabela.length -1 ; i++) {
			for(var x=0; x < tabela.length - 1; x++) {
				var parts:any[] = tabela[x].predvideniDatumObiska.split('-');
				var prvi = parts[0]+parts[1]+parts[2];
				parts = tabela[x+1].predvideniDatumObiska.split('-');
				var drugi = parts[0]+parts[1]+parts[2];
				if(Number(prvi) > Number(drugi)) {
					var theGreater = tabela[x];
					tabela[x] = tabela[x + 1];
					tabela[x+1] = theGreater;
				}
			}
		}
		return tabela;
	}


	Onsubmit(){
		let i = 0;
		var predvideniOd = '';
		var predvideniDo = '';
		var dejanskiOd = '';
		var dejanskiDo = '';
		//datumi 7
		if(this.izbraniPredvideniDatumOd != ''){
			var parts: any[] = this.izbraniPredvideniDatumOd.split('-');
			predvideniOd = parts[0]+parts[1]+parts[2];
		}
		if(this.izbraniPredvideniDatumDo != ''){
			var parts: any[] = this.izbraniPredvideniDatumDo.split('-');
			predvideniDo = parts[0]+parts[1]+parts[2];
		}
		if(this.izbraniDejanskiDatumOd != ''){
			var parts: any[] = this.izbraniDejanskiDatumOd.split('-');
			dejanskiOd = parts[0]+parts[1]+parts[2];
		}
		if(this.izbraniDejanskiDatumDo != ''){
			var parts: any[] = this.izbraniDejanskiDatumDo.split('-');
			dejanskiDo = parts[0]+parts[1]+parts[2];
		}
		let obisk = <any> ({idObiska:0,izdajatelj:'',vrstaObiska:'',patronaznaSestra:'',pacienti:'',predvideniDatumObiska:'',dejanskiDatumObiska:'',opravljenost:''});
		this.tabelaDejanskiObiskov = [];

		for(let ob of this.tabelaObiskovVsi){
			let test = true;
			var parts:any[] = ob.predvideniDatumObiska.split('-');
			var predD = parts[0]+parts[1]+parts[2];
			parts = ob.dejanskiDatumObiska.split('-');
			var dejanD = parts[0]+parts[1]+parts[2];
			var tabelaIfov = [false,false,false,false,false,false,false];

			if(ob.vrstaObiska == this.izbraniObisk.name || this.izbraniObisk.name == '' || this.izbraniObisk.name == undefined){
				tabelaIfov[0] = true;
			}
			if(ob.izdajatelj.indexOf(this.izbraniIzdajatelj.sifra) >=0 || this.izbraniIzdajatelj.sifra == '' || this.izbraniIzdajatelj.sifra == undefined){

				tabelaIfov[1] = true;
			}
			if(ob.pacienti.indexOf(this.izbraniPacient.ime+" "+this.izbraniPacient.priimek)>=0 || this.izbraniPacient.ime == '' || this.izbraniPacient.ime == undefined){

				tabelaIfov[2] = true;
			}


			if(ob.patronaznaSestra.indexOf(this.izbranaSestra.sifra)>=0 || this.izbranaSestra.sifra == '' || this.izbranaSestra.sifra == undefined){

				tabelaIfov[3] = true;
			}
			if(ob.opravljenost == this.izbranaOpravljenost.opravljenost || this.izbranaOpravljenost.opravljenost == '' || this.izbranaOpravljenost.opravljenost == undefined){

				tabelaIfov[4] = true;
			}

			if((Number(predD) >= Number(predvideniOd) && Number(predD) <= Number(predvideniDo)) || (predvideniDo == '' && Number(predD) >= Number(predvideniOd)) || (predvideniOd == '' && Number(predD) <= Number(predvideniDo)) || (predvideniDo == '' && predvideniOd == '')){

				tabelaIfov[5] = true;
			}
			if((Number(dejanD) >= Number(dejanskiOd) && Number(dejanD) <= Number(dejanskiDo)) || (dejanskiDo == '' && Number(dejanD) >= Number(dejanskiOd)) || (dejanskiOd == '' && Number(dejanD) <= Number(dejanskiDo)) || (dejanskiDo == '' && dejanskiOd == '')){

				tabelaIfov[6] = true;
			}
			for(let d of tabelaIfov){
				if(d == false){
					test = false;
					break;
				}
			}
			if(test == true){
				obisk = ob;
				this.tabelaDejanskiObiskov[i] = obisk;
				i = i+1;
			}
		}
	}


}
