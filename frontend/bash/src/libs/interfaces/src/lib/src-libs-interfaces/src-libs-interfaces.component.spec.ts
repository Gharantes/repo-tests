import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SrcLibsInterfacesComponent } from './src-libs-interfaces.component';

describe('SrcLibsInterfacesComponent', () => {
  let component: SrcLibsInterfacesComponent;
  let fixture: ComponentFixture<SrcLibsInterfacesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SrcLibsInterfacesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SrcLibsInterfacesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
