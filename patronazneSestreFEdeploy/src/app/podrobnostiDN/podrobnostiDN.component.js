"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
require("rxjs/add/operator/switchMap");
var router_1 = require("@angular/router");
var http_1 = require("@angular/http");
var core_1 = require("@angular/core");
var izpisDN_service_1 = require("../izpisDelovnihNalogov/izpisDN.service");
var common_1 = require("@angular/common");
var podrobnostiDNComponent = (function () {
    function podrobnostiDNComponent(router, http, DNService, route, location) {
        this.router = router;
        this.http = http;
        this.DNService = DNService;
        this.route = route;
        this.location = location;
        this.idDelovnegaNaloga = 0;
        this.izvNaziv = '';
        this.aliJePraviObisk = false;
        this.aliJeOdvzemKrvi = false;
        this.aliJeInjekcija = false;
        this.izvSifra = '';
        this.izvNaslov = '';
        this.izdSifra = '';
        this.izdIme = '';
        this.izdPriimek = '';
        this.sestraSifra = '';
        this.sestraOkolis = '';
        this.sestraIme = '';
        this.sestraPriimek = '';
        this.pacIme = '';
        this.pacPriimek = '';
        this.pacSZZ = '';
        this.pacNaslov = '';
        this.pacDatumRojstva = '';
        this.pacTelefon = '';
        this.pacPosta = '';
        this.pacIme2 = '';
        this.pacPriimek2 = '';
        this.pacSZZ2 = '';
        this.pacNaslov2 = '';
        this.pacDatumRojstva2 = '';
        this.pacTelefon2 = '';
        this.pacPosta2 = '';
        this.otroci = [{ 'ime': '', 'priimek': '', 'zz': '', 'datumRojstva': '', 'naslov': '' }];
        this.obiskiDatumi = [{ 'datumObiska': '', 'fiksniDatum': '', 'opravljen': '', 'dejanskiDatum': '', 'nadomescanje': '' }];
        this.obiskVrstaStoritve = '';
        this.obiskBolezen = '';
        this.zdravila = [{ 'idZdravila': 0, 'tipZdravila': '' }];
        this.material = [{ 'tipMateriala': '', 'kolicina': 0 }];
    }
    podrobnostiDNComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.route.params
            .switchMap(function (params) { return _this.DNService.getDelovniNalog(Number(+params['id'])); }).subscribe(function (response) {
            _this.delovniNalog = response;
            console.log(_this.delovniNalog);
            _this.idDelovnegaNaloga = _this.delovniNalog.iddelovniNalog;
            //izvajalec zdravstvenih storitev
            _this.izvNaziv = _this.delovniNalog.izvajalecZdravstvenihStoritev.naziv;
            _this.izvSifra = _this.delovniNalog.izvajalecZdravstvenihStoritev.stevilkaIzvajalca;
            _this.izvNaslov = _this.delovniNalog.izvajalecZdravstvenihStoritev.ulica + " " + _this.delovniNalog.izvajalecZdravstvenihStoritev.hisnaStevilka;
            //izdajatelj
            for (var _i = 0, _a = _this.delovniNalog.zdravstveniDelavecs; _i < _a.length; _i++) {
                var i_1 = _a[_i];
                if (i_1.okolis == null) {
                    _this.izdSifra = i_1.sifra;
                    _this.izdIme = i_1.ime;
                    _this.izdPriimek = i_1.priimek;
                }
                else if (i_1.okolis != null) {
                    for (var _b = 0, _c = _this.delovniNalog.obisks; _b < _c.length; _b++) {
                        var b = _c[_b];
                        if (b.nadomestnaSestra != null) {
                            if (b.nadomestnaSestra.idzdravstveniDelavec != i_1.idzdravstveniDelavec) {
                                _this.sestraSifra = i_1.sifra;
                                _this.sestraOkolis = i_1.okolis.opis;
                                _this.sestraIme = i_1.ime;
                                _this.sestraPriimek = i_1.priimek;
                            }
                        }
                        else {
                            _this.sestraSifra = i_1.sifra;
                            _this.sestraOkolis = i_1.okolis.opis;
                            _this.sestraIme = i_1.ime;
                            _this.sestraPriimek = i_1.priimek;
                        }
                    }
                }
            }
            //pacient
            if (_this.delovniNalog.vrstaObiska.idvrstaObiska == 20 || _this.delovniNalog.vrstaObiska.idvrstaObiska == 30) {
                _this.aliJePraviObisk = true;
                //prvi pacient
                var stevec = 0;
                for (var _d = 0, _e = _this.delovniNalog.pacients; _d < _e.length; _d++) {
                    var pacients = _e[_d];
                    console.log(pacients);
                    console.log(pacients.telefonskaStevilka);
                    if (pacients.uporabnik != null) {
                        console.log("test");
                        _this.pacIme = pacients.ime;
                        _this.pacPriimek = pacients.priimek;
                        _this.pacSZZ = pacients.stevilkaZdravstvenegaZavarovanja;
                        _this.pacNaslov = pacients.ulica + " " + pacients.hisnaStevilka;
                        _this.pacDatumRojstva = pacients.datumRojstva;
                        _this.pacTelefon = pacients.telefonskaStevilka;
                        _this.pacPosta = pacients.uporabnik.email;
                    }
                    else {
                        _this.otroci[stevec].ime = pacients.ime;
                        _this.otroci[stevec].priimek = pacients.priimek;
                        _this.otroci[stevec].datumRojstva = pacients.datumRojstva;
                        _this.otroci[stevec].zz = pacients.stevilkaZdravstvenegaZavarovanja;
                        _this.otroci[stevec].naslov = pacients.ulica + " " + pacients.hisnaStevilka;
                        stevec = stevec + 1;
                    }
                }
            }
            else {
                console.log("hello");
                _this.aliJePraviObisk = false;
                _this.pacIme = _this.delovniNalog.pacients[0].ime;
                _this.pacPriimek = _this.delovniNalog.pacients[0].priimek;
                _this.pacSZZ = _this.delovniNalog.pacients[0].stevilkaZdravstvenegaZavarovanja;
                _this.pacNaslov = _this.delovniNalog.pacients[0].ulica + " " + _this.delovniNalog.pacients[0].hisnaStevilka;
                _this.pacDatumRojstva = _this.delovniNalog.pacients[0].datumRojstva;
                _this.pacTelefon = _this.delovniNalog.pacients[0].telefonskaStevilka;
                _this.pacPosta = _this.delovniNalog.pacients[0].uporabnik.email;
            }
            //obiski
            var j = 0;
            for (var _f = 0, _g = _this.delovniNalog.obisks; _f < _g.length; _f++) {
                var i_2 = _g[_f];
                var novObisk = ({ 'datumObiska': '', 'fiksniDatum': '', 'opravljen': '', 'dejanskiDatum': '', 'nadomescanje': '' });
                if (i_2.nadomestnaSestra != null) {
                    novObisk.nadomescanje = i_2.nadomestnaSestra.ime + " " + i_2.nadomestnaSestra.priimek + " [" + i_2.nadomestnaSestra.sifra + "]";
                }
                else {
                    novObisk.nadomescanje = 'ni nadomeščanja';
                }
                novObisk.datumObiska = i_2.datumObiska;
                novObisk.dejanskiDatum = i_2.dejanskiDatumObiska;
                if (i_2.opravljen == 0) {
                    novObisk.opravljen = 'Neopravljen';
                }
                else {
                    novObisk.opravljen = 'Opravljen';
                }
                if (i_2.fixenDatum == 1) {
                    novObisk.fiksniDatum = 'Ne';
                }
                else {
                    novObisk.fiksniDatum = 'Da';
                }
                //novObisk.
                _this.obiskiDatumi[j] = novObisk;
                j = j + 1;
            }
            //bubble sort za sortiranje datume obiskov
            for (var i = 0; i < _this.obiskiDatumi.length - 1; i++) {
                for (var x = 0; x < _this.obiskiDatumi.length - 1; x++) {
                    var parts = _this.obiskiDatumi[x].datumObiska.split('-');
                    var prvi = parts[0] + parts[1] + parts[2];
                    parts = _this.obiskiDatumi[x + 1].datumObiska.split('-');
                    var drugi = parts[0] + parts[1] + parts[2];
                    if (Number(prvi) > Number(drugi)) {
                        var theGreater = _this.obiskiDatumi[x];
                        _this.obiskiDatumi[x] = _this.obiskiDatumi[x + 1];
                        _this.obiskiDatumi[x + 1] = theGreater;
                    }
                }
            }
            _this.obiskVrstaStoritve = _this.delovniNalog.vrstaObiska.opis;
            //material če je prava vrsta obiska
            if (_this.delovniNalog.vrstaObiska.idvrstaObiska == 60) {
                j = 0;
                _this.aliJeOdvzemKrvi = true;
                for (var _h = 0, _j = _this.delovniNalog.materials; _h < _j.length; _h++) {
                    var i_3 = _j[_h];
                    var novMaterial = ({ 'tipMateriala': '', 'kolicina': 0 });
                    novMaterial.tipMateriala = i_3.opis;
                    novMaterial.kolicina = _this.delovniNalog.steviloEpruvet;
                    _this.material[j] = novMaterial;
                    j = j + 1;
                }
            }
            else if (_this.delovniNalog.vrstaObiska.idvrstaObiska == 50) {
                j = 0;
                _this.aliJeInjekcija = true;
                _this.obiskBolezen = _this.delovniNalog.bolezen.opis;
                for (var _k = 0, _l = _this.delovniNalog.zdravilos; _k < _l.length; _k++) {
                    var i_4 = _l[_k];
                    var novZdravilo = ({ 'idZdravila': 0, 'tipZdravila': '' });
                    novZdravilo.idZdravila = i_4.idzdravilo;
                    novZdravilo.tipZdravila = i_4.opis;
                    _this.zdravila[j] = novZdravilo;
                    j = j + 1;
                }
            }
        }, function (err) { console.log(err); });
    };
    return podrobnostiDNComponent;
}());
podrobnostiDNComponent = __decorate([
    core_1.Component({
        selector: 'podrobnosti',
        templateUrl: './podrobnostiDN.component.html',
        styleUrls: ['./podrobnostiDN.component.css']
    }),
    __metadata("design:paramtypes", [router_1.Router, http_1.Http, izpisDN_service_1.izpisDNService, router_1.ActivatedRoute, common_1.Location])
], podrobnostiDNComponent);
exports.podrobnostiDNComponent = podrobnostiDNComponent;
//# sourceMappingURL=podrobnostiDN.component.js.map