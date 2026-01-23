import { buildCMSFetchURL } from "@shared/types/cms/CMSFuncs";
import {
  cmsSingleTypePage,
} from "./types/cms/cmsTypes";
import { fetchableCMSCollection } from "@shared/types/cms/CMSTypes";


// TODO: swap with entity service
export async function fetchCMS(
  path: fetchableCMSCollection,
  params?: Record<string, any>,
  additionalTags?: fetchableCMSCollection[] | "any",
) {
  try {
    const { url, dependencyTags } = buildCMSFetchURL(`${process.env.NEXT_PUBLIC_CMS_URL}`, path, params, additionalTags);
    if (!url) {
      console.error('77cshias', path, params, additionalTags)
      throw new Error('Could not generate fetch url');
    }
    const res = await fetch(url, {
      next: {
        tags: dependencyTags,
      },
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
      },
    });
    if (!res.ok) {
      console.log("!!!!!!!!!!error!!!!!!!!!!\n", res);
      throw new Error(`Failed to fetch API: ${path}`);
    }
    const data = await res.json();
    console.log("fetched data:", data);
    return data;
  } catch {
    return null;
  }
}

export async function fetchCMSPage(page: cmsSingleTypePage) {
  const populateList: string[] = [
    "sections",
    "sections.type",
    "sections.leftComponent",
    "sections.rightComponent",
    "sections.leftComponent.form",
    "sections.rightComponent.form",
    "sections.leftComponent.textBlock",
    "sections.rightComponent.textBlock",
    "sections.leftComponent.textBlock.buttons",
    "sections.rightComponent.textBlock.buttons",

    "sections.leftComponent.imageCollection",
    "sections.rightComponent.imageCollection",
    "sections.leftComponent.imageCollection.images",
    "sections.rightComponent.imageCollection.images",

    "sections.leftComponent.singleImage",
    "sections.rightComponent.singleImage",
    "sections.leftComponent.singleImage.image",
    "sections.rightComponent.singleImage.image",

    "sections.leftComponent.floatingImages",
    "sections.rightComponent.floatingImages",
    "sections.leftComponent.floatingImages.images",
    "sections.rightComponent.floatingImages.images",
  ];

  const params: { [key: string]: string } = {};
  for (const i in populateList) {
    params[`populate[${i}]`] = `${populateList[i]}`;
  }

  return await fetchCMS(page, params);
}