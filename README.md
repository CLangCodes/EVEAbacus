# EVE Abacus

EVE Abacus is an open source suite of tools for EVE Online industry planning, manufacturing calculation, and market analysis. It provides both a modern web interface and a robust backend API, supporting industrialists, traders, and planetary interaction planners in the EVE Online universe.

## Key Features

- **Manufacturing Calculator**: Plan and optimize manufacturing jobs, including bill of materials, production routing, and cost analysis.
- **Order Management**: Create, track, and analyze manufacturing orders with persistent storage and real-time statistics.
- **Market Analysis**: Integrate with EVE ESI for market data, price tracking, and regional comparisons.
- **Planetary Planner**: Search and filter planets for PI (Planetary Interaction) with advanced criteria and range-based queries.
- **Modern UI**: Responsive Next.js frontend with Tailwind CSS, dark mode, and dashboard layout.
- **API & Backend**: .NET backend with RESTful endpoints, robust validation, and scalable architecture.

## Project Structure

- **eve-abacus-webui/**: Next.js 15 frontend for manufacturing, market, and PI planning.
- **EVEAbacus.WebUI/**: Blazor/.NET backend web API and server-side components.
- **EVEAbacus.Application/**: Application logic and service layer.
- **EVEAbacus.Domain/**: Domain models and business logic.
- **EVEAbacus.Infrastructure/**: Data access, repositories, and integration services.

## Getting Started

Each subproject contains its own README and setup instructions. For frontend usage, see `eve-abacus-webui/README.md`. For backend/API, see `EVEAbacus.WebUI/` and related projects.

## Contributing

Contributions are welcome! Please fork the repository, create a feature branch, and submit a pull request. See subproject READMEs for coding guidelines and testing instructions.

## License

This project is open source under the MIT License:

---

MIT License

Copyright (c) Misfit Initiative

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---

EVE Online and all related trademarks are the property of CCP hf. EVE Abacus is a third-party tool and is not affiliated with or endorsed by CCP Games. 