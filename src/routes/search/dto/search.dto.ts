import { Allow } from 'class-validator';

export class SearchDto {
  @Allow()
  readonly query: string;
}
