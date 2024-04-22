import { ControlType } from "@sassoftware/vi-api/config";

export const control = {
    category: "Fields",
    controlDescription: {
        defaultText: "desktopCustomTextbox"
    },
    directiveName: "sol-desktop-custom-textbox",
    displayName: {
        defaultText: "desktopCustomTextbox"
    },
    name: "desktopCustomTextbox",
    controlAttributes: {
        attributes: {
            dataSource: {
                displayName: {
                    defaultText: "Data source:"
                },
                type: "DataSource",
                required: true
            },
            "title.text": {
                defaultValue: {
                    defaultText: "Custom Text Box"
                },
                displayName: {
                    defaultText: "Custom Text Box"
                },
                type: "TextInput"
            },
            multiLine: {
                displayName: {
                    defaultText: "Multi-Line"
                },
                type: "Checkbox"
            },
            defaultValue: {
                disabledExpression: "!dataSource || readOnlyDataSourceExists",
                displayName: {
                    defaultText: "Default value:"
                },
                ...{ hideOnDisable: true }, // hideOnDisable is not on SolutionExtension type.
                ...{ multiLine: "{{multiLine}}" }, // multiLine is not on SolutionExtension type.
                type: "TextInput"
            }
        },
        metadata: {
            renderAs: ControlType.WebComponent,
            states: {
                readOnly: true,
                hidden: true,
                required: true,
                disabled: true
            }
        }
    }
};
