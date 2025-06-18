"use client";

import Link from "next/link";
import { Frame, Text, Surface } from "lumir-design-system-shared";
import { Button } from "lumir-design-system-02";

export default function Header() {
  return (
    <Surface
      as="header"
      background="secondary-system01-1-rest"
      borderColor="secondary-system01-2-rest"
      borderWidth="thin"
      borderStyle="solid"
      boxShadow="10"
      className="flex-none w-full sticky top-0 z-50 backdrop-blur-sm bg-opacity-90"
    >
      <Frame
        direction="row"
        align="center"
        className="h-14 px-6 max-w-7xl mx-auto flex justify-between items-center"
      >
        <Link href="/" className="flex items-center">
          <Text
            variant="heading-1"
            color="primary-system01-1-rest"
            className="font-bold tracking-tight"
          >
            LIAS
          </Text>
        </Link>

        <Frame
          direction="row"
          align="center"
          gap="lg"
          className="flex items-center"
        >
          <Frame
            direction="row"
            gap="sm"
            align="center"
            className="flex items-center"
          >
            <Button
              variant="transparent"
              colorScheme="primary"
              onClick={() => (window.location.href = "/notifications")}
              className="font-medium px-3 py-2"
            >
              알림
            </Button>
            <Button
              variant="transparent"
              colorScheme="primary"
              onClick={() => (window.location.href = "/settings")}
              className="font-medium px-3 py-2"
            >
              설정
            </Button>
          </Frame>
          <Surface
            as="div"
            className="h-6 w-px flex-shrink-0"
            background="secondary-system01-2-rest"
          />
          <Frame
            direction="row"
            gap="md"
            align="center"
            className="flex items-center"
          >
            <Text
              variant="body-2"
              weight="medium"
              color="primary-system01-1-rest"
              className="whitespace-nowrap"
            >
              홍길동
            </Text>
            <Text
              variant="caption-1"
              color="secondary-system01-2-rest"
              className="whitespace-nowrap"
            >
              개발팀 · 팀장
            </Text>
          </Frame>
        </Frame>
      </Frame>
    </Surface>
  );
}
