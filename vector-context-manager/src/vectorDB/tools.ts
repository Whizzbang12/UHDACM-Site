import {
  cmsCollectionSingular,
  cmsSingleType,
  cmsSingleTypePage,
} from "@shared/types/cms/CMSTypes";
import { DBCreate, DBDeleteWithID, DBGet } from "../db/db";
import { DBTicket } from "@shared/types/ticket/ticketTypes";
import { checkDBTicket } from "@shared/types/ticket/ticketCheck";
import { LogMessage } from "../log/log";

export const createTicketForCollection = async (
  cmsCollection: cmsCollectionSingular | cmsSingleType | cmsSingleTypePage,
) => {
  // possibly unprocessed collection, should fetch from cms.
  console.log(cmsCollection, "empty collection, should process");
  const existingCollectionTicket = await DBGet("ticket", [
    ["collection", "==", cmsCollection],
  ]);
  if (existingCollectionTicket.length > 0) {
    // delete failed tickets
    const promises: Promise<void>[] = [];
    for (const ticket of existingCollectionTicket) {
      try {
        checkDBTicket(ticket);
        if (!ticket.failed) continue;
        promises.push(DBDeleteWithID('ticket', ticket.id));
      } catch (e) {
        LogMessage((e as Error).message, {
          file: "tools.ts",
          hint: "createTicketForCollection",
          ticket: ticket
        });
      }
    }

    try {
      await Promise.all(promises);
      // if all tickets weren't deleted, then there is one unfailed ticket that exists
      if (promises.length != existingCollectionTicket.length) {
        return;
      }
    } catch (e) {
      LogMessage((e as Error).message, {
        file: "writer.ts",
        hint: "createTicketForCollection deleting",
        attempted: promises.length,
        succeeded: existingCollectionTicket.length
      });
    }
  }
  // check if
  const ticket: DBTicket = {
    collection: cmsCollection,
    failed: false,
    tries: 0,
  };
  await DBCreate("ticket", ticket);
};
