import { Word } from "../entitys/Word";
import { DataSource, Repository } from "typeorm";
import { Inject, Injectable } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";

const toQuery = `
CREATE OR REPLACE FUNCTION to_query(input_text TEXT) RETURNS TEXT AS $$
DECLARE
    output_text TEXT := input_text;
BEGIN
    -- Supprimer les espaces
    output_text := regexp_replace(output_text, ' ', '', 'gm');
    -- Supprimer les lettres répétitives
    output_text := regexp_replace(output_text, '([a-zA-Z])\\1', '\\1', 'g');
    
    RETURN output_text;
END;
$$ LANGUAGE plpgsql;
`;

@Injectable()
export class WordRepository extends Repository<Word> {
  constructor(
    @Inject(REQUEST) private request: Request,
    dataSource: DataSource,
  ) {
    super(Word, dataSource.createEntityManager());
  }

  async _new(word: { writting: string; definition?: string }) {
    if (typeof word.writting !== "string") {
      throw "word.new.writting_must_be_string";
    }

    if (!["string", "undefined"].includes(typeof word.definition)) {
      throw "word.new.definition_must_be_string";
    }

    const _word = new Word();
    _word.writings = [{ value: word.writting, vote: [], date: new Date() }];

    if (word.definition) {
      _word.definitions = [
        { value: word.definition, vote: [], date: new Date() },
      ];
    }

    await _word.save();

    return await this._findOne({ id: _word.id });
  }

  async _findOne(params: { [x: string]: any }) {
    if (
      Object.values(params)
        .map((v) => v !== undefined)
        .includes(false)
    ) {
      return;
    }

    const words = await this._find(params);

    return words[0];
  }

  async _find(params: { [x: string]: any } = {}) {
    await this.query("CREATE EXTENSION IF NOT EXISTS unaccent;");
    await this.query(toQuery);

    const perPage = params.perPage || 50;
    const page = params.page || 1;
    const skip = (page - 1) * perPage;
    const take = perPage;

    const queryBuilder = this.createQueryBuilder("word");

    if (params.id) queryBuilder.andWhere(`word.id = '${params.id}'`);

    if (params.q) {
      const query = `
      EXISTS (
        SELECT 1 FROM json_array_elements(word.writings) AS w
        WHERE TO_QUERY(w ->> 'value') ILIKE TO_QUERY('%${params.q}%')
      )
      OR
      EXISTS (SELECT 1 FROM json_array_elements(word.definitions) AS d
      WHERE TO_QUERY(d ->> 'value') ILIKE TO_QUERY('%${params.q}%'))
      `;

      queryBuilder.andWhere(query);
    }

    queryBuilder.skip(skip).take(take);

    let query = queryBuilder
      .getQuery()
      .replace(
        'FROM "word" "word"',
        "FROM word cross join lateral json_array_elements(word.writings) AS w",
      )
      .replace(
        `LIMIT ${take}`,
        `ORDER BY (w->>'value')::VARCHAR ASC LIMIT ${take}`,
      )
      .replace(/SELECT[\s\S]*?FROM/m, "SELECT * FROM");

    query = `
    WITH search_results AS (${query}),
    paginated_results AS (    
      SELECT
        json_agg(sr.*) AS hits,
        ${page} AS page,
        ${perPage} AS perPage,
        (SELECT CAST(COUNT(DISTINCT id) AS INTEGER) FROM word) AS total
      FROM search_results sr
      LIMIT ${perPage} OFFSET ((${page} - 1) * ${perPage})
    )
    SELECT hits,
      page,
      perPage,
      total,
      CASE
        WHEN page * perPage < total THEN page + 1
        ELSE NULL
      END AS nextPage,
      CASE
        WHEN page > 1 THEN page - 1
        ELSE NULL
      END AS prevPage
    FROM paginated_results
    `;

    const result: {
      page: number;
      perpage: number;
      total: number;
      nextpage: number | null;
      prevpage: number | null;
      hits: Word[];
    } = await this.query(query);

    return result;
  }
}
