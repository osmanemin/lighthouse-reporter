import file_system from "fs";
import archiver from "archiver";

/**
 * Compress all file in directory to zip file.
 * @param directory The string of folder path to compress.
 * @param zipName The string of zip file name.
 */
const compressToZip = (directory, zipName = "lh-report") => {
  const output = file_system.createWriteStream(`${zipName}.zip`);
  const archive = archiver("zip");

  output.on("close", function () {
    console.log(archive.pointer() + " total bytes");
    console.log(
      "archiver has been finalized and the output file descriptor has closed."
    );
  });

  archive.on("error", function (err) {
    throw err;
  });

  archive.pipe(output);

  archive.directory(directory, false);

  archive.finalize();
};

export default compressToZip;
