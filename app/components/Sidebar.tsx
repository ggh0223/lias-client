"use client";

import { Frame, Text, Surface } from "lumir-design-system-shared";
import { Button } from "lumir-design-system-02";
import { usePathname } from "next/navigation";
import Link from "next/link";

const navigationItems = [
  {
    label: "결재선 관리",
    href: "/approval-lines",
    icon: "📋",
  },
  {
    label: "문서 양식",
    href: "/document-forms",
    icon: "📄",
  },
  {
    label: "문서함",
    href: "/documents",
    icon: "📁",
  },
] as const;

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <Surface
      as="nav"
      background="secondary-system01-inverse-rest"
      boxShadow="30"
      className="flex-none w-60 backdrop-blur-xl bg-white/90"
    >
      <Frame direction="column" className="h-full flex justify-between">
        {/* 상단 영역 */}
        <Frame direction="column" className="flex-1 min-h-0">
          <Surface
            as="div"
            background="secondary-system01-inverse-rest"
            className="flex-none p-6"
          >
            <div className="relative">
              <Text
                variant="title-2"
                weight="medium"
                color="primary-system01-1-rest"
                className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
              >
                전자결재
              </Text>
            </div>
          </Surface>

          <Frame
            direction="column"
            gap="xs"
            className="h-full p-4 overflow-y-auto"
          >
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href} className="block">
                  <Button
                    variant={isActive ? "filled" : "transparent"}
                    colorScheme={isActive ? "primary" : "secondary"}
                    className={`justify-start h-12 w-full text-sm transition-all duration-300 rounded-xl group flex items-center ${
                      isActive
                        ? "shadow-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600"
                        : "hover:bg-slate-50 hover:shadow-md hover:scale-[1.02]"
                    }`}
                  >
                    <div className="flex items-center gap-3 w-full h-full">
                      <div
                        className={`text-lg transition-transform duration-300 group-hover:scale-110 flex items-center ${
                          isActive ? "text-white" : "text-slate-600"
                        }`}
                      >
                        {item.icon}
                      </div>
                      <span className="font-medium flex items-center">
                        {item.label}
                      </span>
                      {isActive && (
                        <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse flex items-center"></div>
                      )}
                    </div>
                  </Button>
                </Link>
              );
            })}
          </Frame>
        </Frame>

        {/* 푸터 영역 */}
        <Surface
          as="div"
          background="secondary-system01-inverse-rest"
          className="flex-none"
        >
          <Frame direction="column" gap="md" className="p-6">
            <Frame direction="column" gap="xs">
              <Text
                variant="caption-1"
                color="secondary-system01-2-rest"
                className="font-medium"
              >
                LIAS Client
              </Text>
              <Text
                variant="caption-1"
                weight="medium"
                color="primary-system01-1-rest"
                className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
              >
                v1.0.0
              </Text>
            </Frame>
            <div className="h-px bg-slate-200/60"></div>
            <Text
              variant="caption-2"
              color="secondary-system01-3-rest"
              className="text-center"
            >
              © 2024 LIAS. All rights reserved.
            </Text>
          </Frame>
        </Surface>
      </Frame>
    </Surface>
  );
}
