import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where
} from '@loopback/repository';
import {
  del, get,
  getModelSchemaRef, param, patch, post, put, requestBody,
  response
} from '@loopback/rest';
import {City, Country} from '../models';
import {CityRepository, CountryRepository} from '../repositories';

export class CountryController {
  constructor(
    @repository(CountryRepository)
    public countryRepository : CountryRepository,
    @repository(CityRepository)
    public cityRepository?: CityRepository
  ) {}

  @post('/countries')
  @response(200, {
    description: 'Country model instance',
    content: {'application/json': {schema: getModelSchemaRef(Country)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Country, {
            title: 'NewCountry',
            //exclude: ['id'],
          }),
        },
      },
    })
    country: Country,
  ): Promise<Country> {

    //if id is not provided set id
    if(!country.hasOwnProperty('id'))
    {
      let lastCountryObj: any = await this.countryRepository.find({
        order: ['id DESC'],
        limit: 1
      });

      country.id = lastCountryObj.length ? lastCountryObj[0]['id']+1 : 1;
    }

    return this.countryRepository.create(country);
  }

  @get('/countries/count')
  @response(200, {
    description: 'Country model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Country) where?: Where<Country>,
  ): Promise<Count> {
    return this.countryRepository.count(where);
  }

  @get('/countries')
  @response(200, {
    description: 'Array of Country model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Country, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Country) filter?: Filter<Country>,
  ): Promise<Country[]> {
    return this.countryRepository.find(filter);
  }

  @patch('/countries')
  @response(200, {
    description: 'Country PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Country, {partial: true}),
        },
      },
    })
    country: Country,
    @param.where(Country) where?: Where<Country>,
  ): Promise<Count> {
    return this.countryRepository.updateAll(country, where);
  }

  @get('/countries/{id}')
  @response(200, {
    description: 'Country model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Country, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Country, {exclude: 'where'}) filter?: FilterExcludingWhere<Country>
  ): Promise<Country> {
    return this.countryRepository.findById(id, filter);
  }

  @patch('/countries/{id}')
  @response(204, {
    description: 'Country PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Country, {partial: true}),
        },
      },
    })
    country: Country,
  ): Promise<void> {
    await this.countryRepository.updateById(id, country);
  }

  @put('/countries/{id}')
  @response(204, {
    description: 'Country PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() country: Country,
  ): Promise<void> {
    await this.countryRepository.replaceById(id, country);
  }

  @del('/countries/{id}')
  @response(204, {
    description: 'Country DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.countryRepository.deleteById(id);
  }

  @get('/countries/search')
  @response(200, {
    description: 'Array of Country model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Country, {includeRelations: true}),
        },
      },
    },
  })
  async findSearch(
    @param.filter(Country) filter?: Filter<Country>,
  ): Promise<City[] | undefined> {
    const countryData = await this.countryRepository.find(filter);
    const countryIds = countryData.map(item => item.id);

    let cityData = await this.cityRepository?.find({
      limit: 500,
      where: {
        country_id: {inq: [...countryIds]}
      },
      include: [
        {
          relation: "country",
          scope: {
            fields: ["id","name"]
          }
        },
        {
          relation: "state",
          scope: {
            fields: ["id","name"]
          }
        }
      ]
    });

    return cityData;
  }
}
