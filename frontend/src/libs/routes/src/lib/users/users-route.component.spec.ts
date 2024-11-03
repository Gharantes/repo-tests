import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsersRouteComponent } from './users-route.component';

describe('UsersComponent', () => {
  let component: UsersRouteComponent;
  let fixture: ComponentFixture<UsersRouteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersRouteComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UsersRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
