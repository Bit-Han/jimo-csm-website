// // app/(public)/layout.tsx
// import Script from "next/script";
// import type { Metadata } from "next";
// import { PublicHeader } from "@/components/public/Header";
// import { PublicFooter } from "@/components/public/Footer";
// import { getSeoSettings } from "@/lib/services/seo.service";
// import { getSettings } from "@/lib/services/settings.service";

// export async function generateMetadata(): Promise<Metadata> {
//   const seo = await getSeoSettings();
//   const title = seo?.siteTitle ?? "Jimo Property Development";
//   return {
//     title: { default: title, template: `%s | ${title}` },
//     description: seo?.metaDescription ?? "Building Africa's next innovative real estate.",
//   };
// }

// export default async function PublicLayout({ children }: { children: React.ReactNode }) {
//   const settings = await getSettings();

//   return (
//     <>
//       {settings?.googleTagManagerId && (
//         <Script id="gtm" strategy="afterInteractive">
//           {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${settings.googleTagManagerId}');`}
//         </Script>
//       )}
//       <PublicHeader />
//       <main>{children}</main>
//       <PublicFooter />
//     </>
//   );
// }




// app/(public)/layout.tsx
import type { Metadata } from "next";
import  Header  from "@/components/public/layout/Header";
import Footer from "@/components/public/layout/Footer";

export const metadata: Metadata = {
  title: {
    default: "Jimo Property Development Limited",
    template: "%s | Jimo Property Development",
  },
  description:
    "Developing Premium Real Estate with Structure, Insight, and Long-Term Value. Explore our projects in Lagos.",
  metadataBase: new URL("https://jimopropertydevelopment.com"),
  openGraph: {
    type: "website",
    siteName: "Jimo Property Development Limited",
  },
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen ">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}