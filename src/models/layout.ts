import type { LayoutFieldFormat } from "@/types/types";

export interface SerieDetailsLayout {

    name: string;

    field: string;

    format: LayoutFieldFormat;

    limit?: number;
}