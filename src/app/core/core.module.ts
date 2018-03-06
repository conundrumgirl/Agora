import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TargetsModule } from './targets';
import { ChartsModule } from './charts';

import { CoreRoutingModule } from './core-routing.module';
//import { LoginComponent } from './login/login.component';

import {
    AuthGuardService,
    AuthenticationService,
    BreadcrumbService
} from './services';

import { AboutComponent } from './about';
import { BreadcrumbComponent } from './breadcrumb';
import { DashboardComponent } from './dashboard';
import { NavbarComponent } from './navbar';
import { NoContentComponent } from './no-content';

// PrimeNG modules
import {
    SplitButtonModule,
    MenuModule,
    MenubarModule,
    BreadcrumbModule,
    PanelModule,
    DataTableModule,
    ButtonModule,
    DataGridModule,
    SharedModule,
    GrowlModule,
    TabViewModule
} from 'primeng/primeng';

import {
    TableModule
} from 'primeng/table';

// Other third-party modules
import { PapaParseModule } from 'ngx-papaparse';
import { NgSelectModule } from '@ng-select/ng-select';

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
        PanelModule,
        DataTableModule,
        ButtonModule,
        DataGridModule,
        SharedModule,
        GrowlModule,
        TabViewModule,
        TableModule,
        // Other third-party modules
        PapaParseModule,
        NgSelectModule
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
        BreadcrumbService
    ]
})
export class CoreModule { }