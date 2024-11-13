import { headers } from "next/headers";
import Stripe from "stripe";

async function getRawBody(req: Request): Promise<Buffer> {
  const reader = req.body?.getReader();
  const chunks: Uint8Array[] = [];

  if (!reader) {
    throw new Error("Request body is empty or already consumed.");
  }

  let done, value;
  while ((({ done, value } = await reader.read()), !done)) {
    if (value) chunks.push(value);
  }

  return Buffer.concat(chunks);
}

export async function POST(req: Request) {
  const headersList = await headers();
  const sig = headersList.get("stripe-signature");

  if (!sig) {
    return new Response("no signature header", {
      status: 400,
    });
  }

  let event;

  try {
    const rawBody = await getRawBody(req);

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2024-10-28.acacia",
    });
    event = stripe.webhooks.constructEvent(
      rawBody.toString(),
      sig,
      process.env.STRIPE_WEBHOOK_SIGNING_SECRET!,
    );
  } catch (err) {
    console.error(err, `⚠️  Webhook signature verification failed.`);
    return new Response("signature verification failed", {
      status: 400,
    });
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object;
      console.log({ session });
      console.log("Payment was successful!");
      // Here you can update your database, send an email, etc.
      break;
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object;
      console.log({ paymentIntent });
      console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
      break;
    // Add more event types as needed
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return new Response("ok", {
    status: 200,
  });
}

// const event2 = {
//   event:
//     '{"id":"evt_1QKoyrGIsJDYEH18xo4ARgKC","object":"event","api_version":"2024-10-28.acacia","created":1731536649,"data":{"object":{"id":"cs_test_a1SFsgo9FNbt1f09D8feq82e49XYGA2Mk5HCPxlcTK49MNV3EWxtbtLpa5","object":"checkout.session","adaptive_pricing":{"enabled":false},"after_expiration":null,"allow_promotion_codes":null,"amount_subtotal":3000,"amount_total":3000,"automatic_tax":{"enabled":false,"liability":null,"status":null},"billing_address_collection":null,"cancel_url":"https://httpbin.org/post","client_reference_id":null,"client_secret":null,"consent":null,"consent_collection":null,"created":1731536645,"currency":"usd","currency_conversion":null,"custom_fields":[],"custom_text":{"after_submit":null,"shipping_address":null,"submit":null,"terms_of_service_acceptance":null},"customer":"cus_RDFT63VwX6k5OC","customer_creation":"always","customer_details":{"address":{"city":"South San Francisco","country":"US","line1":"354 Oyster Point Blvd","line2":null,"postal_code":"94080","state":"CA"},"email":"stripe@example.com","name":"Jenny Rosen","phone":null,"tax_exempt":"none","tax_ids":[]},"customer_email":null,"expires_at":1731623045,"invoice":null,"invoice_creation":{"enabled":false,"invoice_data":{"account_tax_ids":null,"custom_fields":null,"description":null,"footer":null,"issuer":null,"metadata":{},"rendering_options":null}},"livemode":false,"locale":null,"metadata":{},"mode":"payment","payment_intent":"pi_3QKoynGIsJDYEH181Vft0AqC","payment_link":null,"payment_method_collection":"always","payment_method_configuration_details":null,"payment_method_options":{"card":{"request_three_d_secure":"automatic"}},"payment_method_types":["card"],"payment_status":"paid","phone_number_collection":{"enabled":false},"recovered_from":null,"saved_payment_method_options":{"allow_redisplay_filters":["always"],"payment_method_remove":null,"payment_method_save":null},"setup_intent":null,"shipping_address_collection":null,"shipping_options":[],"status":"complete","submit_type":null,"subscription":null,"success_url":"https://httpbin.org/post","total_details":{"amount_discount":0,"amount_shipping":0,"amount_tax":0},"ui_mode":"hosted","url":null,"shipping_cost":null,"shipping_details":null}},"livemode":false,"pending_webhooks":1,"request":{"id":null,"idempotency_key":null},"type":"checkout.session.completed"}',
// };
