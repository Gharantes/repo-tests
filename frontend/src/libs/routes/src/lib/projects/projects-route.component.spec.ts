import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectsRouteComponent } from './list-projects/projects-route.component';

describe('ProjectsComponent', () => {
  let component: ProjectsRouteComponent;
  let fixture: ComponentFixture<ProjectsRouteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectsRouteComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectsRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
