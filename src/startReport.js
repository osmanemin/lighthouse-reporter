import fs from "fs";
import paths from "../data/paths.js";
import averages from "../data/average.js";
import createReport from "./createReport.js";
import findMaxReportScore from "./findMaxReportScore.js";
import sendMail from "./email.js";
import compressToZip from "./archive.js";
import dotenv from "dotenv";

dotenv.config();

/**
 * Start lightHouse reports for all pages.
 * @param requestUrl The address of which gape to generate the report.
 * @param repeatCount The number of how many times reports will be generated.
 */
const startReport = async (
  requestUrl = "https://www.cimri.com",
  repeatCount = 3
) => {
  const lhResults = {};

  // create report directory
  fs.mkdir("./reports", { recursive: true }, (err) => {
    if (err) throw err;
  });

  // cerate lightHouse reports
  for (let index = 1; index <= repeatCount; index++) {
    for (let i = 0; i < paths.length; i++) {
      const path = paths[i].slag;
      const tag = paths[i].tag;
      const result = await createReport(`${requestUrl}${path}`, tag, index);
      if (lhResults[tag]) lhResults[tag].push(result);
      else lhResults[tag] = [result];
    }
  }

  const { maxScore, err } = findMaxReportScore(lhResults, averages);

  console.log("------------------------------------");
  if (Object.keys(err).length > 0) {
    console.log("Ortalamnın altında kalanlar => ", err);
    console.log("------------------------------------");
    compressToZip("./reports", "lh-report");
    sendMail(
      process.env.TARGET_MAIL_ADDRESS,
      `LightHouse Report Failed - ${process.env.BUILD_ID}`,
      "./lh-report.zip"
    );
    console.log("Reports sent to ", process.env.TARGET_MAIL_ADDRESS);
    throw "-------------- Ortalamanın altı 👎 --------------";
  }
  console.log("Başarılı 👍");
  console.log("Sonuç: ", maxScore);
};

export default startReport;
