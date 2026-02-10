import PageRenderer from "../_pageRenderer/PageRenderer";
import { WrapInNavbarAndFooter } from "../_utils/tsxServerTools";

export default async function Page() {
  return (
    <WrapInNavbarAndFooter>
      <PageRenderer page="page-about" />
    </WrapInNavbarAndFooter>
  );
}

// import MainHeroSection from "../_sections/MainHeroSection/MainHeroSection";
// import { DefaultChevronRight } from "@/app/_icons/Icons";
// import CoolImage from "../_components/CoolImage/CoolImage";
// import CallToActionSection from "../_sections/CallToActionSection/CallToActionSection";
// import Button from "../_components/Button/Button";
// import LeadershipSection from "../_sections/LeadershipSection/LeadershipSection";

// export default async function Page() {
//   return (
//     <div
//       style={{
//         display: "flex",
//         flexDirection: "column",
//         justifyContent: "center",
//         alignItems: "center",
//       }}
//     >
//       <MainHeroSection
//         spanText="ABOUT"
//         title={`UHD's home for all things computing`}
//         leftStyle={{ flex: 1 }}
//         rightStyle={{ flex: 1 }}
//         addNavbarPadding={true}
//         rightContent={<CoolImage src="/sjd.JPG" />}
//       />
//       <MainHeroSection
//         title={`We are UHD ACM`}
//         titleClassName="H1"
//         subtitle={`The University of Houston-Downtown’s Chapter of the Association for Computing Machinery.\nFostering community, learning, and innovation through events, projects, and collaboration for students of all skill levels at UHD.`}
//         reverseOrder={true}
//         leftStyle={{ flex: 1 }}
//         rightStyle={{ flex: 1 }}
//         rightContent={<CoolImage src="/sjd.JPG" />}
//       />
//       <LeadershipSection />
//       <CallToActionSection
//         title={`Want to be\nan officer?`}
//         subtitle="Your leadership journey starts here"
//         actionComponent={
//           <Button href='/join#become-an-officer'>
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
//       />
//     </div>
//   );
// }
