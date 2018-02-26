import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TargetsRoutingModule } from './targets-routing.module';
import { AppSharedModule } from '../shared';

import {
    SharedModule,
    PanelModule,
    ButtonModule,
    GrowlModule
} from 'primeng/primeng';

import { TableModule } from 'primeng/table';

import { TargetsViewComponent } from './targets-view';
import { TargetsListComponent } from './targets-list';
import { DetailsViewComponent } from './details/details-view';

import { GeneService } from './services';

import { PapaParseModule } from 'ngx-papaparse';

@NgModule({
    declarations: [
        TargetsViewComponent,
        TargetsListComponent,
        DetailsViewComponent
    ],
    imports: [
        CommonModule,
        AppSharedModule.forRoot(),
        TargetsRoutingModule,
        // PrimeNG modules
        SharedModule,
        PanelModule,
        ButtonModule,
        GrowlModule,
        TableModule,
        // Other third party modules
        PapaParseModule
    ],
    providers: [
        GeneService
    ]
})
// Changed the name so it does not conflict with primeng module
export class TargetsModule {}