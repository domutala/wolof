import { Entity, Column } from "typeorm";
import { Base } from "./Base";

@Entity()
export class Word extends Base {
  /** les différentes façon d'ércire un mot sur proposition des utilisateurs */
  @Column({ type: "json", default: [] })
  writings: Array<{
    value: string;

    /** id de l'utilisateur qui a ajouter l'éciture */
    author?: string;

    date: Date;

    /** l'écriture qui a le plus de vote de type "up" est affchée par défaut. */
    vote: Array<{ type: "up" | "down"; author?: string; date: Date }>;
  }>;

  @Column({ type: "json", default: [] })
  definitions: Array<{
    value: string;

    /** id de l'utilisateur qui a ajouter le mot */
    author?: string;

    date: Date;

    /**
     * la définition qui a le plus de vote de
     * type "up" est affchée par défaut.
     * */
    vote: Array<{ type: "up" | "down"; author?: string; date: Date }>;
  }>;
}
