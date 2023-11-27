import type { APIRoute } from "astro";
import type { AllowedActions } from "./hooks.ts";

export type EmailType = {
  id: number;
  from: string;
  to: string;
  subject: string;
  text: string;
  html: string;
  date: Date;
  messageId: string;
  status: AllowedActions;
};

export const emails: EmailType[] = [];

async function handleSendEmail(data: Record<string, any>) {
  const from = data.get("Source") || "";
  const to = data.get("Destination.ToAddresses.member.1") || "";
  const subject = data.get("Message.Subject.Data") || "";
  const text = data.get("Message.Body.Text.Data") || "";
  const html = data.get("Message.Body.Html.Data") || "";

  const messageId = new Date().getTime();
  const requestId = new Date().getTime() + Math.random() * 1000;

  const currentId = emails.length + 1;

  emails.push({
    id: currentId,
    from,
    to,
    subject,
    text,
    html,
    date: new Date(),
    messageId: `${messageId}`,
    status: 'delivery'
  });

  const sendEmailResponse = `
    <SendEmailResponse xmlns="https://ses.amazonaws.com/doc/2010-12-01/">
        <SendEmailResult>
            <MessageId>${messageId}</MessageId>
        </SendEmailResult>
        <ResponseMetadata>
            <RequestId>${requestId}</RequestId>
        </ResponseMetadata>
    </SendEmailResponse>
  `;

  return new Response(sendEmailResponse, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}

async function handleGetQuota() {
  const quotaResponse = `
    <GetSendQuotaResponse xmlns="https://ses.amazonaws.com/doc/2010-12-01/">
      <GetSendQuotaResult>
        <SentLast24Hours>0</SentLast24Hours>
        <Max24HourSend>50000.0</Max24HourSend>
        <MaxSendRate>200.0</MaxSendRate>
      </GetSendQuotaResult>
      <ResponseMetadata>
        <RequestId>${new Date().getTime()}</RequestId>
      </ResponseMetadata>
    </GetSendQuotaResponse>
  `;

  return new Response(quotaResponse, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}

export const GET: APIRoute = async ({ request }) => {
  return Response.redirect(`${request.url}logs`);
};

export const POST: APIRoute = async ({ params, request }) => {
  const body = await request.text();
  const data = new URLSearchParams(body);

  const action = data.get("Action")!;
  if (!action) {
    return new Response("Action not found", { status: 400 });
  }

  // if it is quota request, return a quota response
  if (action === "GetSendQuota") {
    return handleGetQuota();
  } else if (action === "SendEmail") {
    return handleSendEmail(data);
  }

  return new Response(`Unsupported action: ${action}`, {
    status: 400,
  });
};
