"use client";

import { Frame, Text, Surface } from "lumir-design-system-shared";
import { Button } from "lumir-design-system-02";
import { usePathname } from "next/navigation";

const navigationItems = [
  {
    label: "결재선 관리",
    href: "/approval-lines",
  },
  {
    label: "문서 양식",
    href: "/document-forms",
  },
  {
    label: "문서함",
    href: "/documents",
  },
] as const;

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <Surface
      as="nav"
      background="secondary-system01-1-rest"
      borderColor="secondary-system01-2-rest"
      borderWidth="thin"
      borderStyle="solid"
      boxShadow="10"
      className="flex-none w-64 "
    >
      <Frame direction="column" className="h-full flex justify-between">
        {/* 상단 영역 */}
        <Frame direction="column" className="flex-1 min-h-0">
          <Surface
            as="div"
            background="secondary-system01-2-rest"
            className="flex-none p-4 border-b"
          >
            <Text
              variant="title-2"
              weight="medium"
              color="primary-system01-1-rest"
            >
              전자결재
            </Text>
          </Surface>

          <Frame
            direction="column"
            gap="xs"
            className="h-full p-2 overflow-y-auto"
          >
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Button
                  key={item.href}
                  variant={isActive ? "filled" : "transparent"}
                  colorScheme={isActive ? "primary" : "secondary"}
                  onClick={() => (window.location.href = item.href)}
                  className={`justify-start h-10 w-full text-sm transition-colors ${
                    isActive ? "shadow-sm" : "hover:bg-neutral-100"
                  }`}
                >
                  {item.label}
                </Button>
              );
            })}
          </Frame>
        </Frame>

        {/* 푸터 영역 */}
        <Surface
          as="div"
          background="secondary-system01-2-rest"
          className="flex-none border-t"
        >
          <Frame direction="column" gap="md" className="p-4">
            <Frame direction="column" gap="xs">
              <Text variant="caption-1" color="secondary-system01-2-rest">
                LIAS Client
              </Text>
              <Text
                variant="caption-1"
                weight="medium"
                color="primary-system01-1-rest"
              >
                v1.0.0
              </Text>
            </Frame>
            <Text variant="caption-2" color="secondary-system01-3-rest">
              © 2024 LIAS. All rights reserved.
            </Text>
          </Frame>
        </Surface>
      </Frame>
    </Surface>
  );
}
