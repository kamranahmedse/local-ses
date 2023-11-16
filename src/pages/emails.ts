import { type APIRoute } from "astro";
import { emails } from "./index.ts";

export const GET: APIRoute = async ({ request }) => {
  return new Response(JSON.stringify(emails));
};

export const DELETE: APIRoute = async ({ request }) => {
  emails.splice(0, emails.length);
  return new Response(JSON.stringify(emails));
};
