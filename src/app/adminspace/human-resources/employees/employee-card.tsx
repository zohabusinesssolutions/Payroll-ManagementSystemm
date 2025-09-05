"use client";

import type { IEmployee } from "@/app/types/IEmployee";
import { AdminityButton } from "@/components/adminity-button";
import { BarcodeComponent } from "@/components/barcode";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, Edit, FileText, QrCode, Users } from "lucide-react";
import { useCallback, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

const chartConfig = {
  present: {
    label: "Present",
    color: "#10b981", // emerald-500
  },
  absent: {
    label: "Absent",
    color: "#ef4444", // red-500
  },
  halfDay: {
    label: "Half Day",
    color: "#f59e0b", // amber-500
  },
  leave: {
    label: "Leave",
    color: "#8b5cf6", // violet-500
  },
  late: {
    label: "Late",
    color: "#f1e467", // violet-500
  },
};

// Utility function to calculate days since joining
const calculateDaysSinceJoining = (joiningDate: string): number => {
  const joinDate = new Date(joiningDate);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - joinDate.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Utility function to format date
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export function EmployeeCard({
  employee,
  onEdit,
}: {
  employee: IEmployee;
  onEdit: (employee: IEmployee) => void;
}) {
  const [isDownloadingPDF, setIsDownloadingPDF] = useState(false);
  const [isDownloadingBarcode, setIsDownloadingBarcode] = useState(false);

  const attendanceChartData = [
    {
      name: "Present",
      value: employee.attendance.PRESENT,
      fill: chartConfig.present.color,
    },
    {
      name: "Absent",
      value: employee.attendance.ABSENT,
      fill: chartConfig.absent.color,
    },
    {
      name: "Half Day",
      value: employee.attendance.HALFDAY,
      fill: chartConfig.halfDay.color,
    },
    {
      name: "Leave",
      value: employee.attendance.LEAVE,
      fill: chartConfig.leave.color,
    },
    {
      name: "Late",
      value: employee.attendance.LATE,
      fill: chartConfig.late.color,
    },
  ];

  const handleDownloadPDF = useCallback(async () => {
    setIsDownloadingPDF(true);
    try {
      // Simulate PDF download with delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const link = document.createElement("a");
      link.href = "#";
      link.download = `${employee.name}_work_experience.pdf`;
      link.click();
      console.log(`Downloading work experience PDF for ${employee.name}`);
    } finally {
      setIsDownloadingPDF(false);
    }
  }, [employee.name]);

  const handleDownloadBarcode = useCallback(async () => {
    setIsDownloadingBarcode(true);
    try {
      // Simulate barcode download with delay
      const barcodeContainer = document.querySelector(
        `[data-employee-id="${employee.employeeId}"]`
      );
      if (!barcodeContainer) {
        console.error("Barcode container not found");
        return;
      }

      const svgElement = barcodeContainer.querySelector("svg");
      if (!svgElement) {
        console.error("SVG element not found in barcode container");
        return;
      }

      // Clone the SVG to avoid modifying the original
      const svgClone = svgElement.cloneNode(true) as SVGElement;

      // Ensure the SVG has proper namespace and attributes
      svgClone.setAttribute("xmlns", "http://www.w3.org/2000/svg");

      // Get computed styles to ensure proper rendering
      const computedStyle = window.getComputedStyle(svgElement);
      const width = svgElement.getAttribute("width") || computedStyle.width;
      const height = svgElement.getAttribute("height") || computedStyle.height;

      svgClone.setAttribute("width", width.toString());
      svgClone.setAttribute("height", height.toString());

      // Convert SVG to string
      const svgData = new XMLSerializer().serializeToString(svgClone);

      // Create blob and download
      const blob = new Blob([svgData], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `${employee.employeeId}.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      // Clean up the URL
      URL.revokeObjectURL(url);
    } finally {
      setIsDownloadingBarcode(false);
    }
  }, [employee.employeeId]);

  return (
    <Card className="w-full hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={employee.image || "/default_profile.jpg"} />
              <AvatarFallback className="text-lg">
                {employee.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <CardTitle className="text-xl">{employee.name}</CardTitle>
              <p className="text-sm text-muted-foreground font-medium">
                {employee.designation}
              </p>
              <Badge
                variant={employee.status === "active" ? "default" : "secondary"}
                className="text-xs"
              >
                {employee.status}
              </Badge>
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <AdminityButton
              variant="outline"
              size="sm"
              onClick={() => onEdit(employee)}
            >
              <Edit className="h-4 w-4" />
            </AdminityButton>
            <AdminityButton
              variant="outline"
              size="sm"
              onClick={handleDownloadPDF}
              loading={isDownloadingPDF}
              disabled={isDownloadingPDF}
            >
              <FileText className="h-4 w-4" />
            </AdminityButton>
            <AdminityButton
              variant="outline"
              size="sm"
              onClick={handleDownloadBarcode}
              loading={isDownloadingBarcode}
              disabled={isDownloadingBarcode}
            >
              <QrCode className="h-4 w-4" />
            </AdminityButton>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-3 text-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>Joined:</span>
            </div>
            <span className="font-medium">
              {formatDate(employee.joiningDate)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>Days since joining:</span>
            </div>
            <span className="font-medium">
              {calculateDaysSinceJoining(employee.joiningDate)} days
            </span>
          </div>
          {employee.resignDate && (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>Resigned:</span>
              </div>
              <span className="font-medium">
                {formatDate(employee.resignDate)}
              </span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>Department:</span>
            </div>
            <span className="font-medium">{employee.department}</span>
          </div>
        </div>

        <Separator />

        <div className="flex items-center justify-between space-x-4">
          <div className="flex-1 space-y-3">
            <h4 className="text-sm font-semibold">Attendance Overview</h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded"
                  style={{ backgroundColor: chartConfig.present.color }}
                ></div>
                <span>Present: {employee.attendance.PRESENT}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded"
                  style={{ backgroundColor: chartConfig.absent.color }}
                ></div>
                <span>Absent: {employee.attendance.ABSENT}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded"
                  style={{ backgroundColor: chartConfig.halfDay.color }}
                ></div>
                <span>Half Day: {employee.attendance.HALFDAY}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded"
                  style={{ backgroundColor: chartConfig.leave.color }}
                ></div>
                <span>Leave: {employee.attendance.LEAVE}</span>
              </div>
            </div>
          </div>
          <div className="w-24 h-24">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={attendanceChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={15}
                    outerRadius={40}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {attendanceChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </div>

        <Separator />

        <div className="space-y-3" data-employee-id={employee.employeeId}>
          <h4 className="text-sm font-semibold">Employee ID</h4>
          <BarcodeComponent employeeId={employee.employeeId} />
        </div>
      </CardContent>
    </Card>
  );
}
