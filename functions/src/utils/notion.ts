import { Client } from "@notionhq/client";

/**
 * Notion data structure - categorized items
 */
export type NotionData = Record<string, any[]>;

/**
 * Fetch fresh data from Notion API
 * 
 * This is a shared utility function used by both:
 * - notionFunction (main API endpoint)
 * - notionWebhook (webhook handler)
 * 
 * @param token Notion API token
 * @param dataSourceId Notion database/data source ID
 * @returns Grouped data by category
 */
export async function fetchNotionData(
  token: string,
  dataSourceId: string
): Promise<NotionData> {
  const notion = new Client({ auth: token });
  const response = await notion.dataSources.query({
    data_source_id: dataSourceId,
    filter: { property: "Name", rich_text: { is_not_empty: true } },
    sorts: [{ property: "Rank", direction: "ascending" }],
  });

  // Group data by category
  const grouped = response.results.reduce((acc: Record<string, any[]>, page: any) => {
    const item = {
      name: page.properties?.Name?.rich_text?.[0]?.plain_text ?? "",
      url: page.properties?.URL?.url ?? "",
      description: page.properties?.Description?.rich_text?.[0]?.plain_text ?? "",
      rank: page.properties?.Rank?.number ?? 0,
      category: page.properties?.Category?.select?.name ?? "Uncategorized",
    };
    (acc[item.category] ||= []).push(item);
    return acc;
  }, {});

  return grouped;
}
