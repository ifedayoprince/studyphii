"use client";

import { useState } from "react";
import { Card } from "@nextui-org/card";
import { Button } from "@nextui-org/button";
import { Divider } from "@nextui-org/divider";
import { ScrollShadow } from "@nextui-org/scroll-shadow";
import { 
  Book1, 
  Clock, 
  Home2,
  ArrowLeft2,
  ArrowRight2 
} from "iconsax-react";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
}

function SidebarItem({ icon, label, isActive }: SidebarItemProps) {
  return (
    <Button
      className={`w-full justify-start ${
        isActive ? "bg-default-100" : ""
      }`}
      variant="light"
      startContent={icon}
    >
      {label}
    </Button>
  );
}

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [width, setWidth] = useState(280);
  const minWidth = 280;
  const collapsedWidth = 80;

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isCollapsed) {
      const newWidth = e.clientX;
      if (newWidth >= minWidth) {
        setWidth(newWidth);
      }
    }
  };

  const handleMouseUp = () => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  return (
    <>
      <Card className="h-screen rounded-none shadow-medium">
        <div
          style={{ width: isCollapsed ? collapsedWidth : width }}
          className="flex h-full flex-col transition-all duration-200"
        >
          <div className="flex items-center justify-between p-4">
            {!isCollapsed && <span className="text-xl font-bold">StudyPhii</span>}
            <Button
              isIconOnly
              variant="light"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? <ArrowRight2 /> : <ArrowLeft2 />}
            </Button>
          </div>
          <Divider />
          <ScrollShadow className="flex-1">
            <div className="flex flex-col gap-1 p-2">
              <SidebarItem icon={<Home2 />} label="Overview" />
              <SidebarItem icon={<Clock />} label="Recent" />
              <SidebarItem icon={<Book1 />} label="Study Sessions" isActive />
            </div>
          </ScrollShadow>
        </div>
      </Card>
      {!isCollapsed && (
        <div
          className="hover:bg-primary/20 cursor-col-resize w-1 hover:w-1.5 bg-default-200 transition-all"
          onMouseDown={handleMouseDown}
        />
      )}
    </>
  );
} 