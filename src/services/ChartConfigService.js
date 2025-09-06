/**
 * https://github.com/jerairrest/react-chartjs-2/tree/master/example/src/components
 */
export const useChartConfigService = () => {
  /**
   * Return an array with 1 -> 12. Corresponds to jan -> dec
   */
  function getXforMonths() {
    return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  }

  return {
    getXforMonths
  };
};
