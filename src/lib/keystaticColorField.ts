// Custom Keystatic form field: a hex color value edited through a native
// <input type="color"> swatch/picker (kept in sync with a plain hex text
// input) plus a live preview square, so a non-technical editor can see the
// exact color rather than blindly typing a hex code. @keystatic/core has no
// built-in color field (checked: Object.keys(require("@keystatic/core").fields)
// lists array/blocks/checkbox/.../text/url - no "color"), so this implements
// the public BasicFormField extension point directly instead.
//
// `validate()` is intentionally a no-op passthrough: BasicFormField's real
// invalid-state contract isn't documented and the compiled bundle is
// minified, so throwing there risks crashing the whole Admin UI on a single
// bad keystroke. Instead the hex-regex check happens inside Input itself -
// forceValidation (true once the user tries to save) drives a visible
// inline error + red outline, which is a safer way to surface the same
// "must be a 6-digit hex code" requirement.
import { createElement, useState } from "react";
import type { BasicFormField, FormFieldInputProps } from "@keystatic/core";

const HEX_RE = /^#[0-9A-Fa-f]{6}$/;

function ColorFieldInput({
  value,
  onChange,
  autoFocus,
  forceValidation,
}: FormFieldInputProps<string>) {
  const [touched, setTouched] = useState(false);
  const showError = (touched || forceValidation) && !HEX_RE.test(value);
  const swatchValue = HEX_RE.test(value) ? value : "#000000";

  return createElement(
    "div",
    { style: { display: "flex", flexDirection: "column", gap: 6 } },
    createElement(
      "div",
      { style: { display: "flex", alignItems: "center", gap: 10 } },
      createElement("input", {
        type: "color",
        value: swatchValue,
        autoFocus,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
          onChange(e.target.value);
          setTouched(true);
        },
        style: {
          width: 40,
          height: 40,
          padding: 0,
          border: "1px solid #ccc",
          borderRadius: 6,
          cursor: "pointer",
          flexShrink: 0,
        },
      }),
      createElement("input", {
        type: "text",
        value,
        placeholder: "#000000",
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value),
        onBlur: () => setTouched(true),
        style: {
          flex: 1,
          fontFamily: "monospace",
          fontSize: 14,
          padding: "8px 10px",
          borderRadius: 6,
          border: showError ? "1px solid #e5484d" : "1px solid #ccc",
        },
      }),
      createElement("div", {
        "aria-hidden": true,
        style: {
          width: 40,
          height: 40,
          borderRadius: 6,
          border: "1px solid #ccc",
          backgroundColor: swatchValue,
          flexShrink: 0,
        },
      })
    ),
    showError
      ? createElement(
          "span",
          { style: { color: "#e5484d", fontSize: 12 } },
          "Must be a 6-digit hex color, e.g. #1a2b5c"
        )
      : null
  );
}

export function colorField({
  label,
  defaultValue = "#000000",
}: {
  label: string;
  defaultValue?: string;
}): BasicFormField<string> {
  return {
    kind: "form",
    Input(props) {
      return createElement(ColorFieldInput, props);
    },
    defaultValue: () => defaultValue,
    parse: (value) => (typeof value === "string" ? value : defaultValue),
    serialize: (value) => ({ value }),
    validate: (value) => value,
    reader: {
      parse: (value) => (typeof value === "string" ? value : defaultValue),
    },
    label,
  };
}
