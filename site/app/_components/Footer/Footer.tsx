import styles from './Footer.module.css'

import Link from "next/link";
import { defaultSocials, NavigationTree } from "@/app/_utils/globals";
import {
  DefaultDiscord,
  DefaultGithub,
  DefaultInstagram,
  DefaultLinkedin,
  DefaultYoutube,
} from "@/app/_icons/Icons";
import Logo from '../Logo/Logo';
import { isValidSiteInfo } from "@shared/types/cms/CMSCheck";
import { fetchCMS } from '@/app/_utils/cms';
import { SocialObj } from '@shared/types/cms/CMSTypes';
import { TryGetImageFormatUrl } from '@/app/_utils/types/cms/cmsTypeTools';


export default async function Footer() {
  let logoURL: string | undefined = undefined;
  let socials: SocialObj[] = defaultSocials;

  const res = await fetchCMS("site-info", { populate: "*" });
  if (res) {
    const data = res.data;
    if (isValidSiteInfo(data)) {
      logoURL = TryGetImageFormatUrl(data.logo, 'small');
      socials = data.socials || socials;
    }
  }
  

  return (
    <div className={`SectionRoot ${styles.footerRoot}`}>
      <div className={`SectionInner ${styles.footerInner}`}>
        <div className={styles.footerRow}>
          <Link href="/" className={styles.logoLink}>
            <Logo src={logoURL || undefined} />
          </Link>
          <div className={styles.navLinks}>
            {NavigationTree.map((entry) => (
              <Link
                key={entry.path}
                href={entry.path}
                className={`BodyLargeHeavy`}
              >
                {entry.title}
              </Link>
            ))}
          </div>
          <div className={styles.socialsCol}>
            <div className={`H3 ${styles.socialsRow}`}>
              {socials.map((social) => (
                <Link key={social.url} href={social.url} target="_blank">
                  {(() => {
                    switch (social.type) {
                      case "github":
                        return <DefaultGithub color="rgb(var(--color-font-default))" />;
                      case "linkedin":
                        return <DefaultLinkedin color="rgb(var(--color-font-default))" />;
                      case "youtube":
                        return <DefaultYoutube color="rgb(var(--color-font-default))" />;
                      case "instagram":
                        return <DefaultInstagram color="rgb(var(--color-font-default))" />;
                      case "discord":
                        return <DefaultDiscord color="rgb(var(--color-font-default))" />;
                      default:
                        return undefined;
                    }
                  })()}
                </Link>
              ))}
            </div>
          </div>
        </div>
        <span className={`BodySmall ${styles.copyright}`}>
          UHD ACM © All rights reserved.
        </span>
        {/* <span className={`BodySmall ${styles.copyright}`}>
          UHD ACM © {getTodayYMD()[0]}. All rights reserved.
        </span> */}
      </div>
    </div>
  );
}
