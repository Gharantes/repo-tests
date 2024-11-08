import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExtraRouteComponent } from './extra-route.component';

describe('ExtraViewComponent', () => {
  let component: ExtraRouteComponent;
  let fixture: ComponentFixture<ExtraRouteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExtraRouteComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ExtraRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
