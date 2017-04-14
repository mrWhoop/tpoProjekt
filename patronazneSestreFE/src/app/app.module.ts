import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {FormsModule}   from '@angular/forms'; // <-- NgModel lives here
import { HttpModule }    from '@angular/http';

import { DashboardComponent } from './dashboard/dashboard.component';
import { PrijavaComponent } from './prijava/prijava.component';
import { RegistracijaFormComponent } from './registracija/registracija.component';
import { DelovniNalogComponent } from './delovniNalog/delovniNalog.component';
import { PageNotFoundComponent } from './not-found.component';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent }  from './app.component';
import { EqualValidator } from './equal-validator.directive';

import {UporabnikService} from "./RESTServices/uporabnik.service";
import {UserService} from "./user.service";
import {PacientGuard} from "./_guard/pacient.guard";
import {ZdravnikGuard} from "./_guard/zdravnik.guard";
import {PatronaznaSluzbaGuard} from "./_guard/patronaznasluzba.guard";
import {PatronaznaSestraGuard} from "./_guard/patronaznasestra.guard";
import {AdministratorGuard} from "./_guard/administrator.guard";
import {SodelavecIZSGuard} from "./_guard/sodelavecizs.guard";
import {Registracija_zdComponent} from "./registracija_zd/registracija_zd.component";
<<<<<<< HEAD
import { LocalStorageModule } from 'angular-2-local-storage';
=======
import {SpremembaGeslaComponent} from "./spremembaGesla.component";
>>>>>>> c47e64f64fb0c4e10b900ae99a5b38e6357c0093

@NgModule({
  imports:      [ BrowserModule,FormsModule,HttpModule,AppRoutingModule,LocalStorageModule.withConfig({
            prefix: 'my-app',
			storageType: 'localStorage'
            //storageType: 'sessionStorage'
        }) ],
  declarations: [ AppComponent,DashboardComponent,PrijavaComponent,RegistracijaFormComponent,
                  DelovniNalogComponent, EqualValidator,PageNotFoundComponent,Registracija_zdComponent
                  ,SpremembaGeslaComponent
                ],
  providers:    [ UserService,PacientGuard,ZdravnikGuard,PatronaznaSluzbaGuard,
                  PatronaznaSestraGuard,AdministratorGuard,SodelavecIZSGuard,UporabnikService,
                ],
  bootstrap:    [ AppComponent ]
})
export class AppModule {

}
