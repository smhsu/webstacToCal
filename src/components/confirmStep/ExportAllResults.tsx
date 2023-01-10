import { faCheck, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { describeCount } from "src/describeCount";
import "./ExportAllResults.css";

interface IExportAllResultsProps {
    numSuccessful: number;
    numFailed: number;
}

export function ExportAllResults(props: IExportAllResultsProps) {
    const { numSuccessful, numFailed } = props;
    if ((numFailed + numSuccessful) <= 0) {
        return null;
    }

    return <div className="ExportAllResults alert d-inline-block mt-3">
        <h3 className="fs-6 position-absolute ExportAllResults-heading bg-white px-2 fst-italic">Batch results</h3>
        {numSuccessful > 0 &&
            <div className="text-success">
                <FontAwesomeIcon icon={faCheck} /> {describeCount(numSuccessful, "event")} added.
            </div>
        }
        {numFailed > 0 &&
            <div className="text-danger">
                <FontAwesomeIcon icon={faTriangleExclamation} /> {describeCount(numFailed, "event")} failed to
                add.  Inspect events below for details.
            </div>
        }
    </div>;
}
