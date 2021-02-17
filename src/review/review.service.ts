import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { ReviewDto } from './review.dto';
import { Review } from './review.entity';

@Injectable()
export class ReviewService {
  constructor(@InjectRepository(Review) private repo: Repository<Review>) {}

  public findReview(id: string, options: FindOneOptions = {}): Promise<Review> {
    if (!options.relations) {
      options.relations = ['establishment', 'product', 'author'];
    }

    return this.repo.findOne(id, options);
  }

  public findManyReviews(options: FindManyOptions = {}): Promise<Review[]> {
    if (!options.relations) {
      options.relations = ['establishment', 'product', 'author'];
    }

    return this.repo.find(options);
  }

  public async createProductReview(
    productId: string,
    reviewDto: ReviewDto,
  ): Promise<Review> {
    const review = await this.repo.save(({
      ...reviewDto,
      product: productId,
    } as unknown) as Review);
    return this.findReview(review.id);
  }

  public async createEstablishmentReview(
    establishmentId: string,
    reviewDto: ReviewDto,
  ): Promise<Review> {
    const review = await this.repo.save(({
      ...reviewDto,
      establishment: establishmentId,
    } as unknown) as Review);
    return this.findReview(review.id);
  }

  public async updateReview(id: string, review: Review): Promise<Review> {
    await this.repo.update(id, review);
    return this.findReview(review.id);
  }
}
