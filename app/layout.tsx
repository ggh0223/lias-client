// import { Geist } from "next/font/google";
// import { usePathname } from "next/navigation";
// import { AuthProvider } from "../src/context/AuthContext";

// // 애플리케이션 스타일
// import "./globals.css";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   const pathname = usePathname();
//   const isLoginPage = pathname === "/login";

//   return (
//     <html lang="ko" data-theme="light">
//       <head>
//         <link rel="manifest" href="/manifest.json" />
//         <meta name="theme-color" content="#ffffff" />
//       </head>
//       <body className={geistSans.variable}>
//         <AuthProvider>
//           {isLoginPage ? (
//             // 로그인 페이지일 때는 헤더와 사이드바 없이 렌더링
//             <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30">
//               {children}
//             </div>
//           ) : (
//             // 일반 페이지일 때는 헤더와 사이드바 포함
//             <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30">
//               <div className="flex flex-col h-screen">
//                 <div className="flex-1 overflow-auto p-8 bg-white/40 backdrop-blur-sm">
//                   {children}
//                 </div>
//               </div>
//             </div>
//           )}
//         </AuthProvider>
//       </body>
//     </html>
//   );
// }

import "./globals.css";
// import ToastProvider from "./_provider/toast-provider";
// import ServiceWorkerInitializer from "@/components/service-worker-initializer";

// export const metadata: Metadata = {
//   title: "LIAS - Lumir Integrated Approval System",
//   description: "Developed by Lumir Web Dev Team",
// };

// const pretendard = localFont({
//   src: "../../../packages/ui/fonts/PretendardVariable.ttf",
//   display: "swap",
//   weight: "45 920",
//   variable: "--font-pretendard",
// });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        {/* <ServiceWorkerInitializer /> */}
        {children}
      </body>
    </html>
  );
}
