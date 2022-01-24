import { Model, Page, QueryBuilder, Transaction } from 'objection';

 /* eslint-disable */

export class BaseQueryBuilder<M extends Model, R = M[]> extends QueryBuilder<M, R> {
  // These are necessary. You can just copy-paste them and change the
  // name of the query builder class.
  ArrayQueryBuilderType!: BaseQueryBuilder<M, M[]>;
  SingleQueryBuilderType!: BaseQueryBuilder<M, M>;
  MaybeSingleQueryBuilderType!: BaseQueryBuilder<M, M | undefined>;
  NumberQueryBuilderType!: BaseQueryBuilder<M, number>;
  PageQueryBuilderType!: BaseQueryBuilder<M, Page<M>>;
  
}

class BaseModel extends Model {

  QueryBuilderType!: BaseQueryBuilder<this>;
  static QueryBuilder = BaseQueryBuilder;

  static useLimitInFirst = true;

  static relatedQuery(str?: string, trx?: Transaction): BaseQueryBuilder<BaseModel, BaseModel[]> {
    return <any> super.relatedQuery(str, trx);
  }

  $beforeInsert(this: any) {
    if (!this.createdAt) {
      this.createdAt = new Date();
    }
  }

  $beforeUpdate(this: any) {
    if (!this.updatedAt) {
      this.updatedAt = new Date();
    }
  }

}

export default BaseModel;