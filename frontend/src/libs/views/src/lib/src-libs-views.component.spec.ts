import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SrcLibsViewsComponent } from './src-libs-views.component';

describe('SrcLibsViewsComponent', () => {
  let component: SrcLibsViewsComponent;
  let fixture: ComponentFixture<SrcLibsViewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SrcLibsViewsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SrcLibsViewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
