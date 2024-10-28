import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SrcLibsComponentsUiComponent } from './src-libs-components-ui.component';

describe('SrcLibsComponentsUiComponent', () => {
  let component: SrcLibsComponentsUiComponent;
  let fixture: ComponentFixture<SrcLibsComponentsUiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SrcLibsComponentsUiComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SrcLibsComponentsUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
