import { fakeAsync, tick } from "@angular/core/testing";

fdescribe("Async example testing", () => {
  it("Asynchronous test example with jasmine done()", (done: DoneFn) => {
    let test = false;
    setTimeout(() => {
      console.log("running assertions");
      test = true;
      expect(test).toBeTruthy();
      done();
    }, 1000);
  });

  it("Asynchronous test example with set timeout", fakeAsync(() => {
    let test = false;

    setTimeout(() => {
      console.log("Hit");
      test = true;
      expect(test).toBeTruthy();
    }, 1000);

    tick(1000);
  }));
});
