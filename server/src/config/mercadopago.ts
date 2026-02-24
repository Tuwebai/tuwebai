import { MercadoPagoConfig, Preference, Payment } from "mercadopago";
import { env } from "./env.config";

export const client = new MercadoPagoConfig({
  accessToken: env.MERCADOPAGO_ACCESS_TOKEN ?? "",
});

export const preference = new Preference(client);
export const payment = new Payment(client);
