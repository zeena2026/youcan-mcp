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

  server.tool("list_products", "List all products in your YouCan store",
    { page: z.number().optional(), limit: z.number().optional(), search: z.string().optional() },
    async ({ page = 1, limit = 20, search }) => {
      const params = { page, limit };
      if (search) params.search = search;
      const data = await client.get("/store/products", params);
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );

  server.tool("get_product", "Get details of a specific product",
    { product_id: z.string() },
    async ({ product_id }) => {
      const data = await client.get(`/store/products/${product_id}`);
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );

  server.tool("create_product", "Create a new product",
    { name: z.string(), price: z.number(), description: z.string().optional(), quantity: z.number().optional(), status: z.enum(["active","inactive"]).optional() },
    async (body) => {
      const data = await client.post("/store/products", body);
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );

  server.tool("update_product", "Update an existing product",
    { product_id: z.string(), name: z.string().optional(), price: z.number().optional(), description: z.string().optional(), quantity: z.number().optional(), status: z.enum(["active","inactive"]).optional() },
    async ({ product_id, ...body }) => {
      const data = await client.put(`/store/products/${product_id}`, body);
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );

  server.tool("delete_product", "Delete a product",
    { product_id: z.string() },
    async ({ product_id }) => {
      const data = await client.delete(`/store/products/${product_id}`);
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );

  server.tool("list_orders", "List all orders",
    { page: z.number().optional(), limit: z.number().optional(), status: z.string().optional() },
    async ({ page = 1, limit = 20, status }) => {
      const params = { page, limit };
      if (status) params.status = status;
      const data = await client.get("/store/orders", params);
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );

  server.tool("get_order", "Get details of a specific order",
    { order_id: z.string() },
    async ({ order_id }) => {
      const data = await client.get(`/store/orders/${order_id}`);
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );

  server.tool("update_order_status", "Update order status",
    { order_id: z.string(), status: z.string() },
    async ({ order_id, status }) => {
      const data = await client.put(`/store/orders/${order_id}/status`, { status });
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );

  server.tool("list_customers", "List all customers",
    { page: z.number().optional(), limit: z.number().optional(), search: z.string().optional() },
    async ({ page = 1, limit = 20, search }) => {
      const params = { page, limit };
      if (search) params.search = search;
      const data = await client.get("/store/customers", params);
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );

  server.tool("get_customer", "Get details of a specific customer",
    { customer_id: z.string() },
    async ({ customer_id }) => {
      const data = await client.get(`/store/customers/${customer_id}`);
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );

  server.tool("create_customer", "Create a new customer",
    { first_name: z.string(), last_name: z.string(), email: z.string().email(), phone: z.string().optional() },
    async (body) => {
      const data = await client.post("/store/customers", body);
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );

  server.tool("list_coupons", "List all coupons",
    { page: z.number().optional(), limit: z.number().optional() },
    async ({ page = 1, limit = 20 }) => {
      const data = await client.get("/store/coupons", { page, limit });
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );

  server.tool("create_coupon", "Create a new discount coupon",
    { code: z.string(), discount_type: z.enum(["percentage","fixed"]), discount_value: z.number(), expires_at: z.string().optional(), usage_limit: z.number().optional() },
    async (body) => {
      const data = await client.post("/store/coupons", body);
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );

  server.tool("delete_coupon", "Delete a coupon",
    { coupon_id: z.string() },
    async ({ coupon_id }) => {
      const data = await client.delete(`/store/coupons/${coupon_id}`);
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );

  server.tool("get_store_details", "Get general store information",
    {},
    async () => {
      const data = await client.get("/store");
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );

  server.tool("get_store_profits", "Get store profit and revenue summary",
    { start_date: z.string().optional(), end_date: z.string().optional() },
    async (params) => {
      const data = await client.get("/store/profits", params);
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );

  server.tool("list_categories", "List all product categories",
    { page: z.number().optional(), limit: z.number().optional() },
    async ({ page = 1, limit = 50 }) => {
      const data = await client.get("/store/categories", { page, limit });
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );

  server.tool("list_shipping_zones", "List all shipping zones",
    {},
    async () => {
      const data = await client.get("/store/shipping-zones");
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );

  server.tool("increment_inventory", "Increase stock quantity of a product",
    { product_id: z.string(), quantity: z.number() },
    async ({ product_id, quantity }) => {
      const data = await client.post(`/store/products/${product_id}/inventory/increment`, { quantity });
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );

  server.tool("decrement_inventory", "Decrease stock quantity of a product",
    { product_id: z.string(), quantity: z.number() },
    async ({ product_id, quantity }) => {
      const data = await client.post(`/store/products/${product_id}/inventory/decrement`, { quantity });
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
