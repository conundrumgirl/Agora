import {
    Component,
    OnInit,
    Input,
    ViewEncapsulation,
    ViewChildren,
    ViewContainerRef,
    QueryList,
    ViewChild,
    ElementRef,
    AfterViewChecked
} from '@angular/core';
import { PlatformLocation } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

import { Gene, GeneInfo, GeneResponse } from '../../../../../models';

import { ChartService } from '../../../../../charts/services';
import {
    ApiService,
    GeneService
} from '../../../../../core/services';

import { SelectItem } from 'primeng/api';

import { Subscription } from 'rxjs';

@Component({
    selector: 'gene-rnaseq-de',
    templateUrl: './gene-rnaseq-de.component.html',
    styleUrls: [ './gene-rnaseq-de.component.scss' ],
    encapsulation: ViewEncapsulation.None
})
export class GeneRNASeqDEComponent implements OnInit, AfterViewChecked {
    @Input() styleClass: string = 'rnaseq-panel';
    @Input() style: any;
    @Input() gene: Gene;
    @Input() geneInfo: GeneInfo;
    @Input() id: string;
    @ViewChild('noDataMedian') noMedianEl: ElementRef;
    @ViewChildren('t', { read: ViewContainerRef }) entries: QueryList<ViewContainerRef>;
    tissues: SelectItem[] = [];
    models: SelectItem[] = [];
    emptySelection: SelectItem[] = [];
    currentTissues: string[] = [];
    selectedTissues: string[] = [];
    selectedModels: string[] = [];
    componentRefs: any[] = [];
    oldIndex: number = -1;
    index: number = -1;
    dropdownIconClass: string = 'fa fa-caret-down';
    emptySelectionLabel: string = '- - -';
    emptySelectionValue: string = '';
    dataLoaded: boolean = false;
    displayBPDia: boolean = false;
    displayBRDia2: boolean = false;
    isEmptyGene: boolean = true;
    isViewReady: boolean = false;
    canFilter: boolean = false;
    chartSubscription: Subscription;

    constructor(
        private router: Router,
        private apiService: ApiService,
        private geneService: GeneService,
        private chartService: ChartService,
        private location: PlatformLocation
    ) { }

    ngOnInit() {
        this.gene = this.geneService.getCurrentGene();
        this.geneInfo = this.geneService.getCurrentInfo();
        this.emptySelection.push({
            label: this.emptySelectionLabel,
            value: this.emptySelectionValue
        });

        this.location.onPopState(() => {
            this.isEmptyGene = true;
        });

        this.loadChartData().then((status) => {
            const rTissues = this.geneService.getGeneTissues().sort();
            rTissues.forEach((t) => {
                this.tissues.push({label: t.toUpperCase(), value: t});
            });
            const rModels = this.geneService.getGeneModels().sort();
            rModels.forEach((t) => {
                this.models.push({label: t.toUpperCase(), value: t});
            });
            const index = this.tissues.findIndex((t) => {
                return t.value === this.geneService.getDefaultTissue();
            });
            this.index = index;
            this.selectedTissues = (index !== -1) ?
                this.tissues.slice(index, index + 1).map((a) => a.value) :
                this.tissues.slice(0, 1).map((a) => a.value);
            this.geneService.setDefaultTissue(this.selectedTissues[0]);

            this.selectedModels = this.models.slice(0, 1).map((a) => a.value);

            this.geneService.setDefaultTissue(this.selectedTissues[0]);
            this.geneService.setDefaultModel(this.selectedModels[0]);

            this.geneService.updateEmptyGeneState();
            this.isEmptyGene = this.geneService.getEmptyGeneState();

            // First load of dimension and groups, set a default model so we don't load all the
            // data
            this.chartService.queryFilter.smGroup = 'AD Diagnosis (males and females)';
            this.apiService.refreshChart(
                this.chartService.queryFilter.smGroup,
                this.gene.hgnc_symbol
            ).subscribe((d) => {
                this.chartService.filteredData = d;
                this.dataLoaded = true;
            });
        });
    }

    ngAfterViewChecked() {
        this.isViewReady = true;
    }

    loadChartData(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.chartService.addChartInfo(
                'volcano-plot',
                {
                    dimension: ['logfc', 'adj_p_val', 'hgnc_symbol'],
                    group: 'self',
                    type: 'scatter-plot',
                    title: 'Volcano Plot',
                    xAxisLabel: 'Log Fold Change',
                    yAxisLabel: '-log10(Adjusted p-value)',
                    x: ['logfc'],
                    y: ['adj_p_val']
                }
            );
            this.chartService.addChartInfo(
                'forest-plot',
                {
                    dimension: ['tissue'],
                    group: 'self',
                    type: 'forest-plot',
                    title: 'Log fold forest plot',
                    filter: 'default',
                    attr: 'logfc'
                }
            );
            this.chartService.addChartInfo(
                'select-model',
                {
                    dimension: ['model'],
                    group: 'self',
                    type: 'select-menu',
                    title: '',
                    filter: 'default'
                }
            );
            this.registerBoxPlot(
                'box-plot',
                [
                    {
                        name: this.currentTissues[this.index],
                        attr: 'tissue'
                    },
                    {
                        name: this.geneService.getCurrentModel(),
                        attr: 'model'
                    }
                ],
                'log2(fold change)',
                'fc'
            );

            resolve(true);
        });
    }

    getTissue(index: number) {
        return this.geneService.getGeneTissues()[index];
    }

    getModel(index: number) {
        return this.geneService.getGeneModels()[index];
    }

    getDefaultLabel(): string {
        return this.geneService.getDefaultTissue() ||
            (this.tissues.length ? this.tissues[0].value : '');
    }

    toggleTissueModel() {
        // Update the current gene for this tissue
        this.apiService.getGene(
            this.gene.ensembl_gene_id,
            this.geneService.getCurrentTissue(),
            this.geneService.getCurrentModel()
        ).subscribe(
            (data: GeneResponse) => {
                if (!data.info) {
                    this.router.navigate(['/genes']);
                } else {
                    if (!data.item) {
                        // Fill in a new gene with the info attributes
                        data.item = this.geneService.getEmptyGene(
                            data.info.ensembl_gene_id, data.info.hgnc_symbol
                        );
                    }
                }

                this.geneService.updateGeneData(data);
                this.gene = data.item;
            }, (error) => {
                console.log('Error getting gene: ' + error.message);
            }, () => {
                // Check if we have a database id at this point
                if (this.gene && this.gene._id) {
                    this.geneService.setCurrentTissue(this.gene.tissue);
                    this.geneService.setCurrentModel(this.gene.model);
                } else {
                    this.geneService.updateEmptyGeneState();
                    this.isEmptyGene = this.geneService.getEmptyGeneState();
                }
            }
        );
    }

    getDownloadFileName(suffix: string): string {
        return this.gene.hgnc_symbol + ' ' + suffix + '_' + this.geneService.getCurrentModel();
    }

    registerBoxPlot(label: string, constraints: any[], yAxisLabel: string, attr: string) {
        this.chartService.addChartInfo(
            label,
            {
                dimension: ['tissue', 'model'],
                group: 'self',
                type: 'box-plot',
                title: '',
                filter: 'default',
                xAxisLabel: '',
                yAxisLabel,
                format: 'array',
                attr,
                constraints
            }
        );
    }

    destroyComponent(index: number) {
        this.componentRefs[index].destroy();
    }

    openDropdown() {
        this.dropdownIconClass = 'fa fa-caret-up';
    }

    closeDropdown() {
        this.dropdownIconClass = 'fa fa-caret-down';
    }

    getDropdownIcon(): string {
        return this.dropdownIconClass;
    }

    showDialog(dialogString: string) {
        this[dialogString] = true;
    }
}
