export class CreateProductDto {
  readonly title: string;
  readonly description: string;
  readonly price: number;
  readonly image: Buffer;
  readonly rating?: number;
  readonly discount?: number;
}
