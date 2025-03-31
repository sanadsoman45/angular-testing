import { TestBed } from "@angular/core/testing";
import { CoursesService } from "./courses.service";
import { HttpErrorResponse, provideHttpClient } from "@angular/common/http";
import {
  HttpTestingController,
  provideHttpClientTesting,
} from "@angular/common/http/testing";
import { COURSES, findLessonsForCourse, LESSONS } from "../../../../server/db-data";
import { Course } from "../model/course";

describe("Courses Service", () => {
  let coursesService: CoursesService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CoursesService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    coursesService = TestBed.inject(CoursesService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it("should find course by id", () => {
    coursesService.findCourseById(12).subscribe({
      next: (data) => {
        expect(data).toBeTruthy();
        expect(data.id).toEqual(12, "Course Id should be 12");
      },
    });

    const req = httpTestingController.expectOne(`/api/courses/${12}`);
    expect(req.request.method).toEqual("GET");
    req.flush(COURSES[12]);
  });

  it("Should retrieve all courses", () => {
    coursesService.findAllCourses().subscribe({
      next: (data) => {
        expect(data).toBeTruthy("No Courses Found");
        expect(data.length).toEqual(12, "incorrect number of courses");
        const course = data.find((course) => course.id === 12);
        expect(course.titles.description).toBe("Angular Testing Course");
      },
    });

    const req = httpTestingController.expectOne("/api/courses");
    expect(req.request.method).toEqual("GET");
    req.flush({ payload: Object.values(COURSES) });
  });

  it("should save the course", () => {
    const changes: Partial<Course> = {
      titles: { description: "testing Course" },
    };

    coursesService.saveCourse(12, changes).subscribe({
      next: (course) => {
        expect(course.id).toBe(12);
      },
    });

    const request = httpTestingController.expectOne("/api/courses/12");
    expect(request.request.method).toEqual("PUT");
    expect(request.request.body.titles.description).toEqual(
      changes.titles.description
    );
    request.flush({
      ...COURSES[12],
      ...changes,
    });
  });

  it("should give an error if save failed", () => {
    const changes: Partial<Course> = {
      titles: { description: "testing Course" },
    };

    coursesService.saveCourse(12, changes).subscribe({
      next: (data) => {
        fail("save course failed");
      },
      error: (error: HttpErrorResponse) => {
        expect(error.status).toBe(500);
      },
    });
    const request = httpTestingController.expectOne("/api/courses/12");
    expect(request.request.method).toEqual("PUT");
    request.flush("Save Course Failed", {
      status: 500,
      statusText: "Internal Server Error",
    });
  });

  it("find lessons", ()=>{
    coursesService.findLessons(12).subscribe({
        next:(lessons)=>{
            expect(lessons).toBeTruthy();
            expect(lessons.length).toEqual(3);
        }
    })

    const req = httpTestingController.expectOne(req => req.url === '/api/lessons'); 
    expect(req.request.method).toEqual('GET');
    expect(req.request.params.get("courseId")).toEqual("12");
    expect(req.request.params.get("filter")).toEqual("");
    expect(req.request.params.get("sortOrder")).toEqual("asc");
    expect(req.request.params.get("pageNumber")).toEqual("0");
    expect(req.request.params.get("pageSize")).toEqual("3");
    req.flush({
        payload:findLessonsForCourse(12).slice(0,3)
    })
  })

  afterEach(() => {
    httpTestingController.verify();
  });
});
