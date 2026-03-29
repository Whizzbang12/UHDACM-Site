import { notFound } from "next/navigation";
import SplitHeroSection from "../_sections/SplitHeroSection/SplitHeroSection";
import { SplitHeroColumnSingleImage, SplitHeroColumnTextBlock } from "@shared/types/cms/CMSTypes";
import Chatbot from "../_features/chatbot/chatbot";

export default function PlaygroundPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }


  const compL: SplitHeroColumnSingleImage = {
    type: "singleImage",
    singleImage: {
      image: {
        alternativeText: "",
        caption: "",
        formats: {},
        height: 0,
        width: 0,
        id: 192401924,
        name: "hell nah",
        url: "https://www.asdwa.org/wp-content/uploads/2023/06/ASDWA-Social-Logo_400x400.png",
      },
    },
  };

  const compR: SplitHeroColumnTextBlock = {
    type: 'textBlock',
    textBlock: {
      // preheader: 'method',
      header: '$#NApply skills$#,\\n$#PCreate Projects$#,\\n$#SMake connections$#',
      headerType: 'Title',
      subheader: 'ACM brings together students who love exploring technology, learning\n new skills, and creating real projects with others.',
      alignment: 'center',
      buttons: [],
      buttonsVisible: false,
    }
  }

  return (
    <div>
      <Chatbot />
    </div>
  )

  // return (
  //   <div>
  //     <SplitHeroSection
  //       // leftComponent={compL}
  //       rightComponent={compR}
  //       centerIfPossible={true}
  //       reverseOnDesktop={false}
  //       reverseOnMobile={false}
  //       sectionID={""}
  //     />
  //     <SplitHeroSection
  //       // leftComponent={compL}
  //       rightComponent={compR}
  //       centerIfPossible={true}
  //       reverseOnDesktop={false}
  //       reverseOnMobile={false}
  //       sectionID={""}
  //     />
  //     <SplitHeroSection
  //       // leftComponent={compL}
  //       rightComponent={compR}
  //       centerIfPossible={true}
  //       reverseOnDesktop={false}
  //       reverseOnMobile={false}
  //       sectionID={""}
  //     />
  //     <SplitHeroSection
  //       // leftComponent={compL}
  //       rightComponent={compR}
  //       centerIfPossible={true}
  //       reverseOnDesktop={false}
  //       reverseOnMobile={false}
  //       sectionID={""}
  //     />
  //     <SplitHeroSection
  //       // leftComponent={compL}
  //       rightComponent={compR}
  //       centerIfPossible={true}
  //       reverseOnDesktop={false}
  //       reverseOnMobile={false}
  //       sectionID={""}
  //     />
  //   </div>
  // );

  // const compL: SplitHeroColumnSingleImage = {
  //   type: "singleImage",
  //   singleImage: {
  //     image: {
  //       alternativeText: "",
  //       caption: "",
  //       formats: {},
  //       height: 0,
  //       width: 0,
  //       id: 192401924,
  //       name: "hell nah",
  //       url: "https://www.asdwa.org/wp-content/uploads/2023/06/ASDWA-Social-Logo_400x400.png",
  //     },
  //   },
  // };

  // const compR: SplitHeroColumnTextBlock = {
  //   type: 'textBlock',
  //   textBlock: {
  //     preheader: 'method',
  //     header: '$#PITS$#',
  //     headerType: 'H2',
  //     subheader: 'WHAT!',
  //     alignment: 'left',
  //     buttons: [],
  //     buttonsVisible: false,
  //   }
  // }

  // return (
  //   <div>
  //     <SplitHeroSection
  //       leftComponent={compL}
  //       rightComponent={compR}
  //       centerIfPossible={false}
  //       reverseOnDesktop={false}
  //       reverseOnMobile={false}
  //       sectionID={""}
  //     />
  //   </div>
  // );
}
