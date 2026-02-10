import PageRenderer from "../_pageRenderer/PageRenderer";
import { WrapInNavbarAndFooter } from "../_utils/tsxServerTools";

export default async function Page() {
  return (
    <WrapInNavbarAndFooter>
      <PageRenderer page="page-events" />
    </WrapInNavbarAndFooter>
  );
}

// import MainHeroSection from "../_sections/MainHeroSection/MainHeroSection";
// import { DefaultChevronRight } from "@/app/_icons/Icons";
// import CoolImage from "../_components/CoolImage/CoolImage";
// import CallToActionSection from "../_sections/CallToActionSection/CallToActionSection";
// import FeaturedEventSection from "../_sections/FeaturedEventSection/FeaturedEventSection";
// import Button from "../_components/Button/Button";
// import styles from "./eventsPage.module.css";
// import SearchSection from "../_sections/SearchSection/SearchSection";

// export default async function Page() {
//   return (
//     <div className={styles.pageRoot}>
//       <MainHeroSection
//         spanText="EVENTS"
//         title={`Something Catchy\nN'Stuff Here`}
//         leftStyle={{ flex: 1 }}
//         rightStyle={{ flex: 1 }}
//         addNavbarPadding={true}
//         rightContent={<CoolImage src="/sjd.JPG" />}
//       />
//       <FeaturedEventSection />
//       <SearchSection header={'Search Events'} type={'events'} listingMode={'after'} defaultSortingMode={'ascending'} />
//       <CallToActionSection
//         title={`Want to collaborate\nwith UHDACM?`}
//         subtitle="We'd love to hear from u or sumn"
//         actionComponent={
//           <Button>
//             <div className={styles.collabButtonContent}>
//               <span className={styles.collabButtonText}>
//                 Collab with UHD ACM
//               </span>
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
