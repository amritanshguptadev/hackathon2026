import { supabase } from "../lib/supabase";

/**
 * Report Service for product and safety moderation.
 */
export const reportService = {
  /**
   * Submit a new report for a product or listing.
   */
  async submitReport({ reporterId, productId, reason, details }) {
    if (!reporterId) throw new Error("Authenticated reporter ID is required");
    if (!reason) throw new Error("Reason for report is required");

    const { data, error } = await supabase
      .from("reports")
      .insert({
        reporter_id: reporterId,
        product_id: productId || null,
        reason: reason.trim(),
        details: (details || "").trim(),
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      console.error("Error submitting report:", error);
      throw error;
    }

    return data;
  },

  /**
   * Admin-only: Fetch all submitted reports with reporter and product details.
   */
  async getReports() {
    const { data, error } = await supabase
      .from("reports")
      .select(`
        *,
        reporter:profiles!reporter_id (
          id,
          name,
          college
        ),
        product:products (
          id,
          title,
          price,
          status,
          seller_id
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching reports:", error);
      throw error;
    }

    return data || [];
  },

  /**
   * Admin-only: Update report status (pending / resolved / dismissed).
   */
  async updateReportStatus(reportId, status) {
    const { data, error } = await supabase
      .from("reports")
      .update({ status })
      .eq("id", reportId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

export default reportService;
