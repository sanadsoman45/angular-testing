import { waitForAsync, ComponentFixture, TestBed } from "@angular/core/testing";
import { CoursesModule } from "../courses.module";
import { DebugElement } from "@angular/core";
import { HomeComponent } from "./home.component";
import { CoursesService } from "../services/courses.service";
import { setupCourses } from "../common/setup-test-data";
import { Observable, of } from "rxjs";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { By } from "@angular/platform-browser";
import { Course } from "../model/course";
import { COURSES } from "../../../../server/db-data";
import { trim } from "cypress/types/lodash";
import { click } from "../common/test-utils";

describe("HomeComponent", () => {
  let fixture: ComponentFixture<HomeComponent>;
  let component: HomeComponent;
  let el: DebugElement;
  let coursesService: jasmine.SpyObj<CoursesService>; // Ensure coursesService is a Spy
  const beginnerCoursesObs: Observable<Course[]> = of(
    setupCourses().filter((course) => course.category === "BEGINNER")
  );
  const advancedCoursesObs: Observable<Course[]> = of(
    setupCourses().filter((course) => course.category === "ADVANCED")
  );

  beforeEach(waitForAsync(() => {
    const coursesServiceSpy = jasmine.createSpyObj<CoursesService>(
      "CoursesService",
      ["findAllCourses"]
    );

    TestBed.configureTestingModule({
      imports: [CoursesModule, NoopAnimationsModule],
      providers: [{ provide: CoursesService, useValue: coursesServiceSpy }],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(HomeComponent);
        component = fixture.componentInstance;
        el = fixture.debugElement;
        coursesService = TestBed.inject(
          CoursesService
        ) as jasmine.SpyObj<CoursesService>;
      });
  }));

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });

  it("should display only beginner courses", () => {
    coursesService.findAllCourses.and.returnValue(beginnerCoursesObs);
    fixture.detectChanges();

    const tabs = el.queryAll(By.css(".mdc-tab"));
    expect(tabs.length).toEqual(1, "Only 1 tab expected");
  });

  it("should display only advanced courses", () => {
    coursesService.findAllCourses.and.returnValue(advancedCoursesObs);
    fixture.detectChanges();
    const tabs = el.queryAll(By.css(".mdc-tab"));
    expect(tabs.length).toEqual(1, "Only Advanced tab is expected");
    const tabText = tabs[0].nativeElement.textContent.trim();
    expect(tabText).toEqual("Advanced", "Tab should display 'Advanced'");
  });

  it("should display both tabs", () => {
    coursesService.findAllCourses.and.returnValue(of(setupCourses()));
    fixture.detectChanges();
    const tabs = el.queryAll(By.css(".mdc-tab"));
    expect(tabs.length).toEqual(2, "Should contain only 2 tabs.");
    const tabTexts = tabs.map((tab) => tab.nativeElement.textContent.trim());
    expect(tabTexts).toContain("Beginners", "One tab should be 'Beginner'");
    expect(tabTexts).toContain("Advanced", "One tab should be 'Advanced'");
  });

  it("should display advanced courses when tab clicked - async", waitForAsync(() => {

    coursesService.findAllCourses.and.returnValue(of(setupCourses()));

    fixture.detectChanges();

    const tabs = el.queryAll(By.css(".mdc-tab"));

    click(tabs[1]);

    fixture.detectChanges();

    fixture.whenStable().then(() => {

        console.log("called whenStable() ");

        const cardTitles = el.queryAll(By.css('.mat-mdc-tab-body-active .mat-mdc-card-title'));

        expect(cardTitles.length).toBeGreaterThan(0,"Could not find card titles");

        expect(cardTitles[0].nativeElement.textContent).toContain("Angular Security Course");

    });

}));
});
