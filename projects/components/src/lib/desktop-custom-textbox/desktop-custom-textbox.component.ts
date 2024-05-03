import { Component, OnInit, Input, ChangeDetectorRef, OnDestroy, Injector } from "@angular/core";
import { Control, ControlMemberApi, FieldValue, NumericRestrictions } from "@sassoftware/vi-api/control";
import { PageModel } from "@sassoftware/vi-api/page-model";
import { CustomTextboxService } from "../shared/custom-textbox.service";

@Component({
  selector: "sol-desktop-custom-textbox",
  templateUrl: "./desktop-custom-textbox.component.html",
  styleUrls: ["./desktop-custom-textbox.component.scss"]
})
export class DesktopCustomTextboxComponent implements OnInit, OnDestroy {
  @Input() childNode!: Control;
  @Input() pageModel!: PageModel;
  @Input() controlApi!: ControlMemberApi;
  #removeOnPropertyChange = () => {};
  #cd: ChangeDetectorRef;
  #customTextboxService: CustomTextboxService;
  isMultiLine = false;

  get inView() {
    return this.controlApi.page.getMode() === "view";
  }

  get required() {
    return this.controlApi.control.state.required;
  }

  get readOnly() {
    return this.controlApi.control.state.readOnly;
  }

  get disabled() {
    return this.controlApi.control.state.disabled;
  }

  get fieldValue() {
    return this.controlApi.control.getFieldValue()?.toString() || "";
  }

  set fieldValue(value: string) {
    this.controlApi.control.setFieldValue(value);
  }

  get rows() {
    const multiLineRows = 5;
    const rows = this.isMultiLine ? multiLineRows : 1;
    return rows;
  }

  constructor(injector: Injector) {
    this.#cd = injector.get(ChangeDetectorRef);
    this.#customTextboxService = injector.get(CustomTextboxService);
  }

  ngOnInit() {
    this.#getDefaultValue();
    this.controlApi.control.setFieldValue(this.#getDefaultValue());

    this.controlApi.page.onChange((change) => {
      if (change.type === "mode") {
        this.#cd.detectChanges();
      }
    });

    this.#removeOnPropertyChange = this.controlApi.page.onPropertyChange((category, property, currentValue) => {
      if (category === "typeAttributes" && property === "multiLine") {
        this.isMultiLine = currentValue;
      }
    });

    console.log("ON INIT", this);
  }

  ngOnDestroy() {
    this.#removeOnPropertyChange();
  }

  /**
   * Gets the default value for the control, stripping CR/LFs if this isn't a multi-line control.
   * @return the default value for the control.
   */
  #getDefaultValue() {
    // TODO!: This throws an error if string restrictions as fieldDataType apparently does not exist on StringRestrictions This is an issue we should address.
    const fieldDataType = (this.controlApi.control.getFieldRestrictions() as NumericRestrictions).fieldDataType;
    const defaultValue: FieldValue | undefined = this.childNode?.typeAttributes.defaultValue;
    return this.#customTextboxService.getDefaultValue(fieldDataType, defaultValue, this.isMultiLine);
  }

  /**
   * Takes the value from the event and applies it to the page, ensuring the value is in the correct type for the field.
   * @param event The input event.
   */
  onInput(eventTarget: EventTarget | null) {
    const value = this.#customTextboxService.onInput(eventTarget);
    this.fieldValue = value;
  }

  /**
   * Handles the paste event. Ensures that newlines and carriage-returns are stripped if we're single-line.
   * @param event Browser clipboard event.
   */
  handlePaste(event: ClipboardEvent) {
    this.#customTextboxService.handlePaste(event, this.isMultiLine);
  }

  /**
   * Handles the Enter keypress event. Ensures that enter key does nothing if we're single-line.
   * @param event Browser keyboard event for "Enter" keypress.
   */
  handleEnter(event: Event) {
    this.#customTextboxService.handleEnter(event, this.isMultiLine);
  }
}
