import { createMcpHandler } from "mcp-handler";
import { z } from "zod";

const handler = createMcpHandler(
  async (server) => {
    server.tool(
      "do-assetfinder",
      "Find related domains and subdomains using assetfinder for a given target. Returns a command to run locally because CLI binaries cannot execute on Vercel serverless.",
      {
        target: z
          .string()
          .describe(
            "The root domain (e.g., example.com) to discover associated subdomains and related domains.",
          ),
      },
      async ({ target }) => {
        const quotedTarget = `'${target.replace(/'/g, `'\\''`)}'`;
        const command = `assetfinder -subs-only ${quotedTarget}`;

        return {
          content: [
            {
              type: "text",
              text: `Assetfinder is a local CLI and cannot run in Vercel's serverless runtime. Run this command on a machine with assetfinder installed:\n\n${command}`,
            },
          ],
        };
      },
    );
  },
  {
    capabilities: {
      tools: {
        "do-assetfinder": {
          description:
            "Find related domains and subdomains using assetfinder for a given target.",
        },
      },
    },
  },
  {
    basePath: "",
    verboseLogs: true,
    maxDuration: 60,
    disableSse: true,
  },
);

export { handler as GET, handler as POST, handler as DELETE };
