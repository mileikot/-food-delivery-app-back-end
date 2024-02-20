import { Controller, Get, Query } from '@nestjs/common';

import { SearchDto } from './dto/search.dto';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  async search(@Query() searchDto: SearchDto) {
    return await this.searchService.search(searchDto);
  }
}
