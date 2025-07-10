# 🚀 Quick Setup Guide for Trolla

## Step 1: Set Up Supabase (5 minutes)

1. **Create Supabase Account**
   - Go to [supabase.com](https://supabase.com)
   - Sign up for a free account
   - Create a new project

2. **Get Your Credentials**
   - In your Supabase dashboard, go to Settings > API
   - Copy the "Project URL" and "anon public" key

3. **Set Up Database**
   - Go to SQL Editor in your Supabase dashboard
   - Copy and paste the entire contents of `supabase-setup.sql`
   - Click "Run" to create the database tables

## Step 2: Configure Environment Variables

1. **Local Development**
   ```bash
   cp env.example .env.local
   ```
   Edit `.env.local` and add your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_project_url_here
   VITE_SUPABASE_ANON_KEY=your_anon_key_here
   ```

2. **Test Locally**
   ```bash
   npm run dev
   ```
   Visit `http://localhost:5173` to test the app

## Step 3: Deploy to GitHub Pages

1. **Create GitHub Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/trolla.git
   git push -u origin main
   ```

2. **Add Environment Variables to GitHub**
   - Go to your GitHub repository
   - Settings > Secrets and variables > Actions
   - Add repository secrets:
     - `VITE_SUPABASE_URL`: Your Supabase project URL
     - `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key

3. **Deploy**
   - The GitHub Actions workflow will automatically deploy your app
   - Your app will be available at `https://yourusername.github.io/trolla/`

## Step 4: Share with Your Colleague

1. **Share the URL**: `https://yourusername.github.io/trolla/`
2. **Real-time Collaboration**: Both of you can now:
   - Create and edit boards together
   - See changes in real-time
   - Drag and drop cards between lists
   - All data is shared and synchronized

## Troubleshooting

- **"Missing Supabase environment variables"**: Make sure you've set up the `.env.local` file correctly
- **"Connection Error"**: Check that your Supabase credentials are correct
- **Build fails**: Make sure you've added the environment variables to GitHub repository secrets

## Features You'll Have

✅ **Real-time Collaboration**: See changes instantly  
✅ **Multiple Boards**: Create different project boards  
✅ **Drag & Drop**: Move cards between lists  
✅ **Mobile Responsive**: Works on all devices  
✅ **Free Hosting**: GitHub Pages + Supabase free tier  
✅ **No Login Required**: Simple shared access  

Your Trello alternative is now ready for collaboration! 🎉 