import Ember from 'ember';

function formatNumber(value, defaultValue = '0') {
    // Since we are formatting a number 0 should be formatted, not replaced with default
    if (!value && value !== 0) {
        return defaultValue;
    }
    if (typeof value === 'number') {
        value = value.toFixed(1).toString();
        if (value.substring(value.length - 2, value.length) === '.0') {
            value = value.substring(0, value.length - 2);
        }
    }
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function helper([value, defaultValue = '']) {
    return formatNumber(value, defaultValue);
}

export default Ember.Helper.helper(helper);
