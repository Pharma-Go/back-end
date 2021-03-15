import { BadRequestException, Injectable } from '@nestjs/common';
import { Invoice } from 'src/invoice/invoice.entity';
import { App } from 'src/main';
import { Product } from 'src/product/product.entity';
import { User } from 'src/user/user.entity';

@Injectable()
export class PagarmeService {
  public async createInvoiceInPagarme(
    invoiceDto: any,
    user: User,
    invoice: Invoice,
  ) {
    try {
      return App.client.transactions.create({
        amount: invoiceDto.total,
        card_id: invoice.paymentCard.card_id,
        customer: {
          external_id: user.id,
          name: user.name,
          type: 'individual',
          country: 'br',
          email: user.email,
          documents: [
            {
              type: 'cpf',
              number: user.cpf,
            },
          ],
          phone_numbers: [`+55${user.phone}`],
        },
        capture: true,
        async: true,
        postback_url:
          'http://pharmago-backend.herokuapp.com/invoices/pagarme/postback',
        payment_method: invoice.paymentCard.method.toLowerCase(),
        billing: {
          name: 'Local de entrega',
          address: {
            state: user.address.state,
            zipcode: user.address.zipcode,
            neighborhood: user.address.district,
            street_number: user.address.streetNumber.toString(),
            city: user.address.city,
            street: user.address.street,
            country: 'br',
          },
        },
        items: this.transformProductsToPagarmeItem(
          invoice.itemProducts.map(itemProduct => {
            const product: Product = itemProduct.product;

            return {
              product: product,
              quantity: invoiceDto.itemProducts.find(
                itemProduct => itemProduct.product.id === product.id,
              ).quantity,
            };
          }),
        ),
        metadata: {
          invoice_id: invoice.id,
        },
      });
    } catch (err) {
      throw new BadRequestException(err.response.errors[0].message);
    }
  }

  public async createFeeInvoice(invoice: Invoice, user: User) {
    const feeAmount = invoice.establishment.fee;

    const total = (feeAmount / 100) * invoice.total;

    try {
      return App.client.transactions.create({
        amount: total <= 100 ? 110 : total,
        card_id: invoice.paymentCard.card_id,
        customer: {
          external_id: user.id,
          name: user.name,
          type: 'individual',
          country: 'br',
          email: user.email,
          documents: [
            {
              type: 'cpf',
              number: user.cpf,
            },
          ],
          phone_numbers: [`+55${user.phone}`],
        },
        capture: true,
        async: true,
        postback_url:
          'http://pharmago-backend.herokuapp.com/invoices/pagarme/postback',
        payment_method: invoice.paymentCard.method.toLowerCase(),
        billing: {
          name: 'Local da taxa',
          address: {
            state: user.address.state,
            zipcode: user.address.zipcode,
            neighborhood: user.address.district,
            street_number: user.address.streetNumber.toString(),
            city: user.address.city,
            street: user.address.street,
            country: 'br',
          },
        },
        items: [],
        metadata: {
          invoice_id: invoice.id,
        },
      });
    } catch (err) {
      console.log('erro fee', err);
      throw new BadRequestException(err.response.errors[0].message);
    }
  }

  public async refundTransaction(transactionId: number) {
    await App.client.transactions.refund({
      id: transactionId,
    });
  }

  private transformProductsToPagarmeItem(
    values: { product: Product; quantity: number }[],
  ): any[] {
    return values.map(value => ({
      id: value.product.id,
      title: value.product.name,
      unit_price: value.product.price,
      quantity: value.quantity,
      tangible: true,
    }));
  }
}
