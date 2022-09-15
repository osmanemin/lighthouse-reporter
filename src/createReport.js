import fs from "fs";
import lighthouse from "lighthouse";
import chromeLauncher from "chrome-launcher";

const onlyCategories = [
  "performance",
  "accessibility",
  "best-practices",
  "seo",
];

const options = {
  logLevel: "info",
  output: "html",
  port: 8080,
  onlyCategories,
};

/**
 * Create a lightHouse report.
 * @param url Page address for lightHouse report.
 * @param tag Page type of target page.
 * @param index The number of page reports.
 * @returns Created lightHouse report.
 */
const createReport = async (url, tag = "", index = 0) => {
  const chrome = await chromeLauncher.launch({ chromeFlags: [ "--headless"] });
  options.port = chrome.port;

  console.log(
    `Lighthouse starting on ${url} - report number: ${index}`
  );
  const runnerResult = await lighthouse(url, options);

  // `.report` is the HTML report as a string
  const reportHtml = runnerResult.report;
  fs.writeFileSync(`./reports/lhreport${index}-${tag}.html`, reportHtml);

  const result = {};

  onlyCategories.forEach((category) => {
    result[category] = runnerResult.lhr.categories[category].score * 100;
  });

  console.log(`Report is done for '${tag}': ${url}`);
  await chrome.kill();
  return result;
};
export default createReport;
