import { isCMSCollectionSingular, isCMSSingleType, isCMSSingleTypePage } from "../cms/CMSCheck";
import { cmsCollectionsSingular } from "../cms/CMSTypes";
import { DBTicket } from "./ticketTypes";

export function checkDBTicket(value: any): asserts value is DBTicket {
  if (typeof value !== "object" || value === null) {
    throw new Error("Value is not a non-null object.");
  }

  const { collection, tries, failed, id } = value as DBTicket;

  if (!("collection" in value)) {
    throw new Error("Missing 'collection' property in value.");
  }
  if (!isCMSCollectionSingular(collection) && !isCMSSingleType(collection) && !isCMSSingleTypePage(collection)) {
    throw new Error(`'collection' property (${collection}) is not a valid CMSCollectionSingular.`);
  }

  if (!("tries" in value)) {
    throw new Error("Missing 'tries' property in value.");
  }
  if (typeof tries !== "number") {
    throw new Error("'tries' property is not a number.");
  }

  if (!("failed" in value)) {
    throw new Error("Missing 'failed' property in value.");
  }
  if (typeof failed !== "boolean") {
    throw new Error("'failed' property is not a boolean.");
  }

  if (id && typeof id !== "string") {
    throw new Error("'id' property is not a string.");
  }
}