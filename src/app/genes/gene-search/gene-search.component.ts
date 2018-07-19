import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import { EmptyObservable } from 'rxjs/observable/EmptyObservable';

import { Gene, GeneInfo } from '../../models';

import {
    GeneService,
    DataService
} from '../../core/services';

@Component({
    selector: 'gene-search',
    templateUrl: './gene-search.component.html',
    styleUrls: [ './gene-search.component.scss' ],
    encapsulation: ViewEncapsulation.None
})
export class GeneSearchComponent implements OnInit {
    @Input() fname: string;
    @Input() styleClass: string = '';
    @Input() style: any;
    @Input() infos: Gene[];
    queryField: FormControl = new FormControl();
    results: GeneInfo[] = [];
    hasFocus: boolean = false;
    gene: Gene;

    constructor(
        private router: Router,
        private dataService: DataService,
        private geneService: GeneService
    ) { }

    ngOnInit() {
        this.queryField.valueChanges
            .debounceTime(300)
            .distinctUntilChanged()
            .switchMap((query) => {
                if (query) {
                    return this.search(query);
                } else {
                    this.results = [];
                    return new EmptyObservable<Response>();
                }
            })
            .subscribe((data) => {
                this.results = (data['items']) ? data['items'] as GeneInfo[] : [];
            });
    }

    search(queryString: string) {
        if (queryString) { return this.dataService.getGenesMatchId(queryString); }
    }

    focusSearchList(state: boolean) {
        this.hasFocus = state;
    }

    closeSearchList(event: any) {
        if (!this.hasFocus) { this.results = []; }
    }

    getGeneId() {
        return this.gene.hgnc_symbol;
    }

    viewGene(info: GeneInfo) {
        let geneData: any;
        this.dataService.getGene(info.hgnc_symbol).subscribe((data) => {
            if (!data['item']) { this.router.navigate(['/genes']); }
            geneData = data;
        }, (error) => {
            console.log('Routing error! ' + error.message);
        }, () => {
            this.geneService.updateGeneData(geneData);
            this.gene = geneData['item'];
            this.router.navigate([
                '/genes',
                { outlets: {'genes-router': [ 'gene-details', this.gene.ensembl_gene_id ] }}
            ]);
        });
    }
}