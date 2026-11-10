declare module "mammoth" {
  export interface RawTextResult {
    value: string;
    messages: any[];
  }
  export interface HtmlResult {
    value: string;
    messages: any[];
  }
  export function extractRawText(input: { arrayBuffer: ArrayBuffer }): Promise<RawTextResult>;
  export function convertToHtml(input: { arrayBuffer: ArrayBuffer }): Promise<HtmlResult>;
}

