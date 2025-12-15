# Cíqì Chronicles - Deployment Guide

This project is a React application built with Vite. Follow these instructions to publish it to GitHub Pages.

## 1. Preparation

1.  Download all project files to a local folder on your computer.
2.  Open your terminal/command prompt in that folder.
3.  Install the dependencies:
    ```bash
    npm install
    ```

## 2. GitHub Setup

1.  Create a new **public** repository on GitHub (e.g., named `ciqi-timeline`).
2.  Update `vite.config.ts`:
    *   Change the `base` property to match your repository name.
    *   Example: If your repo is `my-name/history-project`, set `base: '/history-project/'`.
3.  Initialize Git and push:
    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    git branch -M main
    git remote add origin https://github.com/YOUR_USERNAME/ciqi-timeline.git
    git push -u origin main
    ```

## 3. Deploy to the Web

1.  Run the deploy script:
    ```bash
    npm run deploy
    ```
    *This command builds the app and pushes it to a `gh-pages` branch on your GitHub repo.*

2.  Go to your GitHub Repository Settings > **Pages**.
3.  Ensure "Deploy from a branch" is selected, and the branch is `gh-pages`.
4.  Your site will be live at `https://YOUR_USERNAME.github.io/ciqi-timeline/`!

## 4. How to Share Your Timeline

Because this is a static site without a backend database, your custom edits (new events, text changes) are saved in your **browser's local storage**.

To share your version with others:
1.  Open your live website.
2.  Make your edits.
3.  Click the **Share Icon** in the top right corner.
4.  This generates a special link containing your data. Send this link to your professor or friends.
    *   *Note: Embedded images (uploaded from files) cannot be shared via link due to size limits. Use Image URLs for shared content.*
