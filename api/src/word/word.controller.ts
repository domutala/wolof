import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { WordService } from "./word.service";

@Controller({ path: "/word" })
export class WordController {
  constructor(private readonly appService: WordService) {}

  @Get()
  rate(@Query() query: any) {
    return this.appService.list(query);
  }

  @Post("/new")
  convert(@Body() word: any) {
    return this.appService._new(word);
  }
}
