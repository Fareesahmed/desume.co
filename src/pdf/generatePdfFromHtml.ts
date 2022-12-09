import { Box } from "../common/classes/Box";
import { a4SizeInPoints } from "../common/constants/sizes";
import { Coord } from "../common/interfaces/measure";
import { getFontProperties } from "./text/fontProperties";
import { FontStyle, PDF, TextOptions } from "./pdf";
import { textNodeByLines, textNodeLineRects } from "./text/textNodeUtils";

/**
 * Generates a single-page PDF document from an HTML element.
 */
export function generatePdfFromHtml(pageElement: HTMLElement): PDF {
  const doc = new PDF();

  const pageBox = boxFromDomRect(pageElement.getBoundingClientRect());
  const pdfScalar = a4SizeInPoints.width / pageBox.size.width;

  const pdfBoxFromDomRect = (domRect: DOMRect) => {
    return boxFromDomRect(domRect).relativeTo(pageBox).scaledBy(pdfScalar);
  };

  function renderNode(node: Node) {
    if (node.childNodes.length === 0) {
      if (node instanceof Text) {
        renderTextNode(node);
      }
      return;
    }
    Array.from(node.childNodes).forEach((child) => {
      renderNode(child);
    });
  }

  function renderTextNode(text: Text) {
    const el = text.parentElement!;
    const elBox = pdfBoxFromDomRect(el.getBoundingClientRect());
    const styles = window.getComputedStyle(el);

    // doc.drawBox(elBox);

    const textOptions: TextOptions = {
      fontSizePt: parseFloat(styles.fontSize) * pdfScalar,
      lineHeightPt: parseFloat(styles.lineHeight) * pdfScalar,
      fontFamily: styles.fontFamily,
      fontStyle: styles.fontStyle as FontStyle,
      fontWeight: parseInt(styles.fontWeight),
    };

    // TODO: Calc properties once per font
    const bRatio = getFontProperties(textOptions.fontFamily).baselineRatio;

    const lineStrings = textNodeByLines(text);
    const lineBoxes = textNodeLineRects(text).map(pdfBoxFromDomRect);

    lineBoxes.forEach((lineBox, i) => {
      const baselineTopOffsetPt =
        (lineBox.size.height - textOptions.fontSizePt) / 2 +
        bRatio * textOptions.fontSizePt;

      const baselineLeft: Coord = {
        x: lineBox.topLeft.x,
        y: lineBox.topLeft.y + baselineTopOffsetPt,
      };
      const baselineRight: Coord = {
        x: baselineLeft.x + lineBox.size.width,
        y: baselineLeft.y,
      };

      doc
        // .drawBox(lineBox)
        // .drawLine(baselineLeft, baselineRight, { color: "#00ff00" })
        .drawText(lineStrings[i] ?? "", baselineLeft, textOptions);
    });
  }

  Array.from(pageElement.children).forEach((cell) => {
    const cellBox = pdfBoxFromDomRect(cell.getBoundingClientRect());
    // doc.drawBox(cellBox);

    Array.from(cell.children).forEach((el) => renderNode(el));
  });

  return doc;
}

function boxFromDomRect({ x, y, width, height }: DOMRect): Box {
  return new Box(x, y, width, height);
}
