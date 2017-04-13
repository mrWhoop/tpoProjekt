import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms'; // <-- NgModel lives here
import { HttpModule }    from '@angular/http';

import { DashboardComponent } from './dashboard.component';
import { PrijavaComponent } from './prijava.component';
import { RegistracijaFormComponent } from './registracija.component';
import { DelovniNalogComponent } from './delovniNalog.component';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent }  from './app.component';
import { EqualValidator } from './equal-validator.directive';
//import { CustomFormsModule } from 'ng2-validation';
//import { AclService } from './angular2-acl';
import {UserService} from "./user.service";
import {PacientGuard} from "./guard/pacient.guard";
import {ZdravnikGuard} from "./guard/zdravnik.guard";
import {PatronaznaSluzbaGuard} from "./guard/patronaznasluzba.guard";
import {PatronaznaSestraGuard} from "./guard/patronaznasestra.guard";
import {AdministratorGuard} from "./guard/administrator.guard";
import {SodelavecIZSGuard} from "./guard/sodelavecizs.guard";

@NgModule({
  imports:      [ BrowserModule,FormsModule,HttpModule,AppRoutingModule ],
  declarations: [ AppComponent,DashboardComponent,PrijavaComponent,RegistracijaFormComponent,
                  DelovniNalogComponent, EqualValidator
                ],
  providers:    [ UserService,PacientGuard,ZdravnikGuard,PatronaznaSluzbaGuard,
                  PatronaznaSestraGuard,AdministratorGuard,SodelavecIZSGuard
                ],
  bootstrap:    [ AppComponent ]
})
export class AppModule {

}
