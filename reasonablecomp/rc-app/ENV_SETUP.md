# Environment Variables Setup for Live Data APIs

To use real, live compensation data instead of static data, you need to set up the following environment variables:

## 1. No Environment Variables Required! 🎉

Both BLS and Glassdoor APIs work immediately without any setup:

- **BLS API**: FREE, no API key, 25 requests/day
- **Glassdoor API**: FREE, no API key, attribution required

**Just restart your app and both live data sources will work!**

## 2. API Setup Instructions:

### BLS API (FREE):
1. Go to https://www.bls.gov/developers/
2. **No registration or API key required**
3. Free tier: 25 requests/day (no API key needed)
4. **No environment variable needed** - works out of the box

### Glassdoor API:
1. Go to https://www.glassdoor.com/developer/index.htm
2. **No registration or API key required**
3. **Attribution required**: Must include their logo and link
4. **No environment variables needed** - works out of the box

## 3. What This Gives You:

✅ **Real BLS Data**: Official US government compensation statistics
✅ **Live Glassdoor Data**: Current market salaries from job postings (with proper attribution)
✅ **No More Static Data**: All compensation data is live and current
✅ **Multiple Sources**: Combines government and market data for accuracy

## 4. Fallback Behavior:

- If APIs are unavailable, the app will gracefully degrade
- BLS data is prioritized (most reliable)
- Glassdoor provides current market context
- Industry data remains as additional context

## 5. Rate Limits:

- **BLS**: 25-500 requests/day (depending on API key)
- **Glassdoor**: Varies by partnership level
- App automatically manages request limits and caching

## 6. Testing:

After setting up environment variables:
1. Restart your development server
2. Check browser console for API status
3. Verify data sources show "Live" instead of "Static"
4. Test with different states and roles

Your app will now pull real, live compensation data from official sources! 🎯
