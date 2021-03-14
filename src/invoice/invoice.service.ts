import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { Invoice, PaymentStatus } from './invoice.entity';
import { ProductService } from 'src/product/product.service';
import { Role, User } from 'src/user/user.entity';
import { InvoiceGateway } from './invoice.gateway';
import { InvoiceDto } from './invoice.dto';
import { PagarmeService } from 'src/pagarme/pagarme.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class InvoiceService {
  public baseRelations: string[] = [
    'buyer',
    'itemProducts',
    'deliverer',
    'itemProducts.product',
    'paymentCard',
    'establishment',
  ];

  constructor(
    @InjectRepository(Invoice) private repo: Repository<Invoice>,
    private productService: ProductService,
    private invoiceGateway: InvoiceGateway,
    private pagarmeService: PagarmeService,
    private userService: UserService,
  ) {}

  public async createInvoice(invoiceDto: InvoiceDto, user: User) {
    invoiceDto.buyer = user.id;
    invoiceDto.total = 0;
    invoiceDto.strictAccepted = true;

    if (!invoiceDto.itemProducts || invoiceDto.itemProducts?.length === 0) {
      throw new BadRequestException(
        'Não é possível criar uma venda sem produtos.',
      );
    }

    if (!user.address) {
      throw new BadRequestException(
        'Não é possível criar uma venda sem que o usuário tenha um endereço de entrega.',
      );
    }

    for (let i = 0; i < invoiceDto.itemProducts.length; i++) {
      const product = await this.productService.getOne(
        invoiceDto.itemProducts[i].product.id,
      );

      if (product.strict) {
        invoiceDto.strictAccepted = false;

        if (!invoiceDto.itemProducts[i].prescriptionUrl) {
          throw new BadRequestException(
            `É obrigatório prescrição médica para o produto ${product.name}`,
          );
        }
      }

      const price = product.price * invoiceDto.itemProducts[i].quantity;

      invoiceDto.itemProducts[i]['price'] = price;
      invoiceDto.total += price;
    }

    if (invoiceDto.discount > invoiceDto.total) {
      throw new BadRequestException(
        'Não é possível criar uma venda que o desconto seja maior que o valor total.',
      );
    }

    invoiceDto.total = invoiceDto.total - invoiceDto.discount;

    try {
      const generatedInvoice = await this.repo.save(invoiceDto as unknown);
      let invoice = await this.getOne(generatedInvoice.id);

      if (invoice) {
        const pagarmeInvoice = await this.pagarmeService.createInvoiceInPagarme(
          invoiceDto,
          user,
          invoice,
        );

        console.log(pagarmeInvoice.id);

        await this.repo.update(generatedInvoice.id, {
          transactionId: pagarmeInvoice.id,
        });

        return await this.getOne(generatedInvoice.id);
      }
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  public async emitNewInvoice(invoice: Invoice) {
    this.invoiceGateway.server.emit('newInvoice', invoice.id);
  }

  public async updateInvoice(
    id: string,
    invoice: DeepPartial<Invoice>,
  ): Promise<Invoice> {
    await this.repo.update(id, invoice);
    return this.getOne(id);
  }

  public async getOne(id: string, getBuyerAddress?: boolean): Promise<Invoice> {
    let relations = [...this.baseRelations];

    if (getBuyerAddress) {
      relations = [...this.baseRelations, 'buyer.address'];
    }

    return this.repo.findOne(id, { relations });
  }

  public async getAll(): Promise<Invoice[]> {
    return this.repo.find({ relations: this.baseRelations });
  }

  public async getInvoice(id: string): Promise<Invoice> {
    return this.repo.findOne(id, {
      relations: this.baseRelations,
    });
  }

  public async delivererAccept(id: string, user: User): Promise<Invoice> {
    if (user.role === Role.DEFAULT) {
      throw new BadRequestException(
        'Não é possível aceitar um pedido sem ser um entregador.',
      );
    }

    const invoice = await this.getInvoice(id);

    if (invoice.paymentStatus !== PaymentStatus.paid) {
      throw new BadRequestException(
        'Não é possível aceitar um pedido sem que ele esteja pago.',
      );
    }

    try {
      await this.repo.update(id, {
        deliverer: user,
        delivererAccepted: true,
      });
    } catch (err) {
      throw new BadRequestException(err);
    }

    this.invoiceGateway.server.emit('delivererAccept', id);

    return this.getInvoice(id);
  }

  public async strictUpdate(
    id: string,
    body: { accept: boolean },
    user: User,
  ): Promise<Invoice> {
    if (user.role !== Role.ADMIN) {
      throw new BadRequestException(
        'Não é possível aceitar um pedido sem ser um admin.',
      );
    }

    await this.repo.update(id, {
      strictAccepted: body.accept,
    });

    const invoice = await this.getInvoice(id);

    this.invoiceGateway.server.emit('strictAccept', invoice);

    if (invoice.paymentStatus === PaymentStatus.paid) {
      this.emitNewInvoice(invoice);
    }

    return invoice;
  }

  public async invoiceDelivered(id: string, user: User): Promise<Invoice> {
    if (user.role === Role.DEFAULT) {
      throw new BadRequestException(
        'Não é possível marcar um pedido como entregue sem ser um entregador.',
      );
    }

    await this.repo.update(id, {
      delivered: true,
    });

    return this.getInvoice(id);
  }

  public async getRecentInvoices(user: User): Promise<Invoice[]> {
    return this.repo
      .createQueryBuilder('invoice')
      .innerJoinAndSelect('invoice.itemProducts', 'products')
      .where('invoice.buyer = :id', { id: user.id })
      .orderBy('invoice.paymentDate', 'DESC')
      .limit(3)
      .getMany();
  }

  public sendDelivererLocation(invoiceId: string) {
    this.invoiceGateway.server.emit('gpsToClient', {
      invoiceId,
      lngLat: [-46.627628803253174, -23.614166392779463],
    });
  }

  public getAvailableOrders(user: User) {
    if (user.role === Role.DEFAULT) {
      throw new BadRequestException(
        'Não é possível listar os pedidos disponíveis para entrega sem ser um motoboy.',
      );
    }

    return this.repo.find({
      relations: this.baseRelations,
      where: {
        delivererAccepted: false,
        paymentStatus: PaymentStatus.paid,
        strictAccepted: true,
      },
      order: {
        created_at: 'DESC',
      },
    });
  }

  public getInvoicesStricteds(user: User) {
    if (user.role !== Role.ADMIN) {
      throw new BadRequestException(
        'Não é possível listar os pedidos restritos sem ser um administrador.',
      );
    }

    return this.repo
      .createQueryBuilder('invoice')
      .innerJoinAndSelect('invoice.establishment', 'establishment')
      .innerJoinAndSelect('invoice.itemProducts', 'itemProducts')
      .innerJoinAndSelect('establishment.owner', 'owner')
      .where(
        'establishment.owner = :id AND invoice.strictAccepted = :strictAccept',
        { id: user.id, strictAccept: false },
      )
      .orderBy('invoice.created_at', 'ASC')
      .getMany();
  }

  public async postback(body: any) {
    if (body.event === 'transaction_status_changed') {
      if (
        body.transaction &&
        body.transaction.status &&
        body.transaction.metadata &&
        body.transaction.metadata.invoice_id
      ) {
        const invoiceId = body.transaction.metadata.invoice_id;

        console.log(invoiceId, body.transaction.status);

        if (invoiceId) {
          try {
            switch (body.transaction.status) {
              case PaymentStatus.paid:
                await this.repo.update(invoiceId, {
                  paymentStatus: body.transaction.status,
                  paymentDate: new Date(),
                });

                console.log('finalizou o pagamento');
                break;
              case PaymentStatus.refunded:
                const invoice = await this.getInvoice(invoiceId);
                const user = await this.userService.getOne(invoice.buyer.id);

                const transaction = await this.pagarmeService.createFeeInvoice(
                  invoice,
                  user,
                );

                await this.repo.update(invoiceId, {
                  paymentStatus: body.transaction.status,
                  feeAmount: transaction.amount,
                  isFee: true,
                  refunded: new Date(),
                });

                console.log('finalizou a taxa');

                break;
              default:
                throw new BadRequestException(
                  'Não foi possível tratar o status: ' +
                    body.transaction.status,
                );
            }

            const invoice = await this.getInvoice(invoiceId);

            if (invoice.strictAccepted) {
              this.invoiceGateway.server.emit('updateInvoice', invoice);
              this.emitNewInvoice(invoice);
            }
          } catch (err) {
            throw new BadRequestException(err);
          }
        }
      }
    }
  }

  public async refundTransaction(id: string) {
    try {
      const invoice = await this.repo.findOne(id);
      await this.pagarmeService.refundTransaction(invoice.transactionId);
    } catch (err) {
      throw new BadRequestException(err);
    }
  }
}
