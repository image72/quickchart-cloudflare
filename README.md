# QuickChart Cloudflare Worker

A high-performance Chart.js rendering service running on Cloudflare Workers with Browser Rendering.

## Features

- ✅ **Fast**: ~175ms chart generation with browser session reuse (93% faster than cold start)
- ✅ **Compatible**: Drop-in replacement for QuickChart API
- ✅ **Scalable**: Runs on Cloudflare's global network
- ✅ **Simple**: No native dependencies, pure JavaScript
- ✅ **Smart**: Event-driven rendering, dynamic viewport sizing, warmup on deploy

## Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Start local dev server
npm run dev

# Test
npm test
```

### Deployment

```bash
# Deploy to Cloudflare
npm run deploy
```

**Note**: You need to enable [Cloudflare Browser Rendering](https://developers.cloudflare.com/browser-rendering/) in your account.

## API Usage

### POST with JSON Body

```javascript
fetch('https://your-worker.workers.dev/chart', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    chart: {
      type: 'bar',
      data: {
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        datasets: [{
          label: 'Revenue',
          data: [10, 20, 30, 40]
        }]
      }
    },
    w: 500,
    h: 300
  })
})
```

### GET with Query String

```html
<img src="https://your-worker.workers.dev/chart?c={chart}&w=500&h=300" />
```

### GET with Base64 Encoding

```
https://your-worker.workers.dev/chart?c=eyJ0eXBlIjoiYmFy...&encoding=base64
```

## Parameters

| Parameter | Short | Description | Example |
|-----------|-------|-------------|---------|
| chart | **c** | Chart.js configuration (JSON) | `{"type":"bar",...}` |
| width | **w** | Chart width in pixels | `500` |
| height | **h** | Chart height in pixels | `300` |
| backgroundColor | **bkg** | Background color | `white` |
| encoding | - | `url` (default) or `base64` | `base64` |

## Performance

| Metric | Value |
|--------|-------|
| First Request | ~2,000ms (browser initialization) |
| Subsequent Requests | **~175ms** (browser reused) |
| Throughput | ~6 req/s per session |

## Optimizations

- ✅ **Browser Session Reuse** - Durable Objects maintain persistent browser instances
- ✅ **Event-Driven Rendering** - Wait for actual Chart.js render completion, no arbitrary timeouts
- ✅ **Dynamic Viewport Sizing** - Viewport resized to match chart dimensions
- ✅ **Warmup on Deploy** - Pre-initialize browser on first request
- ✅ **Server-Timing Headers** - Performance metrics in response headers

## Architecture

```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │
       ▼
┌─────────────┐     ┌──────────────────┐
│   Worker    │────▶│ Durable Object   │
└─────────────┘     │ (Browser Session)│
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │  Puppeteer       │
                    │  (Chrome)        │
                    │  + Chart.js      │
                    └──────────────────┘
```

## Cost Estimate

- **Without optimization**: ~$500/month (100K requests)
- **With browser reuse**: ~$50/month (10x cheaper)
- Browser Rendering: ~$5/month base + $0.50 per million requests

## License

MIT

## Credits

Based on [QuickChart](https://github.com/typpo/quickchart) by Ian Webster.
