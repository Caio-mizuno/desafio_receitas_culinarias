import { ApiProperty } from '@nestjs/swagger';

export class DefaultPaginationResponseDto {
  @ApiProperty()
  response: any | any[];

  @ApiProperty()
  page: number;

  @ApiProperty()
  total: number;

  @ApiProperty()
  status: boolean;

  @ApiProperty()
  finalPage?: number;

  @ApiProperty({ nullable: true })
  nextPage?: number | null;

  constructor(
    response: any,
    page: number,
    total: number,
    items: boolean,
    finalPage?: number,
    nextPage?: number | null,
  ) {
    this.response = response;
    this.page = page;
    this.total = total;
    this.status = items;
    this.finalPage = finalPage;
    this.nextPage = nextPage;
  }
}
