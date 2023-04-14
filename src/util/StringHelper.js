

class StringHelper {
  formatCurrency(value, format = '') {
    if (format == 'M') {
      return `${Math.round(value / 1000000)}M`;
    } else {
      return value;
    }
  };


}
const stringHelper = new StringHelper();
export default stringHelper;