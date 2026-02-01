# Portfolio Publish & Share Flow

## Complete User Journey

### 1️⃣ Edit Portfolio
- User logs in and goes to Dashboard
- Selects a template (Web Developer, UI/UX, etc.)
- Fills in their information:
  - Profile (name, title, bio, images)
  - Skills & tech stack
  - Projects with descriptions
  - Social links

### 2️⃣ Save Portfolio
**User clicks "Save" button**

**What happens:**
```
Frontend → savePortfolioToBackend()
         → POST /api/portfolio/save
         → Backend saves to MongoDB
         → Auto-generates subdomain (e.g., "john-smith")
         → Returns portfolio ID
         → Shows success notification
```

**Where it's saved:**
- ✅ MongoDB (portfolios collection)
- ✅ LocalStorage (backup)
- Status: `isPublished: false` (draft)

### 3️⃣ Publish Portfolio
**User clicks "Publish Portfolio" button**

**What happens:**
```
Frontend → publishPortfolioToBackend()
         → First saves (if not already saved)
         → POST /api/portfolio/publish
         → Backend sets isPublished = true
         → Generates public URL
         → Returns: https://portiqqo.me/john-smith
```

**User sees:**
1. ✅ Success notification: "Portfolio published successfully! 🎉"
2. ✅ Shareable link displayed in toast:
   ```
   Your portfolio is LIVE!
   
   Share this link:
   https://portiqqo.me/john-smith
   
   Anyone can view your work at this link!
   ```
3. ✅ Link automatically copied to clipboard
4. ✅ "Link copied!" confirmation
5. ✅ Auto-redirect to dashboard after 2 seconds

### 4️⃣ Share Portfolio
**User shares the link** (e.g., `https://portiqqo.me/john-smith`)

**Recipients can:**
- ✅ Visit the link (no login required)
- ✅ View the complete portfolio
- ✅ See all projects, skills, contact info
- ✅ Click social media links
- ✅ View on any device (fully responsive)

### 5️⃣ Public View
**When someone visits the shared link:**

```
Browser → https://portiqqo.me/john-smith
        → Frontend route: /:subdomain
        → GET /api/portfolio/public/john-smith
        → Backend fetches portfolio
        → Increments view counter
        → Returns portfolio data
        → Renders appropriate template
```

**Features:**
- ✅ View counter badge
- ✅ Fully responsive design
- ✅ No login required
- ✅ Fast loading
- ✅ Professional presentation

## Example Flow

```
User: Sarah Johnson (UI/UX Designer)

1. Edits portfolio with:
   - Profile image
   - 5 projects
   - Design skills
   - Behance/Dribbble links

2. Clicks "Save"
   → Saved to MongoDB
   → Subdomain: "sarah-johnson"

3. Clicks "Publish Portfolio"
   → isPublished = true
   → Link: https://portiqqo.me/sarah-johnson
   → Link copied to clipboard

4. Shares link on:
   - LinkedIn profile
   - Twitter bio
   - Job applications
   - Email signature

5. Visitors see:
   - Professional UI/UX portfolio
   - All projects with images
   - Skills and tools
   - Social links
   - Contact information
   - View count: 127 views
```

## Technical Details

### Public URL Format
```
https://portiqqo.me/{subdomain}
```

### Subdomain Generation
```javascript
// Auto-generated from user's name
"John Smith" → "john-smith"
"Jane Doe" → "jane-doe"

// If exists, adds counter
"john-smith-1"
"john-smith-2"
```

### Database State

**Before Publish:**
```javascript
{
  subdomain: "john-smith",
  isPublished: false,  // Not accessible publicly
  views: 0
}
```

**After Publish:**
```javascript
{
  subdomain: "john-smith",
  isPublished: true,   // NOW publicly accessible
  views: 15            // Increments with each view
}
```

### API Endpoints

| Endpoint | Auth | Purpose |
|----------|------|---------|
| POST /api/portfolio/save | ✅ Required | Save draft |
| POST /api/portfolio/publish | ✅ Required | Make public |
| GET /api/portfolio/public/:subdomain | ❌ Public | View portfolio |

## Testing the Flow

### Local Testing
1. Start backend: `npm run dev` (port 5001)
2. Start frontend: `npm run dev` (port 3000)
3. Login → Dashboard → Select template
4. Fill in portfolio → Click "Save"
5. Click "Publish Portfolio"
6. Check notifications for link
7. Open link in incognito/new browser
8. Verify portfolio displays

### Sharing Test
1. Copy the generated link
2. Send to friend/another device
3. Open without logging in
4. Verify everything displays correctly
5. Check view counter increments

## What Users Can Do

### Portfolio Owner:
- ✅ Edit anytime (auto-saves)
- ✅ Update content
- ✅ Republish to update live version
- ✅ Track views
- ✅ Share unlimited times

### Portfolio Visitors:
- ✅ View complete portfolio
- ✅ No signup required
- ✅ Mobile-friendly viewing
- ✅ Click social links
- ✅ See contact info
- ✅ Browse projects

## Common Questions

**Q: Can I edit after publishing?**
A: Yes! Save changes and republish to update.

**Q: Can I unpublish?**
A: Not yet, but can be added (set isPublished to false).

**Q: Is the link permanent?**
A: Yes, as long as account is active.

**Q: Can I change my subdomain?**
A: Not currently, but can be added as feature.

**Q: How do I share my portfolio?**
A: Copy the link from publish notification and share anywhere!

**Q: Can I have multiple portfolios?**
A: Yes! One per template type (developer, designer, etc.)

---

**Status**: ✅ Fully Functional
**Last Updated**: February 1, 2026
