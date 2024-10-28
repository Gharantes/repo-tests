import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SrcLibsRoutesComponent } from './src-libs-routes.component';

describe('SrcLibsRoutesComponent', () => {
  let component: SrcLibsRoutesComponent;
  let fixture: ComponentFixture<SrcLibsRoutesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SrcLibsRoutesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SrcLibsRoutesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
