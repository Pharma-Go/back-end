export class PagarmeCard {
  id: string;
  brand: string;
  holder_name: string;
  first_digits: string;
  last_digits: string;
  country: string;
  fingerprint: string;
  customer: any;
  valid: boolean;
  expiration_date: string;
}
