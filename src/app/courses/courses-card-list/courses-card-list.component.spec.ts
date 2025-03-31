import { CoursesCardListComponent } from "./courses-card-list.component";
import { CoursesModule } from "../courses.module";
import { COURSES } from "../../../../server/db-data";
import { DebugElement } from "@angular/core";
import { By } from "@angular/platform-browser";
import { sortCoursesBySeqNo } from "../home/sort-course-by-seq";
import { Course } from "../model/course";
import { setupCourses } from "../common/setup-test-data";
import { waitForAsync, ComponentFixture, TestBed } from "@angular/core/testing";

describe("CoursesCardListComponent", () => {
  let component: CoursesCardListComponent;
  let fixture: ComponentFixture<CoursesCardListComponent>;
  let el: DebugElement;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [CoursesModule],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(CoursesCardListComponent);
        component = fixture.componentInstance;
        el = fixture.debugElement;
      });
  }));

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });

  it("should display the course list", () => {
    component.courses = setupCourses();
    fixture.detectChanges();
    const cards = el.queryAll(By.css('.course-card'));
    expect(cards).toBeTruthy('Cards cannot be found.');
    expect(cards.length).toBe(12, 'Unexpected number of records');
  });

  it("should display the first course", () => {
    component.courses = setupCourses();
    fixture.detectChanges();
    const course = component.courses[0];// first course.
    const card = el.query(By.css('.course-card:first-child'));
    const cardTitle = card.query(By.css('mat-card-title'));
    const cardImage = card.query(By.css('img'));
    expect(card).toBeTruthy('Cards cannot be Found.');
    expect(cardTitle.nativeElement.textContent).toEqual(course.titles.description);
    expect(cardImage.nativeElement.src).toEqual(course.iconUrl);
  });
});
