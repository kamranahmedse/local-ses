import type { APIRoute } from "astro";

export type EmailType = {
  from: string;
  to: string;
  subject: string;
  text: string;
  html: string;
  date: Date;
};

export const emails: EmailType[] = [];
export const emailsByRecipient: Record<string, EmailType[]> = {};

export const GET: APIRoute = async ({ request }) => {
  return Response.redirect(`${request.url}logs`);
};

export const POST: APIRoute = async ({ params, request }) => {
  const body = await request.text();
  const data = new URLSearchParams(body);

  const action = data.get("Action");
  if (action !== "SendEmail") {
    return new Response("Only SendEmail action is supported", { status: 400 });
  }

  const from = data.get("Source") || "";
  const to = data.get("Destination.ToAddresses.member.1") || "";
  const subject = data.get("Message.Subject.Data") || "";
  const text = data.get("Message.Body.Text.Data") || "";
  const html = data.get("Message.Body.Html.Data") || "";

  const now = new Date();
  emails.push({ from, to, subject, text, html, date: now });
  emailsByRecipient[to] = emailsByRecipient[to] || []
  emailsByRecipient[to].push({ from, to, subject, text, html, date: now })

  const sendEmailResponse = `
    <SendEmailResponse xmlns="https://ses.amazonaws.com/doc/2010-12-01/">
        <SendEmailResult>
            <MessageId>${new Date().getTime()}</MessageId>
        </SendEmailResult>
        <ResponseMetadata>
            <RequestId>${new Date().getTime()}</RequestId>
        </ResponseMetadata>
    </SendEmailResponse>
  `;

  return new Response(sendEmailResponse, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
};
