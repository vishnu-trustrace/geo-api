import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {CountryDataSource} from '../datasources';
import {Country, CountryRelations, State} from '../models';
import {StateRepository} from './state.repository';

export class CountryRepository extends DefaultCrudRepository<
  Country,
  typeof Country.prototype.id,
  CountryRelations
> {

  public readonly states: HasManyRepositoryFactory<State, typeof Country.prototype.id>;

  constructor(
    @inject('datasources.country') dataSource: CountryDataSource, @repository.getter('StateRepository') protected stateRepositoryGetter: Getter<StateRepository>,
  ) {
    super(Country, dataSource);
    this.states = this.createHasManyRepositoryFactoryFor('states', stateRepositoryGetter,);
    this.registerInclusionResolver('states', this.states.inclusionResolver);
  }
}
