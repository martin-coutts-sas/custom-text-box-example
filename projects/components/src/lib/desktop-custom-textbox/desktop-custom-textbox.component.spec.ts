import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DesktopCustomTextboxComponent } from "./desktop-custom-textbox.component";

describe("DesktopCustomTextboxComponent", () => {
  let component: DesktopCustomTextboxComponent;
  let fixture: ComponentFixture<DesktopCustomTextboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DesktopCustomTextboxComponent ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DesktopCustomTextboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
