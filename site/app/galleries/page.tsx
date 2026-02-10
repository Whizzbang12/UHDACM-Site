import PageRenderer from "../_pageRenderer/PageRenderer";
import { WrapInNavbarAndFooter } from "../_utils/tsxServerTools";

export default async function Page() {
  return (
    <WrapInNavbarAndFooter>
      <PageRenderer page="page-galleries" />
    </WrapInNavbarAndFooter>
  );
}

// import MainHeroSection from "../_sections/MainHeroSection/MainHeroSection";
// import { DefaultChevronRight, DefaultEllipsis } from "@/app/_icons/Icons";
// import CoolImage from "../_components/CoolImage/CoolImage";
// import CallToActionSection from "../_sections/CallToActionSection/CallToActionSection";
// // import FeaturedEventSection from "../_sections/FeaturedEventSection/FeaturedEvent";
// import EntrySearchTool from "../_components/EntrySearchTool/EntrySearchTool";
// import Button from "../_components/Button/Button";
// import { fetchCMS } from "../_utils/cms";
// import { isValidSiteEvent } from "../_utils/validation";
// import { Suspense } from "react";
// import { EntryTileProps } from "../_components/EntryTile/EntryTile";
// import { EventToEntry } from "../_utils/tsxTools";
// import SearchSection from "../_sections/SearchSection/SearchSection";

// export default async function Page() {

//   return (
//     <div style={{ display: "flex", flexDirection: "column" }}>
//       <MainHeroSection
//         spanText="GALLERIES"
//         title={`Something Catchy\nN'Stuff Here`}
//         leftStyle={{ flex: 1 }}
//         rightStyle={{ flex: 1 }}
//         addNavbarPadding={true}
//         rightContent={<CoolImage src="/sjd.JPG" />}
//       />
//       {/* <FeaturedEventSection /> */}
//       <SearchSection
//         header={"Search Galleries"}
//         type={"galleries"}
//         listingMode={"before"}
//         defaultSortingMode={"descending"}
//       />
//       <CallToActionSection
//         title={`Want to collaborate\nwith UHDACM?`}
//         subtitle="We'd love to hear from u or sumn"
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
//               <span style={{ fontWeight: 500 }}>Collab with UHD ACM</span>
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
