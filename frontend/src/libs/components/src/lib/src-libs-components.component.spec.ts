import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SrcLibsComponentsComponent } from './src-libs-components.component';

describe('SrcLibsComponentsComponent', () => {
  let component: SrcLibsComponentsComponent;
  let fixture: ComponentFixture<SrcLibsComponentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SrcLibsComponentsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SrcLibsComponentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
