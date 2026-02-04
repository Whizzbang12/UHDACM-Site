import PageRenderer from "../_pageRenderer/PageRenderer";
import { WrapInNavbarAndFooter } from "../_utils/tsxServerTools";

export default async function Page() {
  return (
    <WrapInNavbarAndFooter>
      <PageRenderer page="page-media" />
    </WrapInNavbarAndFooter>
  );
}

// import MainHeroSection from "../_sections/MainHeroSection/MainHeroSection";
// import { DefaultChevronRight, DefaultSearch } from "@/app/_icons/Icons";
// import CoolImage from "../_components/CoolImage/CoolImage";
// import Button from "../_components/Button/Button";
// import FloatingImages from "../_components/FloatingImages/FloatingImages";
// import styles from "./media.module.css";
// import { fetchCMS } from "../_utils/cms";
// import { isValidQnA } from "../_utils/validation";
// import { ProduceCMSResourceURL } from "../_utils/tools";
// import LatestQnASection from "../_sections/LatestQnASection/LatestQnASection";

// export default async function Page() {
//   return (
//     <div style={{ display: "flex", flexDirection: "column" }}>
//       <MainHeroSection
//         spanText="MEDIA"
//         title={`Something about\nmedia here`}
//         leftStyle={{ flex: 1 }}
//         rightStyle={{ flex: 1 }}
//         addNavbarPadding={true}
//         rightContent={<CoolImage src="/sjd.JPG" />}
//       />
//       <MainHeroSection
//         title={`Our Memories in HD 4K IMAX`}
//         titleClassName="H1"
//         subtitle={`Something about our gallery and stuff like that.`}
//         reverseOrder={true}
//         leftStyle={{ flex: 1 }}
//         rightStyle={{ flex: 1, width: "100%" }}
//         rightContent={
//           <div className={`${styles.floatingImagesWrapper}`}>
//             <FloatingImages
//               imgs={[
//                 "/discord3d.webp",
//                 "Arbaz.jpeg",
//                 "/sjd.JPG",
//                 "/discord3d.webp",
//                 "Arbaz.jpeg",
//                 "/sjd.JPG",
//                 "/discord3d.webp",
//                 "Arbaz.jpeg",
//                 "/sjd.JPG",
//                 "/discord3d.webp",
//                 "Arbaz.jpeg",
//                 "/sjd.JPG",
//                 "/discord3d.webp",
//                 "Arbaz.jpeg",
//                 "/sjd.JPG",
//               ]}
//             />
//           </div>
//         }
//         bottomContent={
//           <Button style={{ marginTop: "0.5rem" }} href="/galleries">
//             <div
//               style={{
//                 display: "flex",
//                 gap: "0.25rem",
//                 alignItems: "center",
//                 fontWeight: 800,
//               }}
//             >
//               <span style={{ fontWeight: 500 }}>View Gallaries</span>
//               <DefaultChevronRight
//                 fontSize={"inherit"}
//                 style={{ marginRight: "-0.25rem" }}
//                 strokeWidth={"0.20rem"}
//               />
//             </div>
//           </Button>
//         }
//       />
//       <LatestQnASection />
//       <MainHeroSection
//         title={`Something about Newsletters`}
//         titleClassName="H1"
//         subtitle={`One of us, one of us, one of us. One of us, one of us, one of us. One of us, one of us, one of us.`}
//         reverseOrder={true}
//         leftStyle={{ flex: 1 }}
//         rightStyle={{ flex: 1 }}
//         rightContent={<CoolImage src="/sjd.JPG" />}
//         bottomContent={
//           <Button
//             style={{ marginTop: "0.5rem" }}
//             href="https://uhd.campusgroups.com/ACM/club_signup"
//             target="_blank"
//           >
//             <div
//               style={{
//                 display: "flex",
//                 gap: "0.25rem",
//                 alignItems: "center",
//                 fontWeight: 800,
//               }}
//             >
//               <span style={{ fontWeight: 500 }}>View Newsletters</span>
//               <DefaultChevronRight
//                 fontSize={"inherit"}
//                 style={{ marginRight: "-0.25rem" }}
//                 strokeWidth={"0.20rem"}
//               />
//             </div>
//           </Button>
//         }
//       />
//       {/* <CallToActionSection
//         title={`Want to be\nan officer?`}
//         subtitle="Your leadership journey starts here"
//         actionComponent={
//           <Button>
//             <div
//               style={{
//                 display: "flex",
//                 gap: "0.25rem",
//                 alignItems: "center",
//                 fontWeight: 800,
//               }}
//             >
//               <span style={{ fontWeight: 500 }}>Become an Officer</span>
//               <DefaultChevronRight
//                 fontSize={"inherit"}
//                 style={{ marginRight: "-0.25rem" }}
//                 strokeWidth={"0.20rem"}
//               />
//             </div>
//           </Button>
//         }
//       /> */}
//     </div>
//   );
// }
