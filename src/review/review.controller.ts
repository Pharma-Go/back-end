import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiOAuth2, ApiTags } from '@nestjs/swagger';
import { OAuthActionsScope } from 'src/lib/decorators/oauth.decorator';
import { SanitizePipe } from 'src/lib/pipes/sanitize.pipe';
import { ReviewDto } from './review.dto';
import { Review } from './review.entity';
import { ReviewService } from './review.service';

@ApiTags('Reviews')
@Controller('reviews')
@ApiOAuth2(['public'])
@OAuthActionsScope({
  'Create-Many': ['admin'],
  'Create-One': ['admin', 'default'],
  'Update-One': ['admin', 'default'],
  'Delete-All': ['admin'],
  'Delete-One': ['admin', 'default'],
  'Read-All': ['admin', 'default'],
  'Read-One': ['admin', 'default'],
  'Replace-One': ['admin', 'default'],
})
export class ReviewController {
  constructor(private reviewService: ReviewService) {}

  @Post('product/:product')
  public createProductReview(
    @Param('product') productId: string,
    @Body(new SanitizePipe(ReviewDto)) reviewDto: ReviewDto,
  ) {
    return this.reviewService.createProductReview(productId, reviewDto);
  }

  @Post('establishment/:establishment')
  public createEstablishmentReview(
    @Param('establishment') establishmentId: string,
    @Body(new SanitizePipe(ReviewDto)) reviewDto: ReviewDto,
  ) {
    return this.reviewService.createEstablishmentReview(
      establishmentId,
      reviewDto,
    );
  }

  @Get('product/:product')
  public getProductReviews(@Param('product') productId: string) {
    return this.reviewService.findManyReviews({
      where: {
        product: productId,
      },
    });
  }

  @Get('establishment/:establishment')
  public getEstablishmentReviews(@Param('id') id: string) {
    return this.reviewService.findManyReviews({
      where: {
        establishment: id,
      },
    });
  }

  @Get(':id')
  public getReview(@Param('id') id: string) {
    return this.reviewService.findReview(id);
  }

  @Put(':id')
  public updateReview(@Param('id') id: string, @Body() review: Review) {
    return this.reviewService.updateReview(id, review);
  }
}
