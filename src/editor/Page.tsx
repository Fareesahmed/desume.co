import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/store";
import { setPageMargins } from "../features/document/documentSlice";
import FractionSliders from "./FractionSliders";

interface PageProps {
  pageWidth: number;
  pageHeight: number;
}

export default function Page({ pageHeight, pageWidth }: PageProps) {
  const pageMargins = useSelector(
    (state: RootState) => state.document.pageMargins
  );
  const docComponents = useSelector(
    (state: RootState) => state.document.components
  );
  const dispatch = useDispatch();

  const { top, left, right, bottom } = pageMargins;
  const colTemplate = `${left * 100}% 1fr ${right * 100}%`;
  const rowTemplate = `${top * 100}% 1fr ${bottom * 100}%`;

  return (
    <div className="relative">
      <div
        id="page-1"
        className="mx-auto bg-white outline outline-1 outline-gray-3"
        style={{
          width: pageWidth,
          height: pageHeight,
          display: "grid",
          gridTemplateColumns: colTemplate,
          gridTemplateRows: rowTemplate,
        }}
      >
        <div className="col-start-2 row-start-2">
          {docComponents.map((component, index) => (
            <h1 key={index}>{component.text}</h1>
          ))}
        </div>
      </div>

      <div className="w-full absolute top-0 left-1/2 -translate-x-1/2">
        <FractionSliders
          axis="vertical"
          height={pageHeight}
          fractions={[top, 1 - top - bottom, bottom]}
          onChange={(fractions) =>
            dispatch(
              setPageMargins({
                ...pageMargins,
                top: fractions[0],
                bottom: fractions[2],
              })
            )
          }
        />
      </div>
    </div>
  );
}
