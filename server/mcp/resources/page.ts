import { ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js'
import { getAgentDocument, listAgentPages } from '#agent-discovery'

export default defineMcpResource({
  description: 'A documentation page as markdown, the same document its `.md` URL serves.',
  uri: new ResourceTemplate('docs://pages{+path}', {
    list: async () => {
      const pages = await listAgentPages(useEvent())

      return {
        resources: pages.map(page => ({
          uri: `docs://pages${page.route}`,
          name: page.title || page.route,
          description: page.description,
          mimeType: 'text/markdown'
        }))
      }
    }
  }),
  handler: async (uri, { path }) => {
    const document = await getAgentDocument(useEvent(), String(path || '/'))
    if (!document || !('markdown' in document)) {
      throw new Error(`Page not found: ${uri.href}`)
    }

    return {
      contents: [{
        uri: uri.href,
        mimeType: 'text/markdown',
        text: document.markdown
      }]
    }
  },
  cache: '1h'
})
