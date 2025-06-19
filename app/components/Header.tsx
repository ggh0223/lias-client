"use client";

import Link from "next/link";
import { Frame, Text, Surface } from "lumir-design-system-shared";
import { Button } from "lumir-design-system-02";

export default function Header() {
  return (
    <Surface
      as="header"
      background="secondary-system01-inverse-rest"
      boxShadow="30"
      className="flex-none w-full sticky top-0 z-50 backdrop-blur-xl bg-white/90"
    >
      <Frame
        direction="row"
        align="center"
        className="h-16 px-8 max-w-7xl mx-auto flex justify-between items-center"
      >
        <Link href="/" className="flex items-center group">
          <Frame className="relative">
            <Frame className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-300"></Frame>
            <Text
              variant="heading-1"
              color="primary-system01-1-rest"
              className="font-bold tracking-tight relative bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:from-blue-700 group-hover:to-purple-700 transition-all duration-300"
            >
              LIAS
            </Text>
          </Frame>
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
              className="font-medium px-4 py-2 rounded-xl hover:bg-blue-50 hover:shadow-md transition-all duration-200 group"
            >
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <span className="group-hover:translate-x-0.5 transition-transform duration-200">
                  알림
                </span>
              </div>
            </Button>
            <Button
              variant="transparent"
              colorScheme="primary"
              onClick={() => (window.location.href = "/settings")}
              className="font-medium px-4 py-2 rounded-xl hover:bg-blue-50 hover:shadow-md transition-all duration-200 group"
            >
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-slate-500 to-gray-500 flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <span className="group-hover:translate-x-0.5 transition-transform duration-200">
                  설정
                </span>
              </div>
            </Button>
          </Frame>

          <div className="h-8 w-px bg-gradient-to-b from-transparent via-slate-300 to-transparent"></div>

          <Frame
            direction="row"
            gap="md"
            align="center"
            className="flex items-center"
          >
            <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors duration-200 group">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm shadow-lg">
                <Text variant="body-2" weight="medium" color="white">
                  홍
                </Text>
              </div>
              <div className="flex flex-col">
                <Text
                  variant="body-2"
                  weight="medium"
                  color="primary-system01-1-rest"
                  className="whitespace-nowrap group-hover:text-blue-600 transition-colors duration-200"
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
              </div>
            </div>
          </Frame>
        </Frame>
      </Frame>
    </Surface>
  );
}
