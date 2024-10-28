import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SrcLibsComponentsTablesComponent } from './src-libs-components-tables.component';

describe('SrcLibsComponentsTablesComponent', () => {
  let component: SrcLibsComponentsTablesComponent;
  let fixture: ComponentFixture<SrcLibsComponentsTablesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SrcLibsComponentsTablesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SrcLibsComponentsTablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
