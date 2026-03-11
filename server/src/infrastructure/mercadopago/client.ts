import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';
import { env } from '../../config/env.config';

export const mercadopagoClient = new MercadoPagoConfig({
  accessToken: env.MERCADOPAGO_ACCESS_TOKEN ?? '',
});

export const mercadopagoPreference = new Preference(mercadopagoClient);
export const mercadopagoPayment = new Payment(mercadopagoClient);
