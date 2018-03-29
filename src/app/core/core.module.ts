import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';

import { TargetsModule } from '../targets';
import { ChartsModule } from '../charts';

import { CoreRoutingModule } from './core-routing.module';

// PrimeNG modules
import { SplitButtonModule } from 'primeng/splitbutton';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { BreadcrumbModule } from 'primeng/breadcrumb';

import {
    TableModule
} from 'primeng/table';

// Other third-party modules
import { NgSelectModule } from '@ng-select/ng-select';

// Backend modules and extra config
import { environment, ENV_FIREBASE_CONFIG } from 'environments/environment';
import { AngularFireModule } from 'angularfire2';

export const firebaseConfig = ENV_FIREBASE_CONFIG;

import {
    AuthGuardService,
    AuthenticationService,
    BreadcrumbService,
    ColorService,
    GeneService,
    DataService
} from './services';

import { AboutComponent } from './about';
import { BreadcrumbComponent } from './breadcrumb';
import { DashboardComponent } from './dashboard';
import { NavbarComponent } from './navbar';
import { NoContentComponent } from './no-content';
//import { LoginComponent } from './login/login.component';

import '../../styles/styles.scss';
import '../../styles/headings.css';

@NgModule({
    imports: [
        CommonModule,
        CoreRoutingModule,
        // PrimeNG modules
        SplitButtonModule,
        MenuModule,
        MenubarModule,
        BreadcrumbModule,
        // Other third-party modules
        NgSelectModule,
        AngularFireModule.initializeApp(firebaseConfig),
        // Feature Modules
        TargetsModule,
        ChartsModule
    ],
    declarations: [
        //LoginComponent,
        //HeaderComponent,
        //NotFoundComponent,
        AboutComponent,
        BreadcrumbComponent,
        DashboardComponent,
        NavbarComponent,
        NoContentComponent
    ],
    exports: [
        // Exported components
        BreadcrumbComponent,
        NavbarComponent
    ],
    providers: [
        AuthenticationService,
        AuthGuardService,
        BreadcrumbService,
        DataService,
        GeneService,
        ColorService,
        DecimalPipe
    ]
})
export class CoreModule { }