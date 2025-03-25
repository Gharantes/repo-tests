import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SrcLibsAbstractsComponent } from './src-libs-abstracts.component';

describe('SrcLibsAbstractsComponent', () => {
  let component: SrcLibsAbstractsComponent;
  let fixture: ComponentFixture<SrcLibsAbstractsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SrcLibsAbstractsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SrcLibsAbstractsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
