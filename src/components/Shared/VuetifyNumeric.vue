<template>
  <v-text-field
    :label="label"
    :placeholder="placeholder"
    :readonly="readonly"
    :success="success"
    :outline="outline"
    @blur="onBlurHandler"
    @input="onInputHandler"
    @focus="onFocusHandler"
    ref="numeric"
    v-model="amount"
    :class="cssClass"
  ></v-text-field>
</template>

<script>
import accounting from "accounting-js";

export default {
  name: "VuetifyNumeric",

  props: {
    /**
     * Label symbol.
     */
    label: {
      type: String,
      default: "",
      required: false
    },

    field: {
      type: String,
      default: "",
      required: false
    },
    cssClass: {
      type: String,
      default: "",
      required: false
    },
    /**
     * Currency symbol.
     */
    currency: {
      type: String,
      default: "",
      required: false
    },

    /**
     * Maximum value allowed.
     */
    max: {
      type: Number,
      default: Number.MAX_SAFE_INTEGER || 9007199254740991,
      required: false
    },

    /**
     * Minimum value allowed.
     */
    min: {
      type: Number,
      default: Number.MIN_SAFE_INTEGER || -9007199254740991,
      required: false
    },

    /**
     * Enable/Disable minus value.
     */
    minus: {
      type: Boolean,
      default: true,
      required: false
    },

    /**
     * Input placeholder.
     */
    placeholder: {
      type: String,
      default: "",
      required: false
    },

    /**
     * Value when the input is empty
     */
    emptyValue: {
      type: [Number, String],
      default: "",
      required: false
    },

    /**
     * Number of decimals.
     * Decimals symbol are the opposite of separator symbol.
     */
    precision: {
      type: Number,
      default: 0,
      required: false
    },

    /**
     * Thousand separator type.
     * Separator props accept either . or , (default).
     */
    separator: {
      type: String,
      default: ",",
      required: false
    },

    /**
     * Forced thousand separator.
     * Accepts any string.
     */
    thousandSeparator: {
      default: undefined,
      required: false,
      type: String
    },

    /**
     * Forced decimal separator.
     * Accepts any string.
     */
    decimalSeparator: {
      default: undefined,
      required: false,
      type: String
    },

    /**
     * The output type used for v-model.
     * It can either be String or Number (default).
     */
    outputType: {
      required: false,
      type: String,
      default: "Number"
    },

    /**
     * v-model value.
     */
    value: {
      default: 0,
      required: true
    },

    /**
     * Hide input and show value in text only.
     */
    readonly: {
      type: Boolean,
      default: false,
      required: false
    },

    /**
     * Position of currency symbol
     * Symbol position props accept either 'suffix' or 'prefix' (default).
     */
    currencySymbolPosition: {
      type: String,
      default: "prefix",
      required: false
    },

    /**
     * Puts the input in a manual success state.
     */
    success: {
      type: Boolean,
      default: false,
      required: false
    },

    /**
     * Applies the outline style to the input.
     */
    outline: {
      type: Boolean,
      default: false,
      required: false
    }
  },

  data: () => ({
    amount: "",
    mountedFinished: false
  }),

  computed: {
    /**
     * Number type of formatted value.
     * @return {Number}
     */
    amountNumber() {
      return this.unformat(this.amount);
    },

    /**
     * Number type of value props.
     * @return {Number}
     */
    valueNumber() {
      return this.unformat(this.value);
    },

    /**
     * Define decimal separator based on separator props.
     * @return {String} '.' or ','
     */
    decimalSeparatorSymbol() {
      if (typeof this.decimalSeparator !== "undefined") return this.decimalSeparator;
      if (this.separator === ",") return ".";
      return ",";
    },

    /**
     * Define thousand separator based on separator props.
     * @return {String} '.' or ','
     */
    thousandSeparatorSymbol() {
      if (typeof this.thousandSeparator !== "undefined") return this.thousandSeparator;
      if (this.separator === ".") return ".";
      if (this.separator === "space") return " ";
      return ",";
    },

    /**
     * Define format position for currency symbol and value.
     * @return {String} format
     */
    symbolPosition() {
      if (!this.currency) return "%v";
      return this.currencySymbolPosition === "suffix" ? "%v %s" : "%s %v";
    }
  },

  watch: {
    /**
     * Watch for value change from other input with same v-model.
     * @param {Number} newValue
     */
    valueNumber(newValue) {
      if (this.$refs.numeric !== document.activeElement) {
        this.amount = this.format(newValue);
      }
    },

    /**
     * Immediately reflect separator changes
     */
    separator() {
      this.process(this.valueNumber);
      this.amount = this.format(this.valueNumber);
    },

    /**
     * Immediately reflect currency changes
     */
    currency() {
      this.process(this.valueNumber);
      this.amount = this.format(this.valueNumber);
    },

    /**
     * Immediately reflect precision changes
     */
    precision() {
      this.process(this.valueNumber);
      this.amount = this.format(this.valueNumber);
    }
  },

  mounted() {
    // Set default value props when placeholder undefined.
    if (!this.placeholder) {
      this.process(this.valueNumber);
      this.amount = this.format(this.valueNumber);

      // In case of delayed props value.
      setTimeout(() => {
        this.process(this.valueNumber);
        this.amount = this.format(this.valueNumber);
        this.mountedFinished = true;
      }, 500);
    }
  },

  methods: {
    /**
     * Handle blur event.
     * @param {Object} e
     */
    onBlurHandler(e) {
      this.$emit("blur", e);
      this.amount = this.format(this.valueNumber);
    },

    /**
     * Handle focus event.
     * @param {Object} e
     */
    onFocusHandler(e) {
      this.$emit("focus", e);
      if (this.valueNumber === 0) {
        this.amount = null;
      } else {
        this.amount = accounting.formatMoney(this.valueNumber, {
          symbol: "",
          format: "%v",
          thousand: "",
          decimal: this.decimalSeparatorSymbol,
          precision: Number(this.precision)
        });
      }
    },

    /**
     * Handle input event.
     */
    onInputHandler() {
      this.process(this.amountNumber);
    },

    /**
     * Validate value before update the component.
     * @param {Number} value
     */
    process(value) {
      if (value >= this.max) this.update(this.max);
      if (value <= this.min) this.update(this.min);
      if (value > this.min && value < this.max) this.update(value);
      if (!this.minus && value < 0) this.min >= 0 ? this.update(this.min) : this.update(0);
    },

    /**
     * Update parent component model value.
     * @param {Number} value
     */
    update(value) {
      const fixedValue = accounting.toFixed(value, this.precision);
      const output = this.outputType.toLowerCase() === "string" ? fixedValue : Number(fixedValue);

      if (this.mountedFinished) {
        this.$emit("input", {
          field: this.field,
          value: output
        });
      }
    },

    /**
     * Format value using symbol and separator.
     * @param {Number} value
     * @return {String}
     */
    format(value) {
      return accounting.formatMoney(value, {
        symbol: this.currency,
        format: this.symbolPosition,
        precision: Number(this.precision),
        decimal: this.decimalSeparatorSymbol,
        thousand: this.thousandSeparatorSymbol
      });
    },

    /**
     * Remove symbol and separator.
     * @param {Number} value
     * @return {Number}
     */
    unformat(value) {
      const toUnformat = typeof value === "string" && value === "" ? this.emptyValue : value;
      return accounting.unformat(toUnformat, this.decimalSeparatorSymbol);
    }
  }
};
</script>

<style scoped></style>
