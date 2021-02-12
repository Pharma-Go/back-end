import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { CrudRequest, GetManyDefaultResponse } from '@nestjsx/crud';
import { SelectQueryBuilder } from 'typeorm';

export class CrudService<T> extends TypeOrmCrudService<T> {
  async getManyOrPage<R = T>(
    builder: SelectQueryBuilder<T>,
    req: CrudRequest,
    transform?: (data: T[]) => any,
  ): Promise<GetManyDefaultResponse<R> | R[]> {
    if (this.decidePagination(req.parsed, req.options)) {
      let [data, count] = await builder.getManyAndCount();
      const { limit, offset } = builder.expressionMap;

      if (transform) {
        data = transform(data);

        return (<unknown>(
          this.createPageInfo(data, count, limit, offset)
        )) as GetManyDefaultResponse<R>;
      }
    }
    return builder.getMany().then(data => (transform ? transform(data) : data));
  }
}
