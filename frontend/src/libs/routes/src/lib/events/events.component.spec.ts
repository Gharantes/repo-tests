import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventsRouteComponent } from './list-events/events-route.component';

describe('EventsComponent', () => {
  let component: EventsRouteComponent;
  let fixture: ComponentFixture<EventsRouteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventsRouteComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EventsRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
