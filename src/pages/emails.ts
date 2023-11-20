import { type APIRoute } from "astro";
import { emails, emailsByRecipient } from "./index.ts";

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url)
  if (url.searchParams.has('recipient')) {
    return new Response(JSON.stringify(emailsByRecipient[url.searchParams.get('recipient')] || []));
  }
  
  return new Response(JSON.stringify(emails));
};

export const DELETE: APIRoute = async ({ request }) => {
  emails.splice(0, emails.length);
  return new Response(JSON.stringify(emails));
};
