
import { private_env_vars } from "@/app/_utils/private_env_vars";
import { EqualsTimed } from "@shared/tools";
import { isCMSCollectionSingular, isCMSSingleType, isCMSSingleTypePage } from "@shared/types/cms/CMSCheck";
import { revalidateTag } from "next/cache";

export async function POST(req: Request) {
  const headers = req.headers;
  const CMSAuthToken = headers.get('authorization');
  if (!await EqualsTimed(CMSAuthToken, private_env_vars.CMS_AUTH_TOKEN, 1000)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 403 });
  }

  const body = await req.json();

  console.log('Received CMS update request:', body);
  if (!body) {
    return new Response(JSON.stringify({ error: 'Invalid request body' }), { status: 400 });
  }

  const { model } = body;
  console.log('Extracted model from request body:', model);

  if (!model) {
    return new Response(JSON.stringify({ error: 'Missing model in request body' }), { status: 400 });
  }

  if (!isCMSCollectionSingular(model) && ! isCMSSingleType(model) && !isCMSSingleTypePage(model)) {
    return new Response(JSON.stringify({ error: 'Invalid model in request body' }), { status: 400 });
  }

  console.log(`Revalidating tag for model: ${model}`);
  // revalidates all paths that rely on the CMS collection
  revalidateTag(model, 'max');
  revalidateTag('any', 'max');

  return new Response(JSON.stringify({ okay: true }));
}
