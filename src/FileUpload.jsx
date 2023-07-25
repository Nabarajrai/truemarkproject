/* eslint-disable react/prop-types */
import Papa from "papaparse";
import { CiImport } from "react-icons/ci";

const FileUpload = ({ onFileUpload }) => {
  const handleFileChange = event => {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        complete: results => {
          const data = results.data;
          onFileUpload(data);
        },
        header: true,
        skipEmptyLines: true,
      });
    }
  };

  return (
    <>
      <div className="button">
        <input type="file" id="file" onChange={handleFileChange} />
        <span className="icon">
          <CiImport />
        </span>
        Import CSV
      </div>
    </>
  );
};

export default FileUpload;
