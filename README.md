# Trolla - A Simple Trello Alternative

A modern, web-based kanban board application built with Vue.js and Tailwind CSS. Trolla provides a clean and intuitive interface for managing tasks and projects using the kanban methodology.

## Features

- **Board Management**: Create, edit, and delete boards
- **List Management**: Organize tasks into lists/columns
- **Card Management**: Create, edit, and delete cards with titles and descriptions
- **Drag and Drop**: Move cards between lists with intuitive drag and drop
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Local Storage**: Data persists in your browser's local storage
- **Modern UI**: Clean, modern interface built with Tailwind CSS

## Tech Stack

- **Frontend Framework**: Vue.js 3 with Composition API
- **Styling**: Tailwind CSS
- **State Management**: Pinia
- **Build Tool**: Vite
- **Language**: TypeScript
- **Deployment**: GitHub Pages ready

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd trolla
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

To build the project for production:

```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment.

## Usage

### Creating a Board
1. Click the "New Board" button in the header
2. Enter a title and optional description
3. Click "Create Board"

### Managing Lists
1. Click "Add List" to create a new list
2. Edit list titles by clicking on them
3. Delete lists using the trash icon

### Managing Cards
1. Click "Add a card" in any list
2. Enter a title and optional description
3. Click cards to edit them
4. Drag and drop cards between lists
5. Delete cards using the trash icon

### Switching Boards
1. Click "Switch Board" in the header
2. Select from your existing boards
3. Delete boards using the trash icon in the board selector

## Project Structure

```
src/
├── components/          # Vue components
│   ├── Board.vue       # Main board component
│   ├── List.vue        # List component
│   ├── CreateBoardModal.vue
│   ├── BoardSelectorModal.vue
│   ├── CreateListModal.vue
│   ├── CreateCardModal.vue
│   └── EditCardModal.vue
├── stores/             # Pinia stores
│   └── board.ts        # Board state management
├── assets/             # Static assets
│   └── main.css        # Tailwind CSS and custom styles
└── App.vue             # Root component
```

## Deployment & Shared Data Setup

### 1. Set Up Supabase (Free Backend)

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Go to Settings > API to get your project URL and anon key
4. Copy the `env.example` file to `.env.local` and fill in your Supabase credentials:
```bash
cp env.example .env.local
```

5. Run the database setup script in your Supabase SQL Editor:
   - Go to your Supabase dashboard
   - Navigate to SQL Editor
   - Copy and paste the contents of `supabase-setup.sql`
   - Run the script

### 2. Deploy to GitHub Pages

1. Create a GitHub repository and push your code:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/trolla.git
git push -u origin main
```

2. The GitHub Actions workflow will automatically deploy your app to GitHub Pages

3. Your app will be available at `https://<username>.github.io/trolla/`

### 3. Environment Variables for Production

For the deployed version to work, you need to add environment variables to your GitHub repository:

1. Go to your GitHub repository settings
2. Navigate to Secrets and variables > Actions
3. Add the following repository secrets:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key

### 4. Real-time Collaboration

Once deployed, you and your colleague can:
- Access the same boards simultaneously
- See real-time updates when either of you makes changes
- Drag and drop cards between lists
- Create, edit, and delete boards, lists, and cards

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Inspired by Trello's kanban board interface
- Built with Vue.js and Tailwind CSS
- Icons from Heroicons
