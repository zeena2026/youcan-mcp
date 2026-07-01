import express from "express";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod";
import { YouCanClient } from "./youcan.js";

const PORT = process.env.PORT || 3000;
const ACCESS_TOKEN = process.env.YOUCAN_ACCESS_TOKEN;

if (!ACCESS_TOKEN) {
  console.error("❌ Missing YOUCAN_ACCESS_TOKEN environment variable.");
  process.exit(1);
}

const client = new YouCanClient(ACCESS_TOKEN);

function createServer() {
  const server = new McpServer({ name: "youcan-mcp", version: "1.0.0" });

  // ── Products ──────────────────────────────────────────────────────────────
  server.tool("list_products", "List all products in your YouCan store",
    { page: z.number().optional(), limit: z.number().optional() },
    async ({ page = 1, limit = 20 }) => {
      const data = await client.get("/products", { page, limit });
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );

  server.tool("get_product", "Get details of a specific product by ID",
    { product_id: z.string() },
    async ({ product_id }) => {
      const data = await client.get(`/products/${product_id}`);
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );

  server.tool("create_product", "Create a new product in your YouCan store",
    { name: z.string(), price: z.number(), description: z.string().optional(), quantity: z.number().optional() },
    async (body) => {
      const data = await client.post("/products", body);
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );

  server.tool("update_product", "Update an existing product",
    { product_id: z.string(), name: z.string().optional(), price: z.number().optional(), description: z.string().optional(), quantity: z.number().optional(), has_variants: z.boolean().default(false) },
    async ({ product_id, ...body }) => {
      const data = await client.post(`/products/update/${product_id}`, body);
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );

  server.tool("delete_product", "Delete a product",
    { product_id: z.string() },
    async ({ product_id }) => {
      const data = await client.delete(`/products/${product_id}`);
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );

  // ── Orders ────────────────────────────────────────────────────────────────
  server.tool("list_orders", "List all orders in your YouCan store",
    { page: z.number().optional(), limit: z.number().optional() },
    async ({ page = 1, limit = 20 }) => {
      const data = await client.get("/orders", { page, limit });
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );

  server.tool("get_order", "Get details of a specific order by ID",
    { order_id: z.string() },
    async ({ order_id }) => {
      const data = await client.get(`/orders/${order_id}`);
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );

  server.tool("update_order_status", "Update the status of an order",
    { order_id: z.string(), status: z.number().describe("Status code: 1=pending, 2=processing, 3=shipped, 4=delivered, 5=canceled") },
    async ({ order_id, status }) => {
      const data = await client.put(`/orders/${order_id}/statuses`, { status });
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );

  server.tool("fulfill_order", "Mark an order as fulfilled/shipped",
    { order_id: z.string(), tracking_number: z.string().optional() },
    async ({ order_id, ...body }) => {
      const data = await client.post(`/orders/${order_id}/fulfill`, body);
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );

  // ── Customers ─────────────────────────────────────────────────────────────
  server.tool("list_customers", "List all customers in your YouCan store",
    { page: z.number().optional(), limit: z.number().optional() },
    async ({ page = 1, limit = 20 }) => {
      const data = await client.get("/customers", { page, limit });
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );

  server.tool("get_customer", "Get details of a specific customer",
    { customer_id: z.string() },
    async ({ customer_id }) => {
      const data = await client.get(`/customers/${customer_id}`);
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );

  server.tool("create_customer", "Create a new customer",
    { first_name: z.string(), last_name: z.string(), email: z.string().email(), phone: z.string().optional() },
    async (body) => {
      const data = await client.post("/customers", body);
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );

  // ── Coupons ───────────────────────────────────────────────────────────────
  server.tool("list_coupons", "List all coupons",
    { page: z.number().optional(), limit: z.number().optional() },
    async ({ page = 1, limit = 20 }) => {
      const data = await client.get("/coupons", { page, limit });
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );

  server.tool("create_coupon", "Create a discount coupon",
    { code: z.string(), discount_type: z.enum(["percentage", "fixed"]), discount_value: z.number(), expires_at: z.string().optional() },
    async (body) => {
      const data = await client.post("/coupons", body);
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );

  server.tool("delete_coupon", "Delete a coupon",
    { coupon_id: z.string() },
    async ({ coupon_id }) => {
      const data = await client.delete(`/coupons/${coupon_id}`);
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );

  // ── Store ─────────────────────────────────────────────────────────────────
  server.tool("get_store_details", "Get general information about your YouCan store",
    {},
    async () => {
      const data = await client.get("/store");
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );

  server.tool("get_store_profits", "Get profit and revenue summary",
    { start_date: z.string().optional(), end_date: z.string().optional() },
    async (params) => {
      const data = await client.get("/store/profits", params);
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );

  // ── Categories ────────────────────────────────────────────────────────────
  server.tool("list_categories", "List all product categories",
    { page: z.number().optional(), limit: z.number().optional() },
    async ({ page = 1, limit = 50 }) => {
      const data = await client.get("/categories", { page, limit });
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );

  // ── Shipping ──────────────────────────────────────────────────────────────
  server.tool("list_shipping_zones", "List all shipping zones",
    {},
    async () => {
      const data = await client.get("/shipping-zones");
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );

  // ── Inventory ─────────────────────────────────────────────────────────────
  server.tool("increment_inventory", "Increase stock quantity of a product",
    { product_id: z.string(), quantity: z.number() },
    async ({ product_id, quantity }) => {
      const data = await client.post(`/products/${product_id}/inventory/increment`, { quantity });
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );

  server.tool("decrement_inventory", "Decrease stock quantity of a product",
    { product_id: z.string(), quantity: z.number() },
    async ({ product_id, quantity }) => {
      const data = await client.post(`/products/${product_id}/inventory/decrement`, { quantity });
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );

  return server;
}

const app = express();
app.use(express.json());

app.all("/mcp", async (req, res) => {
  try {
    const server = createServer();
    const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
    res.on("finish", () => server.close());
  } catch (err) {
    console.error("MCP error:", err);
    if (!res.headersSent) res.status(500).json({ error: err.message });
  }
});

app.get("/", (req, res) => {
  res.json({ name: "YouCan MCP Server", version: "1.0.0", status: "running", mcp_endpoint: "/mcp" });
});

app.listen(PORT, () => {
  console.log(`✅ YouCan MCP server running on port ${PORT}`);
  console.log(`🔗 MCP endpoint: http://localhost:${PORT}/mcp`);
});
