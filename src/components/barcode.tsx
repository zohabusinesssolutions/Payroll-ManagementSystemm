import JsBarcode from "jsbarcode";
import { useEffect, useRef } from "react";

export function BarcodeComponent({ employeeId }: { employeeId: string }) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (svgRef.current) {
      JsBarcode(svgRef.current, employeeId, {
        format: "CODE128",
        lineColor: "#000",
        width: 2,
        height: 40,
        displayValue: true,
        fontSize: 12,
      });
    }
  }, [employeeId]);

  return (
    <div className="bg-white p-2 rounded border flex justify-center">
      <svg ref={svgRef} />
    </div>
  );
}
