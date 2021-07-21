import {Entity, hasMany, model, property} from '@loopback/repository';
import {City} from './city.model';
import {State} from './state.model';

@model({settings: {strict: false}})
export class Country extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: false
  })
  id: number;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  iso3: string;

  @property({
    type: 'string',
    required: true,
  })
  iso2: string;

  @property({
    type: 'string',
    required: true,
  })
  phone_code: string;

  @property({
    type: 'string',
    required: true,
  })
  capital: string;

  @property({
    type: 'string',
  })
  currency?: string;

  @property({
    type: 'string',
  })
  native?: string;

  @property({
    type: 'string',
    required: true,
  })
  region: string;

  @property({
    type: 'string',
  })
  subregion?: string;

  @property({
    type: 'object',
  })
  translations?: object;

  @property({
    type: 'string',
    required: true,
  })
  latitude: string;

  @property({
    type: 'string',
    required: true,
  })
  longitude: string;

  @property({
    type: 'string',
  })
  emojiU?: string;

  @hasMany(() => State, {keyTo: 'country_id'})
  states: State[];

  @hasMany(() => City, {keyTo: 'country_id'})
  cities: City[];
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Country>) {
    super(data);
  }
}

export interface CountryRelations {
  // describe navigational properties here
}

export type CountryWithRelations = Country & CountryRelations;
