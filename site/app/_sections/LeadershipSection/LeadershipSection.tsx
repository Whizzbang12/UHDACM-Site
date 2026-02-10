'use server'

import PersonTile from "@/app/_components/PersonTile/PersonTile";
import { fetchCMS } from "@/app/_utils/cms";
import { Person, SocialObj } from "@shared/types/cms/CMSTypes";
import { TryGetImageFormatUrl } from "@/app/_utils/types/cms/cmsTypeTools";
import { isValidLeadership } from "@shared/types/cms/CMSCheck";
import { isPerson } from "@shared/types/cms/CMSCheck";
import { public_env_vars } from "@/app/_utils/public_env_vars";

export default async function LeadershipSection({ sectionID }: { sectionID?: string }) {
  const res = await fetchCMS("leadership", {
    "populate[people][populate]": "*",
  }, ['people']);

  if (!res) {
    return;
  }

  const leadership = res.data;

  if (!isValidLeadership(leadership)) {
    return;
  }

  // const people = [...leadership.people, ...leadership.people, ...leadership.people, ...leadership.people];
  const people = leadership.people;

  const validPeople: Person[] = people.filter((person: any) => {
    if (!isPerson(person)) {
      return false;
    }
    return true;
  });

  return (
    <div className={"SectionRoot"} style={{margin: '4rem 0rem'}} id={sectionID}>
      <div className={"SectionInner"}>
        <h1 className={`H1`} style={{ whiteSpace: "pre-line", marginBottom: '0.5rem', textAlign: 'center' }}>
          Meet our Leadership
        </h1>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "0.5rem",
          }}
        >
          {validPeople.map((person, idx) => (
            <PersonTile
              key={idx}
              imgCoverOrContain="cover"
              img={`${person.picture ? TryGetImageFormatUrl(person.picture, 'medium', public_env_vars.NEXT_PUBLIC_CMS_URL) : ''}`}
              previewTitle={person.nameShort}
              fullTitle={person.name}
              previewSubTitle={person.roleShort}
              fullSubtitle={person.role}
              fullDescription={person.description}
              socials={person.socials.map((social: SocialObj) => ({
                icon: social.type,
                href: social.url,
              }))}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
