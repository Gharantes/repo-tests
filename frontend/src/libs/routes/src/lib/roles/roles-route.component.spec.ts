import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RolesRouteComponent } from './roles-route.component';

describe('RolesComponent', () => {
  let component: RolesRouteComponent;
  let fixture: ComponentFixture<RolesRouteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RolesRouteComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RolesRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
