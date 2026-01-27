import { buildCMSFetchURL, cmsPageFetchParams } from "@shared/types/cms/CMSFuncs";
import {
  cmsSingleTypePage,
} from "@shared/types/cms/CMSTypes";
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
  return await fetchCMS(page, cmsPageFetchParams);
}