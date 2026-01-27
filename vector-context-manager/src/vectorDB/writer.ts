import { ChromaClient, Collection } from "chromadb";
import fs from "fs";
import path from "path";
import { env_vars } from "../env/envVars";
import {
  cmsCollectionsSingular,
  cmsSingleTypePages,
  cmsSingleTypes,
  QnA,
  SiteEvent,
  SiteSection,
  SplitHeroColumn,
  StrapiPicture,
} from "@shared/types/cms/CMSTypes";
import {
  DBCreate,
  DBDelete,
  DBDeleteWithID,
  DBGet,
  DBSetWithID,
} from "../db/db";
import { DBTicket } from "@shared/types/ticket/ticketTypes";
import { checkDBTicket } from "@shared/types/ticket/ticketCheck";
import {
  buildCMSFetchURL,
  cmsPageFetchParams,
  TryGetImageFormatPath,
} from "@shared/types/cms/CMSFuncs";
import {
  isCMSCollectionSingular,
  isCMSSingleType,
  isCMSSingleTypePage,
  isStrapiPicture,
  isValidFeaturedEvent,
  isValidLeadership,
  isValidQnA,
  isValidSiteEvent,
  isValidSiteInfo,
  isValidSiteSection,
  isValidSiteSectionFeaturedEvent,
  isValidSiteSectionLatestQnA,
  isValidSiteSectionLeadership,
  isValidSiteSectionSearch,
  isValidSiteSectionSplitHero,
  isValidSplitHeroColumnFloatingImages,
  isValidSplitHeroColumnForm,
  isValidSplitHeroColumnImageCollection,
  isValidSplitHeroColumnNone,
  isValidSplitHeroColumnSingleImage,
  isValidSplitHeroColumnTextBlock,
} from "@shared/types/cms/CMSCheck";

const maxTicketRetries = 3;

type VectorDBWriterState = "initializing" | "idle" | "health_check" | "writing";
const cmsCollections = [
  ...cmsCollectionsSingular,
  ...cmsSingleTypes,
  ...cmsSingleTypePages,
]; // all the single type collections in the cms

class VectorDBWriter {
  private client = new ChromaClient({
    host: env_vars.CHROMA_DB_HOST,
    port: env_vars.CHROMA_DB_PORT,
  });

  private state: VectorDBWriterState = "initializing";

  constructor() {
    if (GlobalVectorDBWriter)
      throw new Error(
        "You cannot create more than on VectorDBWriter right now.",
      );
    this.state = "idle";
    this.healthCheck();
  }

  private async healthCheck() {
    if (this.state != "idle") return;
    console.log("health checking");
    this.state = "health_check";

    let vectorDBCollection: Collection | undefined = undefined;
    try {
      vectorDBCollection = await this.client.getCollection({
        name: env_vars.CHROMA_DB_COLLECTION_NAME,
      });
    } catch {
      vectorDBCollection = await this.client.createCollection({
        name: env_vars.CHROMA_DB_COLLECTION_NAME,
      });
    }

    try {
      const promises: Promise<void>[] = [];
      for (const cmsCollection of cmsCollections) {
        // if this collection + metadata combo has AT LEAST one item, then it will return that one item, at minimum
        // an empty collection + metadata combo will return nothing, and we can work with that.
        const res = await vectorDBCollection.get({
          where: {
            collection: cmsCollection,
          },
          limit: 1,
        });

        if (res.documents.length == 0) {
          promises.push(
            new Promise(async (res) => {
              // possibly unprocessed collection, should fetch from cms.
              console.log(cmsCollection, "empty collection, should process");
              const existingCollectionTicket = await DBGet("ticket", [
                ["collection", "==", cmsCollection],
              ]);
              if (existingCollectionTicket.length > 0) {
                // if an exising ticket exists, do not create new one.
                return res();
              }
              // check if
              const ticket: DBTicket = {
                collection: cmsCollection,
                failed: false,
                tries: 0,
              };
              await DBCreate("ticket", ticket);
              res();
            }),
          );
        }
        // console.log("health check res", JSON.stringify(res, null, 2));
      }
      await Promise.all(promises);
    } catch (e) {
      console.error("error while health checking", (e as Error).message);
    }

    this.state = "idle";
    this.write();
  }

  async write() {
    if (this.state != "idle") return;
    this.state = "writing";
    let ticketsDone = 0;
    while (true) {
      try {
        const topTicket = await DBGet(
          "ticket",
          [["failed", "==", false]],
          undefined,
          undefined,
          1,
        );
        if (topTicket.length == 0) {
          break;
        }

        const ticket = topTicket[0]!;
        console.log("\n\nprocessing", JSON.stringify(ticket, null, 2));
        try {
          checkDBTicket(ticket);
        } catch (e) {
          await DBDeleteWithID("ticket", ticket.id);
          console.error("ticket error", (e as Error).message);
          continue;
        }
        await this.processTicket(ticket);
        ticketsDone += 1;
        // process ticket
      } catch (e) {
        console.log(`Problem ${(e as Error).message}`);
      }
    }
    console.log("done writing: ", ticketsDone);
    this.state = "idle";
  }

  private async processTicket(ticket: DBTicket) {
    // increment ticket
    ticket.tries += 1;
    if (ticket.tries > maxTicketRetries) {
      ticket.failed = true;
    }

    // TODO: find a system that will allow failed ticket increments to be handled properly.
    // this can result in a forever loop.
    try {
      await DBSetWithID("ticket", ticket.id!, ticket);
    } catch {
      console.error("failed to increment ticket");
      return false;
    }

    if (ticket.tries > maxTicketRetries) {
      console.log("exceeded limit");
      return false;
    }

    // fetch data from cms

    const collection = ticket.collection;
    let collectionDataStringArray: string[] = [];
    console.log("working", collection);
    if (isCMSSingleTypePage(collection)) {
      try {
        const { url } = buildCMSFetchURL(
          `${env_vars.CMS_URL}`,
          collection,
          cmsPageFetchParams,
        );
        if (!url) {
          // TODO: fails silently
          console.error("udasidaid", url);
          return false;
        }

        const res = await (
          await fetch(url, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${env_vars.CMS_API_TOKEN}`,
            },
          })
        ).json();

        console.log("fetched data", res);
        const { data } = res;

        const fetchedSections = data?.sections || [];

        const sections: SiteSection[] = [];
        for (const section of fetchedSections) {
          isValidSiteSection(section);
          sections.push(section);
        }

        console.log("1 ==");

        const pageData: string[] = [];
        for (const section of sections) {
          if (isValidSiteSectionLeadership(section)) {
            pageData.push("leadership-section");
          } else if (isValidSiteSectionFeaturedEvent(section)) {
            pageData.push(
              `featured event, ${section.header ? "header" + section.header : ""}`,
            );
          } else if (isValidSiteSectionLatestQnA(section)) {
            pageData.push(
              `Section buttons: [Latest QnA, All QnA] (Question and Answer Interview Video)`,
            );
          } else if (isValidSiteSectionSearch(section)) {
            pageData.push(
              `Search ${section.type} ${section.type == "qnas" ? "Question and Answer Interview Video" : ""}${section.header ? ", header" + section.header : ""}`,
            );
          } else if (isValidSiteSectionSplitHero(section)) {
            const processComps = (component: SplitHeroColumn | undefined) => {
              if (component == null) {
                return null;
              }
              if (isValidSplitHeroColumnNone(component)) {
                return;
              } else if (isValidSplitHeroColumnTextBlock(component)) {
                const { textBlock } = component;
                let res = "";
                res += `${textBlock.preheader} ${textBlock.header} ${textBlock.subheader}.`;
                if (textBlock.buttons) {
                  res += " Buttons: ";
                  for (const button of textBlock.buttons) {
                    res += `("${button.text}", link/href: ${button.href[0] == "/" ? env_vars.FRONTEND_URL : ""}${button.href} (${button.target}), icon: ${button.icon}), `;
                  }
                }
                return res;
              } else if (isValidSplitHeroColumnSingleImage(component)) {
                const { singleImage } = component;
                const { image } = singleImage;
                return `Single Image, alt: ${image.alternativeText}, cap: ${image.caption}, name: ${image.name}, url: ${image.url}`;
              } else if (isValidSplitHeroColumnImageCollection(component)) {
                const { images } = component.imageCollection;
                let res = "Image Collection | ";
                for (const image of images) {
                  res += `[Image, alt: ${image.alternativeText}, cap: ${image.caption}, name: ${image.name}, url: ${image.url}],`;
                }
                res += ")";
                return res;
              } else if (isValidSplitHeroColumnFloatingImages(component)) {
                const { images } = component.floatingImages;
                let res = "floating images | ";
                for (const image of images) {
                  res += `[Image, alt: ${image.alternativeText}, cap: ${image.caption}, name: ${image.name}, url: ${image.url}],`;
                }
                return res;
              } else if (isValidSplitHeroColumnForm(component)) {
                let res = `Form: ${component.form.iFrameFormUrl}`;
                return res;
              } else {
                // TODO: fails silently
                console.error("unhandled component");
                return "";
              }
            };

            const leftRes = processComps(section.leftComponent);
            const rightRes = processComps(section.rightComponent);
            let sectionData = "";
            if (leftRes) {
              sectionData += leftRes + " | ";
            }
            if (rightRes) {
              sectionData += rightRes;
            }

            if (sectionData) {
              pageData.push(sectionData);
            }
          } else {
            console.error(
              "unhanlded section",
              JSON.stringify(section, null, 2),
            );
          }
        }

        console.log("2 ==");
        let pageURL = env_vars.FRONTEND_URL+'/';
        switch (collection) {
          case 'page-about' :
            pageURL += 'about';
            break;
          case 'page-contact':
            pageURL += 'contact';
            break;
          case 'page-events' :
            pageURL += 'events';
            break;
          case 'page-galleries' :
            pageURL += 'galleries';
            break;
          case 'page-home' :
            pageURL += '';
            break;
          case 'page-join' :
            pageURL += 'join';
            break;
          case 'page-media':
            pageURL += 'media';
            break;
          case 'page-qnas':
            pageURL += 'qnas';
            break;
        }

        collectionDataStringArray.push(`${pageURL}\n`+ pageData.join("\n")+'\n');
      } catch (e) {
        // TODO: fails silently
        console.error("vs89hosidv", (e as Error).message);
        return false;
      }
    } else if (isCMSSingleType(collection)) {
      if (collection == "featured-event") {
        const { url } = buildCMSFetchURL(
          `${env_vars.CMS_URL}`,
          "featured-event",
          {
            "populate[event][populate]": "*",
            populate: "previewImageHD",
          },
        );

        if (!url) {
          // TODO: fails silently
          console.error("udasidaid", url);
          return false;
        }

        const res = await (
          await fetch(url, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${env_vars.CMS_API_TOKEN}`,
            },
          })
        ).json();

        const featuredEvent = res.data;
        if (isValidFeaturedEvent(featuredEvent)) {
          collectionDataStringArray.push(
            `Featured event: ${featuredEvent.event.name}, ${featuredEvent.event.dateStart} - ${featuredEvent.event.dateEnd}, ${featuredEvent.event.location}, ${featuredEvent.event.descriptionShort}, (${env_vars.FRONTEND_URL}/${featuredEvent.event.urlSlug}) ${featuredEvent.previewImageHD}`,
          );
        } else {
          console.error("featured event invalid");
        }
      } else if (collection == "leadership") {
        const { url } = buildCMSFetchURL(`${env_vars.CMS_URL}`, "leadership", {
          "populate[people][populate]": "*",
        });

        if (!url) {
          // TODO: fails silently
          console.error("udasgnaidaid", url);
          return false;
        }

        // TODO: Every single one of these fetches is so unsafe.
        const res = await (
          await fetch(url, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${env_vars.CMS_API_TOKEN}`,
            },
          })
        ).json();

        const leadership = res.data;
        if (isValidLeadership(leadership)) {
          const people = leadership.people;
          for (const person of people) {
            collectionDataStringArray.push(
              `${person.role}: ${person.name} ${person.picture ? TryGetImageFormatPath(person.picture, "small", env_vars.CMS_URL) : ""} ${person.description} | ${person.socials.map((social) => social.type + ": " + social.url + ", ")}`,
            );
          }
        }
      } else if (collection == "site-info") {
        const { url } = buildCMSFetchURL(env_vars.CMS_URL, "site-info", {
          populate: "*",
        });

        if (!url) {
          // TODO: fails silently
          console.error("udasacsidaid", url);
          return false;
        }

        const res = await (
          await fetch(`${url}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${env_vars.CMS_API_TOKEN}`,
            },
          })
        ).json();

        const { data } = res;
        if (isValidSiteInfo(data)) {
          collectionDataStringArray.push(
            `logo: ${data.logo ? TryGetImageFormatPath(data.logo, "small", env_vars.CMS_URL) : ""}`,
          );
          for (const social of data.socials || []) {
            collectionDataStringArray.push(
              `UHD ACM ${social.type} ${social.url}`,
            );
          }
        }
      }
    } else if (isCMSCollectionSingular(collection)) {
      if (collection == "event") {
        const { url } = buildCMSFetchURL(`${env_vars.CMS_URL}`, "events", {
          "populate[0]": "previewImage",
          "populate[1]": "gallery",
        });

        const res = await (
          await fetch(`${url}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${env_vars.CMS_API_TOKEN}`,
            },
          })
        ).json();

        const eventsRaw = res ? res.data : [];
        console.log("fetched events", eventsRaw);
        const validEvents: SiteEvent[] = [];
        for (const event of eventsRaw) {
          if (isValidSiteEvent(event)) {
            validEvents.push(event);
          }
        }

        console.log("checked events, done");

        for (const event of validEvents) {
          collectionDataStringArray.push(
            `Event: ${event.name}, ${event.dateStart} ${event.dateEnd}, has gallery: ${!!event.gallery}, ${event.location}, ${event.descriptionShort}, ${env_vars.FRONTEND_URL}/${event.urlSlug}, ${event.previewImage ? TryGetImageFormatPath(event.previewImage, "small", env_vars.CMS_URL) : ""}`,
          );
        }
      } else if (collection == "gallery") {
        const { url } = buildCMSFetchURL(`${env_vars.CMS_URL}`, "events", {
          "populate[0]": "previewImage",
          "populate[1]": "gallery",
          "populate[2]": "gallery.media",
        });

        const res = await (
          await fetch(`${url}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${env_vars.CMS_API_TOKEN}`,
            },
          })
        ).json();

        const eventsRaw = res ? res.data : [];
        const validEvents: SiteEvent[] = [];
        for (const event of eventsRaw) {
          if (isValidSiteEvent(event) && event.gallery) {
            validEvents.push(event);
          }
        }

        for (const event of validEvents) {
          const media = event.gallery?.media || [];

          const validMedia: StrapiPicture[] = [];
          for (const pic of media) {
            if (isStrapiPicture(pic)) {
              validMedia.push(pic);
            }
          }

          collectionDataStringArray.push(
            `Event Gallery: ${event.name}, ${event.dateStart} ${event.dateEnd}, has gallery: ${!!event.gallery}, ${event.location}, ${event.descriptionShort}, ${env_vars.FRONTEND_URL}/${event.urlSlug}, ${event.previewImage ? TryGetImageFormatPath(event.previewImage, "small", env_vars.CMS_URL) : ""}, photo count: ${validMedia.length}`,
          );
        }
      } else if (collection == "qna") {
        const { url } = buildCMSFetchURL(`${env_vars.CMS_URL}`, "qnas", {
          populate: "thumbnail",
        });

        const res = await (
          await fetch(`${url}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${env_vars.CMS_API_TOKEN}`,
            },
          })
        ).json();

        const validQnAs: QnA[] = [];
        if (res) {
          const qnaRaw = res.data;
          for (const QnA of qnaRaw) {
            if (isValidQnA(QnA)) {
              validQnAs.push(QnA);
            }
          }
        }

        for (const QnA of validQnAs) {
          collectionDataStringArray.push(
            `QnA Interview "${QnA.videoName}" feat. ${QnA.featuredGuests}, ${QnA.descriptionShort}, uploaded ${QnA.uploadDate}, ${QnA.videoLink}, ${QnA.thumbnail ? TryGetImageFormatPath(QnA.thumbnail, "small", env_vars.CMS_URL) : ""}`,
          );
        }
      }
      // organization and person unhandled
      else {
        console.log("unhandled", collection);
      }
    }
    // delete all data from vectorDB about this collection
    let vectorDBCollection: Collection | undefined = undefined;
    try {
      vectorDBCollection = await this.client.getCollection({
        name: env_vars.CHROMA_DB_COLLECTION_NAME,
      });
    } catch {
      // creates collection if collection does not exist
      vectorDBCollection = await this.client.createCollection({
        name: env_vars.CHROMA_DB_COLLECTION_NAME,
      });
    }

    await vectorDBCollection.delete({
      where: {
        collection: collection,
      },
    });

    if (collectionDataStringArray.length == 0) {
      collectionDataStringArray.push(`empty`);
    }

    // update data in vectorDB about data
    await vectorDBCollection.add({
      documents: collectionDataStringArray,
      ids: collectionDataStringArray.map((_, i) => `${collection}-${i}`),
      metadatas: collectionDataStringArray.map(() => {
        return {
          collection: collection,
        };
      }),
    });

    // delete ticket
    await DBDeleteWithID("ticket", ticket.id!);
    console.log("fetch done", ticket.collection);
  }
}

export let GlobalVectorDBWriter: VectorDBWriter = new VectorDBWriter();
