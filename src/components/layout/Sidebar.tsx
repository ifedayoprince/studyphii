"use client";

import { useState } from "react";
import { Card } from "@nextui-org/card";
import { Button } from "@nextui-org/button";
import { ScrollShadow } from "@nextui-org/scroll-shadow";
import { 
  Clock, 
  Home2,
  ArrowLeft2,
  ArrowRight2,
  SearchNormal1,
  MessageQuestion,
  ArrowCircleRight,
  ArrowCircleDown,
} from "iconsax-react";

interface PageItem {
  id: string;
  icon?: React.ReactNode;
  label: string;
  subPages?: PageItem[];
  isExpanded?: boolean;
}

interface SidebarSection {
  title?: string;
  items: PageItem[];
}

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [sections, setSections] = useState<SidebarSection[]>([
    {
      items: [
        { id: '1', icon: <SearchNormal1 size={16} />, label: "Search" },
        { id: '2', icon: <MessageQuestion size={16} />, label: "AI Assistant" },
        { id: '3', icon: <Home2 size={16} />, label: "Home" },
        { id: '4', icon: <Clock size={16} />, label: "Recent" },
      ]
    },
    {
      title: "Favorites",
      items: [
        { 
          id: '5',
          label: "Project $10k",
          isExpanded: true,
          subPages: [
            { id: '5-1', label: "Goals" },
            { id: '5-2', label: "Timeline" },
          ]
        },
        { id: '6', label: "Study Notes" },
        { id: '7', label: "StudyPhii" },
      ]
    },
    {
      title: "Shared",
      items: [
        { id: '8', label: "Study Group" },
      ]
    }
  ]);

  const toggleExpand = (sectionIndex: number, itemId: string) => {
    setSections(prevSections => {
      const newSections = [...prevSections];
      const findAndToggleItem = (items: PageItem[]): PageItem[] => {
        return items.map(item => {
          if (item.id === itemId) {
            return { ...item, isExpanded: !item.isExpanded };
          }
          if (item.subPages) {
            return { ...item, subPages: findAndToggleItem(item.subPages) };
          }
          return item;
        });
      };
      
      newSections[sectionIndex] = {
        ...newSections[sectionIndex],
        items: findAndToggleItem(newSections[sectionIndex].items)
      };
      return newSections;
    });
  };

  const PageItem = ({ item, level = 0, sectionIndex }: { item: PageItem; level?: number; sectionIndex: number }) => {
    const hasSubPages = item.subPages && item.subPages.length > 0;
    const isTopLevel = level === 0;
    
    return (
      <div className="relative">
        <Button
          variant="light"
          className={`h-7 w-full justify-start gap-2 rounded-lg px-2 text-sm data-[hover=true]:bg-default-100 ${
            level > 0 ? 'ml-4' : ''
          }`}
        >
          {hasSubPages && (
            <button 
              className="absolute left-0 top-1.5"
              onClick={(e) => {
                e.stopPropagation();
                toggleExpand(sectionIndex, item.id);
              }}
            >
              {item.isExpanded ? (
                <ArrowCircleDown size={14} className="text-default-400" />
              ) : (
                <ArrowCircleRight size={14} className="text-default-400" />
              )}
            </button>
          )}
          {item.icon && <span className="text-default-500">{item.icon}</span>}
          <span className={`${hasSubPages ? 'ml-4' : isTopLevel ? 'ml-0' : 'ml-4'}`}>
            {item.label}
          </span>
        </Button>
        
        {hasSubPages && item.isExpanded && !isCollapsed && (
          <div className="relative flex flex-col gap-0.5 pl-4">
            {/* Vertical line for subpages */}
            <div className="absolute left-1.5 top-0 h-full w-px bg-default-100" />
            {item.subPages.map((subPage) => (
              <PageItem 
                key={subPage.id} 
                item={subPage} 
                level={level + 1}
                sectionIndex={sectionIndex}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="h-screen rounded-none bg-content2 p-2">
      <ScrollShadow className="h-full">
        <div className="flex flex-col gap-6">
          {/* Collapse Button */}
          <Button
            isIconOnly
            variant="light"
            className="h-6 w-6 rounded-lg"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? <ArrowRight2 size={16} /> : <ArrowLeft2 size={16} />}
          </Button>

          {/* Sections */}
          {sections.map((section, sectionIndex) => (
            <div key={section.title || sectionIndex} className="flex flex-col gap-1">
              {section.title && !isCollapsed && (
                <p className="px-2 text-xs font-medium uppercase tracking-wider text-default-500">
                  {section.title}
                </p>
              )}
              <div className="flex flex-col gap-0.5">
                {section.items.map((item) => (
                  <PageItem 
                    key={item.id} 
                    item={item} 
                    sectionIndex={sectionIndex}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollShadow>
    </Card>
  );
} 