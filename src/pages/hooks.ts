import { type APIRoute } from "astro";
import { emails, type EmailType } from "./index.ts";

export type AllowedActions =
  | "soft_bounce"
  | "hard_bounce"
  | "complaint"
  | "delivery"
  | "click";

type BodyResponse = {
  id: string;
  urls: Record<Exclude<AllowedActions, "click">, string>;
  action: AllowedActions;
};

async function handleClick(email: EmailType) {
  email.status = "click";

  const foundEmailHTML = email.html;
  const linksInEmail = foundEmailHTML.match(/href="([^"]*)"/g);
  const linksInEmailWithoutHref =
    linksInEmail?.map((link) => link.replace('href="', "").replace('"', "")) ??
    [];

  const foundURL = linksInEmailWithoutHref.find((link) => {
    return link.indexOf("unsubscribe") === -1;
  });

  if (foundURL) {
    await fetch(foundURL);
  }

  return new Response(null);
}

async function handleDelivery(email: EmailType, urls: BodyResponse["urls"]) {
  const deliveryUrl = urls.delivery;
  if (!deliveryUrl) {
    return new Response(
      JSON.stringify({
        message: "Delivery URL not found",
      }),
      { status: 404 },
    );
  }

  email.status = "delivery";

  await fetch(deliveryUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      Type: "Notification",
      Message: JSON.stringify({
        notificationType: "Delivery",
        mail: {
          messageId: email.messageId,
          destination: [email.to],
        },
      }),
    }),
  });

  return new Response(null);
}

async function handleComplaint(email: EmailType, urls: BodyResponse["urls"]) {
  const complaintUrl = urls.complaint;
  if (!complaintUrl) {
    return new Response(
      JSON.stringify({
        message: "Complaint URL not found",
      }),
      { status: 404 },
    );
  }

  email.status = "complaint";

  await fetch(complaintUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      Type: "Notification",
      Message: JSON.stringify({
        notificationType: "Complaint",
        mail: {
          messageId: email.messageId,
          destination: [email.to],
        },
      }),
    }),
  });

  return new Response(null);
}

async function handleBounce(
  email: EmailType,
  urls: BodyResponse["urls"],
  type: "soft_bounce" | "hard_bounce",
) {
  const bounceUrl = urls.hard_bounce || urls.soft_bounce;
  if (!bounceUrl) {
    return new Response(
      JSON.stringify({
        message: "Bounce URL not found",
      }),
      { status: 404 },
    );
  }

  email.status = type;

  await fetch(bounceUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      Type: "Notification",
      Message: JSON.stringify({
        bounce: {
          bounceType: type == "soft_bounce" ? "Transient" : "Permanent",
          bounceSubType: "General",
        },
        notificationType: "Bounce",
        mail: {
          messageId: email.messageId,
          destination: [email.to],
        },
      }),
    }),
  });

  return new Response(null);
}

export const POST: APIRoute = async ({ params, request }) => {
  const body = await request.json();
  const { id, urls, action } = body;

  const foundEmail = emails.find((email) => email.id === id);
  if (!foundEmail) {
    return new Response(
      JSON.stringify({
        message: "Email not found",
      }),
      { status: 404 },
    );
  }

  if (action === "click") {
    return handleClick(foundEmail);
  }

  if (action === "delivery") {
    return handleDelivery(foundEmail, urls);
  }

  if (action === "soft_bounce") {
    return handleBounce(foundEmail, urls, action);
  }

  if (action === "hard_bounce") {
    return handleBounce(foundEmail, urls, action);
  }

  if (action === "complaint") {
    return handleComplaint(foundEmail, urls);
  }

  return new Response(
    JSON.stringify({
      message: "Action not found",
    }),
    { status: 404 },
  );
};
