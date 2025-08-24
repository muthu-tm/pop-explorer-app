# Proof of Proof Explorer Dashboard

A modern Next.js dashboard application for exploring QDIP proofs, messages, and block status. This app has been converted from a Vue.js HTML application to a React-based Next.js application while maintaining the same design and functionality.

## Features

- **Messages Tab**: View and search messages by block number, thread ID, and leaf index
- **Proof Chains Tab**: Load and display proof chains with detailed layer information
- **Block Status Tab**: Monitor the status of different blocks (finalized, pending, skipped)
- **Validation Tab**: Validate proof chains and view validation results
- **Real-time Search**: Filter and search functionality across all data types
- **Responsive Design**: Modern UI built with Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **HTTP Client**: Axios
- **Build Tool**: Turbopack

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd pop-explorer-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

## API Endpoints

The dashboard expects the following API endpoints to be available:

- `GET /messages` - Retrieve messages with query parameters: `block`, `thread`, `leaf`
- `GET /finalproof` - Get proof chain data with parameters: `block`, `thread`, `leaf`
- `GET /status` - Get block status information
- `GET /validate` - Validate proofs with parameters: `block`, `thread`, `leaf`

## Usage

1. **Search & Filter**: Use the search form at the top to filter data by block number, thread ID, and leaf index
2. **Tab Navigation**: Switch between different data views using the tab navigation
3. **Data Loading**: Click the respective "Load" buttons in each tab to fetch data
4. **Block Details**: Click "View Details" in the Block Status tab to see messages for a specific block

## Conversion Details

This application was converted from a Vue.js HTML application (`dashboard.html`) to a Next.js React application. Key changes include:

- **State Management**: Vue.js reactive data converted to React hooks (`useState`, `useEffect`)
- **Event Handling**: Vue.js `@click` directives converted to React `onClick` handlers
- **Template Syntax**: Vue.js template syntax converted to JSX
- **Component Structure**: Single HTML file converted to a React functional component
- **Type Safety**: Added TypeScript interfaces for all data structures

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Main dashboard component
│   └── globals.css         # Global styles
├── package.json            # Dependencies and scripts
└── tsconfig.json           # TypeScript configuration
```

## Development

- **Hot Reload**: Changes are automatically reflected in the browser during development
- **TypeScript**: Full type safety for all components and data structures
- **ESLint**: Code quality and consistency enforcement
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
