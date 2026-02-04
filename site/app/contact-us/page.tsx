import PageRenderer from "../_pageRenderer/PageRenderer";
import { WrapInNavbarAndFooter } from "../_utils/tsxServerTools";

export default async function Page() {
  return (
    <WrapInNavbarAndFooter>
      <PageRenderer page="page-contact" />
    </WrapInNavbarAndFooter>
  );
}

// import MainHeroSection from "../_sections/MainHeroSection/MainHeroSection";
// import styles from './contact.module.css'

// export default async function Page() {
//   return (
//     <div style={{ display: "flex", flexDirection: "column" }}>
//       <MainHeroSection
//         spanText="JOIN"
//         title={`Reach Out!`}
//         subtitle={`We’re just a couple clicks away!\nQuestions, Suggestions, Collaboration, Sponsors, etc.\n\nJust enter your email, leave a message, and we’ll reply to you in 24-48 hours.`}
//         leftStyle={{ flex: 1 }}
//         rightStyle={{ flex: 1, width: '90%' }}
//         dontReverseOnMobile={true}
//         topLevelClassName={styles.contactHero}
//         addNavbarPadding={true}
//         rightContent={
//           <div className={`${styles.form}`}>
//             <iframe
//               src="https://forms.fillout.com/t/k8YWLofVmaus"
//               width="100%"
//               height="100%"
//               style={{ border: "none", borderRadius: "8px" }}
//               title="Contact Us Form"
//               allowFullScreen
//             />
//           </div>
//         }
//       />
//     </div>
//   );
// }
