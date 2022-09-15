/**
 * Finds highest score from lightHouse results.
 * @param lhResult LightHose results array.
 * @param minAverages Minimum scores averages for pages.
 * @returns Highest page scores and blew average.
 */
const findMaxReportScore = (lhResult, minAverages) => {
  const err = {};
  const maxScore = {};
  for (const [key, value] of Object.entries(lhResult)) {
    maxScore[key] = value.sort((a, b) => b.performance - a.performance)[0];
    for (const [averageKey, averageValue] of Object.entries(minAverages[key])) {
      if (maxScore[key][averageKey] < averageValue) {
        err[`${key}-${averageKey}`] = maxScore[key][averageKey];
      }
    }
  }
  return { maxScore, err };
};

export default findMaxReportScore;
