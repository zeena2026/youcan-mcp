/**
 * YouCan MCP Server
 * Connects your YouCan store to Claude via the Model Context Protocol.
 *
 * Setup:
 *   1. Set environment variables (see .env.example)
 *   2. npm install
 *   3. npm start
 *   4. Add the server URL to Claude → Settings → Integrations → Add custom connector
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import express from "express";
import { z } from "zod";
import { YouCanClient } from "./youcan.js";

// ─── Config ──────────────────────────────────────────────────────────────────

const PORT = process.env.PORT || 3000;
const ACCESS_TOKEN = process.env.YOUCAN_ACCESS_TOKEN;

if (!ACCESS_TOKEN) {
  console.error(
    "❌  Missing YOUCAN_ACCESS_TOKEN environment variable.\n" +
    "    See README.md for setup instructions."
  );
  process.exit(1);
}

const client = new YouCanClient(ACCESS_TOKEN);

// ─── MCP Server ──────────────────────────────────────────────────────────────

const server = new McpServer({
  name: "youcan-mcp",
  version: "1.0.0",
});

// ── Products ──────────────────────────────────────────────────────────────────

server.tool(
  "list_products",
  "List all products in your YouCan store with pagination support",
  {
    page: z.number().optional().describe("Page number (default: 1)"),
    limit: z.number().optional().describe("Items per page (default: 20, max: 100)"),
    search: z.string().optional().describe("Search products by name"),
  },
  async ({ page = 1, limit = 20, search }) => {
    const params = { page, limit };
    if (search) params.search = search;
    const data = await client.get("/store/products", params);
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
);

server.tool(
  "get_product",
  "Get full details of a specific product by its ID",
  { product_id: z.string().describe("The product ID") },
  async ({ product_id }) => {
    const data = await client.get(`/store/products/${product_id}`);
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
);

server.tool(
  "create_product",
  "Create a new product in your YouCan store",
  {
    name: z.string().describe("Product name"),
    price: z.number().describe("Product price"),
    description: z.string().optional().describe("Product description (HTML allowed)"),
    quantity: z.number().optional().describe("Stock quantity"),
    sku: z.string().optional().describe("Stock Keeping Unit identifier"),
    status: z.enum(["active", "inactive"]).optional().describe("Product status"),
  },
  async (body) => {
    const data = await client.post("/store/products", body);
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
);

server.tool(
  "update_product",
  "Update an existing product in your YouCan store",
  {
    product_id: z.string().describe("The product ID to update"),
    name: z.string().optional().describe("New product name"),
    price: z.number().optional().describe("New product price"),
    description: z.string().optional().describe("New product description"),
    quantity: z.number().optional().describe("New stock quantity"),
    status: z.enum(["active", "inactive"]).optional().describe("New product status"),
  },
  async ({ product_id, ...body }) => {
    const data = await client.put(`/store/products/${product_id}`, body);
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
);

server.tool(
  "delete_product",
  "Delete a product from your YouCan store",
  { product_id: z.string().describe("The product ID to delete") },
  async ({ product_id }) => {
    const data = await client.delete(`/store/products/${product_id}`);
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
);

// ── Orders ────────────────────────────────────────────────────────────────────

server.tool(
  "list_orders",
  "List all orders in your YouCan store",
  {
    page: z.number().optional().describe("Page number (default: 1)"),
    limit: z.number().optional().describe("Items per page (default: 20)"),
    status: z.string().optional().describe("Filter by order status (e.g. pending, paid, canceled)"),
  },
  async ({ page = 1, limit = 20, status }) => {
    const params = { page, limit };
    if (status) params.status = status;
    const data = await client.get("/store/orders", params);
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
);

server.tool(
  "get_order",
  "Get full details of a specific order by its ID",
  { order_id: z.string().describe("The order ID") },
  async ({ order_id }) => {
    const data = await client.get(`/store/orders/${order_id}`);
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
);

server.tool(
  "update_order_status",
  "Update the status of an order (e.g. mark as paid, fulfilled, canceled)",
  {
    order_id: z.string().describe("The order ID"),
    status: z.string().describe("New status: pending, paid, processing, shipped, delivered, canceled, refunded"),
  },
  async ({ order_id, status }) => {
    const data = await client.put(`/store/orders/${order_id}/status`, { status });
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
);

server.tool(
  "fulfill_order",
  "Mark an order as fulfilled / shipped",
  {
    order_id: z.string().describe("The order ID to fulfill"),
    tracking_number: z.string().optional().describe("Shipping tracking number"),
    tracking_url: z.string().optional().describe("URL to track the shipment"),
  },
  async ({ order_id, ...body }) => {
    const data = await client.post(`/store/orders/${order_id}/fulfill`, body);
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
);

// ── Customers ─────────────────────────────────────────────────────────────────

server.tool(
  "list_customers",
  "List all customers in your YouCan store",
  {
    page: z.number().optional().describe("Page number (default: 1)"),
    limit: z.number().optional().describe("Items per page (default: 20)"),
    search: z.string().optional().describe("Search customers by name or email"),
  },
  async ({ page = 1, limit = 20, search }) => {
    const params = { page, limit };
    if (search) params.search = search;
    const data = await client.get("/store/customers", params);
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
);

server.tool(
  "get_customer",
  "Get details of a specific customer by their ID",
  { customer_id: z.string().describe("The customer ID") },
  async ({ customer_id }) => {
    const data = await client.get(`/store/customers/${customer_id}`);
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
);

server.tool(
  "create_customer",
  "Create a new customer in your YouCan store",
  {
    first_name: z.string().describe("Customer first name"),
    last_name: z.string().describe("Customer last name"),
    email: z.string().email().describe("Customer email address"),
    phone: z.string().optional().describe("Customer phone number"),
  },
  async (body) => {
    const data = await client.post("/store/customers", body);
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
);

// ── Coupons ───────────────────────────────────────────────────────────────────

server.tool(
  "list_coupons",
  "List all discount coupons in your YouCan store",
  {
    page: z.number().optional().describe("Page number"),
    limit: z.number().optional().describe("Items per page"),
  },
  async ({ page = 1, limit = 20 }) => {
    const data = await client.get("/store/coupons", { page, limit });
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
);

server.tool(
  "create_coupon",
  "Create a new discount coupon",
  {
    code: z.string().describe("Coupon code (e.g. SAVE20)"),
    discount_type: z.enum(["percentage", "fixed"]).describe("Type of discount"),
    discount_value: z.number().describe("Discount amount or percentage"),
    expires_at: z.string().optional().describe("Expiry date in YYYY-MM-DD format"),
    usage_limit: z.number().optional().describe("Maximum number of uses"),
  },
  async (body) => {
    const data = await client.post("/store/coupons", body);
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
);

server.tool(
  "delete_coupon",
  "Delete a coupon by its ID",
  { coupon_id: z.string().describe("The coupon ID to delete") },
  async ({ coupon_id }) => {
    const data = await client.delete(`/store/coupons/${coupon_id}`);
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
);

// ── Store ─────────────────────────────────────────────────────────────────────

server.tool(
  "get_store_details",
  "Get general information and settings about your YouCan store",
  {},
  async () => {
    const data = await client.get("/store");
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
);

server.tool(
  "get_store_profits",
  "Get profit and revenue summary for your YouCan store",
  {
    start_date: z.string().optional().describe("Start date in YYYY-MM-DD format"),
    end_date: z.string().optional().describe("End date in YYYY-MM-DD format"),
  },
  async (params) => {
    const data = await client.get("/store/profits", params);
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
);

// ── Categories ────────────────────────────────────────────────────────────────

server.tool(
  "list_categories",
  "List all product categories in your YouCan store",
  { page: z.number().optional(), limit: z.number().optional() },
  async ({ page = 1, limit = 50 }) => {
    const data = await client.get("/store/categories", { page, limit });
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
);

server.tool(
  "create_category",
  "Create a new product category",
  {
    name: z.string().describe("Category name"),
    description: z.string().optional().describe("Category description"),
  },
  async (body) => {
    const data = await client.post("/store/categories", body);
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
);

// ── Shipping Zones ────────────────────────────────────────────────────────────

server.tool(
  "list_shipping_zones",
  "List all shipping zones configured in your YouCan store",
  {},
  async () => {
    const data = await client.get("/store/shipping-zones");
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
);

// ── Inventory ─────────────────────────────────────────────────────────────────

server.tool(
  "increment_inventory",
  "Increase the stock quantity of a product",
  {
    product_id: z.string().describe("The product ID"),
    quantity: z.number().describe("Amount to add to current stock"),
  },
  async ({ product_id, quantity }) => {
    const data = await client.post(`/store/products/${product_id}/inventory/increment`, { quantity });
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
);

server.tool(
  "decrement_inventory",
  "Decrease the stock quantity of a product",
  {
    product_id: z.string().describe("The product ID"),
    quantity: z.number().describe("Amount to subtract from current stock"),
  },
  async ({ product_id, quantity }) => {
    const data = await client.post(`/store/products/${product_id}/inventory/decrement`, { quantity });
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
);

// ─── HTTP Transport (Streamable HTTP for Claude) ──────────────────────────────

const app = express();
app.use(express.json());

app.all("/mcp", async (req, res) => {
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined, // stateless
  });
  await server.connect(transport);
  await transport.handleRequest(req, res, req.body);
});

// Health check endpoint
app.get("/", (req, res) => {
  res.json({
    name: "YouCan MCP Server",
    version: "1.0.0",
    status: "running",
    mcp_endpoint: "/mcp",
    tools: 20,
  });
});

app.listen(PORT, () => {
  console.log(`✅  YouCan MCP server running on port ${PORT}`);
  console.log(`🔗  MCP endpoint: http://localhost:${PORT}/mcp`);
  console.log(`    Add this URL to Claude → Settings → Integrations`);
});
