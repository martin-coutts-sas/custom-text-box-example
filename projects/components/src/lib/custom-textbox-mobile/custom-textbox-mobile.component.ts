import {
  Component,
  OnInit,
  Input,
  HostListener,
  ChangeDetectorRef,
  OnDestroy,
  Renderer2,
  Injector,
  ElementRef
} from "@angular/core";
import { SmiControlApi, isMobileControlApi } from "@sassoftware/mobile-investigator";
import { ControlMemberApi as DesktopApi } from "@sassoftware/vi-api/control/control-api";
import { Control, TypeAttributes, FieldValue } from "@sassoftware/vi-api/control";
import { CustomTextboxService } from "../shared/custom-textbox.service";

@Component({
  selector: "mobile-sol-custom-textbox",
  templateUrl: "./custom-textbox-mobile.component.html",
  styleUrls: ["./custom-textbox-mobile.component.scss"]
})
export class CustomTextboxComponent implements OnInit, OnDestroy {
  @Input() controlApi!: SmiControlApi<TypeAttributes, any> | DesktopApi<TypeAttributes, never>;
  control?: Control<TypeAttributes>;
  #cd: ChangeDetectorRef;
  #renderer: Renderer2;
  #el: ElementRef;
  #customTextboxService: CustomTextboxService;
  #removeOnUnmask = () => {};
  #removeOnMask = () => {};
  #removeOnPropertyChange = () => {};
  isMultiLine = false;

  constructor(injector: Injector) {
    this.#cd = injector.get(ChangeDetectorRef);
    this.#renderer = injector.get(Renderer2);
    this.#el = injector.get(ElementRef);
    this.#customTextboxService = injector.get(CustomTextboxService);
  }

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

  get uuid() {
    if (isMobileControlApi(this.controlApi)) {
      return this.controlApi.control.uuid;
    } else return null;
  }

  get fieldValue() {
    return this.controlApi.control.getFieldValue()?.toString() || "";
  }

  get inAdmin() {
    return !isMobileControlApi(this.controlApi);
  }

  set fieldValue(value: string) {
    if (isMobileControlApi(this.controlApi)) {
      this.controlApi.control.setFieldValue(value);
    }
  }

  get isMasked() {
    if (isMobileControlApi(this.controlApi)) {
      return this.controlApi.control.isMasked();
    } else {
      return false;
    }
  }

  get rows() {
    const multiLineRows = 5;
    const rows = this.isMultiLine ? multiLineRows : 1;
    return rows;
  }

  ngOnInit() {
    if (isMobileControlApi(this.controlApi)) {
      this.control = this.controlApi.control.getControl();
      this.controlApi.control.applyDefaultFieldValue(this.#getDefaultValue());
      this.#removeOnMask = this.controlApi.control.onMask(() => {
        this.#cd.detectChanges();
      });
      this.#removeOnUnmask = this.controlApi.control.onUnmask(() => {
        this.#cd.detectChanges();
      });
    } else {
      // When a mobile control is in admin this class is used for applying specific styles.
      this.#renderer.addClass(this.#el.nativeElement, "admin");
      this.control = this.controlApi.control.getControl();
      this.#removeOnPropertyChange = this.controlApi.page.onPropertyChange((category, property, currentValue) => {
        if (category === "typeAttributes" && property === "multiLine") {
          this.isMultiLine = currentValue;
        }
      });
    }

    this.isMultiLine = this.control.typeAttributes.multiLine;
  }

  ngOnDestroy() {
    this.#removeOnMask();
    this.#removeOnUnmask();
    this.#removeOnPropertyChange();
  }

  /**
   * Gets the default value for the control, stripping CR/LFs if this isn't a multi-line control.
   * @return the default value for the control.
   */
  #getDefaultValue() {
    const fieldDataType = this.controlApi.control.getFieldRestrictions().fieldDataType;
    const defaultValue: FieldValue | undefined = this.control?.typeAttributes.defaultValue;
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

  // TODO! Should this have to be added or should mobile add this???
  // Mobile Investigator uses these custom events to set focus on validation failure and masked edit focus.
  @HostListener("validationfocus", ["$event.target"])
  @HostListener("maskededitfocus", ["$event.target"])
  /**
   * Sets focus on the controls input if existing.
   * @param event Components host element.
   */
  focusInput(host: HTMLElement) {
    // Timeout allows input to appear upon unmasking.
    setTimeout(() => {
      host.querySelector<HTMLElement>("input:enabled, textarea:enabled, select:enabled, .masking-button.edit")?.focus();
    });
  }
}
