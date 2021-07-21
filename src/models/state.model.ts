import {belongsTo, Entity, hasMany, model, property} from '@loopback/repository';
import {City} from './city.model';
import {Country} from './country.model';

@model({settings: {strict: false}})
export class State extends Entity {
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
  country_code: string;
  @property({
    type: 'string',
    required: true,
  })
  state_code: string;

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

  @belongsTo(() => Country, {name: 'country'})
  country_id: number;

  @hasMany(() => City, {keyTo: 'state_id'})
  cities: City[];
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<State>) {
    super(data);
  }
}

export interface StateRelations {
  // describe navigational properties here
}

export type StateWithRelations = State & StateRelations;
