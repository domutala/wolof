import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { WordRepository } from "src/database/repositorys/Word";

@Injectable()
export class WordService {
  constructor(
    private readonly httpService: HttpService,
    private repository: WordRepository,
  ) {}

  async _new(word: { writting: string; definition?: string }) {
    return await this.repository._new(word);
  }

  async list(filter: { [x: string]: any }) {
    return await this.repository._find(filter);
  }
}
