import { MergeDeep, Merge } from "type-fest";
import { Database as DatabaseGenerated, Tables } from "./supabase";
export { Json } from "./supabase";

// Override the type for a specific column in a view:
export type Database = MergeDeep<
  DatabaseGenerated,
  {
    public: {
      Views: {
        category: {
          Row: {
            // id is a primary key in public.Category, so it must be `not null`
            id: number;
          };
        };
      };
    };
  }
>;

export type Category = Merge<
  Tables<"category">,
  { category_item: CategoryItem[] }
>;

export type CategoryItem = Tables<"category_item">;
