import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsComponent } from './';

describe('Component: Footer', () => {
    let component: NewsComponent;
    let fixture: ComponentFixture<NewsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                NewsComponent
            ]
        })
        .compileComponents();

        fixture = TestBed.createComponent(NewsComponent);
        component = fixture.componentInstance;
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
